import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_dev';


const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:admin@localhost:5432/postgres',
});

const app = express();
app.use(cors());
app.use(express.json());

// ─── CYCLES ───
app.get('/api/cycles', async (_req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM cycles ORDER BY "order" ASC');
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// ─── GRADES (by cycle) ───
app.get('/api/grades', async (req, res) => {
    try {
        const { cycleId } = req.query;
        let query = 'SELECT * FROM grades';
        const params = [];
        if (cycleId) { params.push(cycleId); query += ` WHERE cycle_id = $1`; }
        query += ' ORDER BY "order" ASC';
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// ─── BRANCHES (by grade) ───
app.get('/api/branches', async (req, res) => {
    try {
        const { gradeId } = req.query;
        if (!gradeId) {
            const { rows } = await pool.query(`
                SELECT b.*, array_remove(array_agg(g.grade_code), NULL) as grades 
                FROM branches b 
                LEFT JOIN grade_branches gb ON b.id = gb.branch_id 
                LEFT JOIN grades g ON gb.grade_id = g.id 
                GROUP BY b.id 
                ORDER BY b."order" ASC
            `);
            return res.json(rows);
        }
        const { rows } = await pool.query(`
            SELECT b.* FROM branches b
            JOIN grade_branches gb ON b.id = gb.branch_id
            WHERE gb.grade_id = $1
            ORDER BY b."order" ASC
        `, [gradeId]);
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// ─── GRADES WITH BRANCHES (tree view for student library) ───
app.get('/api/grades-with-branches', async (req, res) => {
    try {
        const { cycleId } = req.query;
        if (!cycleId) return res.status(400).json({ error: 'cycleId is required' });

        // Get all grades for this cycle
        const gradesResult = await pool.query(
            'SELECT * FROM grades WHERE cycle_id = $1 ORDER BY "order" ASC',
            [cycleId]
        );

        // For each grade, fetch its branches
        const gradesWithBranches = await Promise.all(
            gradesResult.rows.map(async (grade) => {
                const branchesResult = await pool.query(`
                    SELECT b.* FROM branches b
                    JOIN grade_branches gb ON b.id = gb.branch_id
                    WHERE gb.grade_id = $1
                    ORDER BY b."order" ASC
                `, [grade.id]);
                return { ...grade, branches: branchesResult.rows };
            })
        );

        res.json(gradesWithBranches);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// ─── SUBJECTS (by grade + branch + semester) ───
app.get('/api/subjects', async (req, res) => {
    try {
        const { gradeId, branchId, semester } = req.query;
        let query = `
            SELECT s.*, c.id as course_id, c.semester
            FROM subjects s
            JOIN courses c ON s.id = c.subject_id
            WHERE 1=1
        `;
        const params = [];

        if (gradeId) { params.push(gradeId); query += ` AND c.grade_id = $${params.length}`; }
        if (branchId) { params.push(branchId); query += ` AND c.branch_id = $${params.length}`; }
        else if (gradeId) { query += ` AND c.branch_id IS NULL`; } // Collège/Primaire
        if (semester) { params.push(semester); query += ` AND c.semester = $${params.length}`; }

        query += ' ORDER BY s.name ASC';
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// ─── UNITS (by course) ───
app.get('/api/units', async (req, res) => {
    try {
        const { courseId } = req.query;
        if (!courseId) return res.json([]);
        const { rows } = await pool.query(
            'SELECT * FROM units WHERE course_id = $1 AND is_published = true ORDER BY "order" ASC',
            [courseId]
        );
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// ─── RESOURCES (by unit + optional type filter) ───
app.get('/api/resources', async (req, res) => {
    try {
        const { unitId, type } = req.query;
        if (!unitId) return res.json([]);
        let query = 'SELECT * FROM resources WHERE unit_id = $1 AND is_published = true';
        const params = [unitId];

        if (type) { params.push(type); query += ` AND type = $${params.length}`; }

        query += ' ORDER BY created_at DESC';
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// ─── BRIDGE: Modules by tags (for student navigation) ───
app.get('/api/modules-by-tags', async (req, res) => {
    try {
        const { gradeCode, branchCode, semester, subject } = req.query;

        let query = `SELECT * FROM modules WHERE is_published = true`;
        const params = [];

        if (gradeCode) { params.push(gradeCode); query += ` AND $${params.length} = ANY(tags)`; }
        if (branchCode) { params.push(branchCode); query += ` AND $${params.length} = ANY(tags)`; }
        if (semester) { params.push(`S${semester}`); query += ` AND $${params.length} = ANY(tags)`; }
        if (subject) { params.push(subject); query += ` AND subject = $${params.length}`; }

        query += ' ORDER BY "order" ASC';
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// ─── BRIDGE: Resources for a single module ───
app.get('/api/module-resources', async (req, res) => {
    try {
        const { moduleId, type } = req.query;
        if (!moduleId) return res.json([]);
        let query = 'SELECT * FROM resources WHERE module_id = $1 AND is_published = true';
        const params = [moduleId];
        if (type) { params.push(type); query += ` AND type = $${params.length}`; }
        query += ' ORDER BY created_at DESC';
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// ─── SEARCH (full-text across both unit-based AND module-based resources) ───
app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.json([]);
        const searchTerm = `%${q}%`;

        const { rows } = await pool.query(`
            (
                SELECT r.id, r.title, r.type, r.file_url, r.downloads_count, r.is_premium, r.is_published,
                       u.title as unit_title, s.name as subject_name, g.grade_code,
                       b.branch_code, c.semester, 'unit' as source
                FROM resources r
                JOIN units u ON r.unit_id = u.id
                JOIN courses c ON u.course_id = c.id
                JOIN subjects s ON c.subject_id = s.id
                JOIN grades g ON c.grade_id = g.id
                LEFT JOIN branches b ON c.branch_id = b.id
                WHERE r.is_published = true AND (
                    r.title ILIKE $1 OR u.title ILIKE $1 OR s.name ILIKE $1
                )
            )
            UNION ALL
            (
                SELECT r.id, r.title, r.type, r.file_url, r.downloads_count, r.is_premium, r.is_published,
                       m.title as unit_title, m.subject as subject_name, NULL as grade_code,
                       NULL as branch_code, NULL::int as semester, 'module' as source
                FROM resources r
                JOIN modules m ON r.module_id = m.id
                WHERE r.is_published = true AND m.is_published = true AND (
                    r.title ILIKE $1 OR m.title ILIKE $1 OR m.subject ILIKE $1
                )
            )
            ORDER BY downloads_count DESC
            LIMIT 50
        `, [searchTerm]);
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// ─── AUTHENTICATION MIDDLEWARE ───
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Accès refusé' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token invalide' });
        req.user = user;
        next();
    });
};

const authenticateAdmin = (req, res, next) => {
    authenticateToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Accès administrateur requis' });
        }
        next();
    });
};

// ─── AUTHENTICATION ROUTES ───
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, full_name, role = 'student' } = req.body;

        // Check if user exists
        const userExists = await pool.query('SELECT * FROM profiles WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert new user
        const result = await pool.query(
            `INSERT INTO profiles (email, password_hash, full_name, role, onboarding_completed) 
             VALUES ($1, $2, $3, $4, false) RETURNING id, email, full_name, role, onboarding_completed, grade, branch`,
            [email, password_hash, full_name, role]
        );

        const newUser = result.rows[0];
        const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: newUser });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch user
        const result = await pool.query('SELECT * FROM profiles WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
        }

        const user = result.rows[0];

        // Check password (fallback for non-hashed seed data if needed)
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword && user.password_hash !== password) {
            return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        const { password_hash, ...userWithoutPassword } = user;

        res.json({ token, user: userWithoutPassword });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, email, full_name, role, grade, branch, onboarding_completed, is_premium_member FROM profiles WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.json(result.rows[0]);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/auth/onboarding', authenticateToken, async (req, res) => {
    try {
        const { grade, branch } = req.body;

        const result = await pool.query(
            `UPDATE profiles 
             SET grade = $1, branch = $2, onboarding_completed = true 
             WHERE id = $3 RETURNING id, email, full_name, role, grade, branch, onboarding_completed, is_premium_member`,
            [grade || null, branch || null, req.user.id]
        );

        res.json(result.rows[0]);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// ─── ADMIN CMS ROUTES ───
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
    try {
        const usersCount = await pool.query("SELECT COUNT(*) FROM profiles WHERE role='student'");
        const resourcesCount = await pool.query("SELECT COUNT(*) FROM resources");
        const viewsCount = await pool.query("SELECT COALESCE(SUM(downloads_count), 0) as views FROM resources");

        res.json({
            students: parseInt(usersCount.rows[0].count, 10),
            resources: parseInt(resourcesCount.rows[0].count, 10),
            downloads: parseInt(viewsCount.rows[0].views, 10),
            consultations: parseInt(viewsCount.rows[0].views, 10) * 3 // Synthetic multiplier for consultations
        });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/admin/modules', authenticateAdmin, async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT * FROM modules
            ORDER BY "order" ASC, title ASC
        `);
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/admin/modules', authenticateAdmin, async (req, res) => {
    try {
        const { title, description, subject, tags, order, is_published } = req.body;
        const result = await pool.query(
            `INSERT INTO modules (title, description, subject, tags, "order", is_published)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, description || null, subject, tags || [], order || 0, is_published ?? true]
        );
        res.json(result.rows[0]);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/modules/:id', authenticateAdmin, async (req, res) => {
    try {
        const { title, description, subject, tags, order, is_published } = req.body;
        const result = await pool.query(
            `UPDATE modules 
             SET title = COALESCE($1, title), description = COALESCE($2, description), 
                 subject = COALESCE($3, subject), tags = COALESCE($4, tags),
                 "order" = COALESCE($5, "order"), 
                 is_published = COALESCE($6, is_published)
             WHERE id = $7 RETURNING *`,
            [title, description, subject, tags, order, is_published, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Module not found' });
        res.json(result.rows[0]);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/modules/:id', authenticateAdmin, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM modules WHERE id = $1 RETURNING id', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Module not found' });
        res.json({ success: true, id: req.params.id });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/admin/resources', authenticateAdmin, async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT r.*, m.title as module_title, m.subject as subject_name, m.tags
            FROM resources r
            JOIN modules m ON r.module_id = m.id
            ORDER BY r.created_at DESC
        `);
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/admin/resources', authenticateAdmin, async (req, res) => {
    try {
        const { module_id, title, type, file_url, is_premium, is_published } = req.body;
        const result = await pool.query(
            `INSERT INTO resources (module_id, title, type, file_url, is_premium, is_published)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [module_id, title, type, file_url, is_premium || false, is_published ?? true]
        );
        res.json(result.rows[0]);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/resources/:id', authenticateAdmin, async (req, res) => {
    try {
        const { title, type, file_url, is_premium, is_published } = req.body;
        const result = await pool.query(
            `UPDATE resources 
             SET title = COALESCE($1, title), type = COALESCE($2, type), file_url = COALESCE($3, file_url), 
                 is_premium = COALESCE($4, is_premium), 
                 is_published = COALESCE($5, is_published)
             WHERE id = $6 RETURNING *`,
            [title, type, file_url, is_premium, is_published, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Resource not found' });
        res.json(result.rows[0]);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/resources/:id', authenticateAdmin, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM resources WHERE id = $1 RETURNING id', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Resource not found' });
        res.json({ success: true, id: req.params.id });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// ─── ADMIN USERS MANAGEMENT ───
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT id, email, full_name, role, grade, branch, onboarding_completed, is_premium_member, created_at
            FROM profiles
            ORDER BY created_at DESC
        `);
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/admin/seed_users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Check if admin test user exists
        const { rows: existingAdmins } = await pool.query('SELECT id FROM profiles WHERE email = $1', ['admin.test@taalim.ma']);
        if (existingAdmins.length === 0) {
            await pool.query(
                `INSERT INTO profiles (email, full_name, password_hash, role, grade, branch, onboarding_completed, is_premium_member)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                ['admin.test@taalim.ma', 'Admin Test', hashedPassword, 'admin', null, null, true, false]
            );
        }

        // Check if eleve test exists
        const { rows: existingEleves } = await pool.query('SELECT id FROM profiles WHERE email = $1', ['eleve.test@taalim.ma']);
        if (existingEleves.length === 0) {
            await pool.query(
                `INSERT INTO profiles (email, full_name, password_hash, role, grade, branch, onboarding_completed, is_premium_member)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                ['eleve.test@taalim.ma', 'Élève Test', hashedPassword, 'student', '1BAC', 'SM', true, false]
            );
        }

        // Add random mock users
        const mockUsers = [
            ['youssef.amrani@example.com', 'Youssef Amrani', 'student', '2BAC', 'SMA', true, false],
            ['lina.benali@example.com', 'Lina Benali', 'student', 'TC', 'SC', true, true],
            ['amina.tazi@example.com', 'Amina Tazi', 'student', '1BAC', 'SE', false, false]
        ];

        for (const user of mockUsers) {
            const { rows } = await pool.query('SELECT id FROM profiles WHERE email = $1', [user[0]]);
            if (rows.length === 0) {
                await pool.query(
                    `INSERT INTO profiles (email, full_name, password_hash, role, grade, branch, onboarding_completed, is_premium_member)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [user[0], user[1], hashedPassword, user[2], user[3], user[4], user[5], user[6]]
                );
            }
        }
        res.json({ success: true, message: 'Database seeded successfully.' });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error', details: err.message }); }
});

app.put('/api/admin/users/:id/premium', authenticateAdmin, async (req, res) => {
    try {
        const { is_premium } = req.body;
        const result = await pool.query(
            `UPDATE profiles 
             SET is_premium_member = $1
             WHERE id = $2 RETURNING id, email, full_name, role, is_premium_member`,
            [is_premium, req.params.id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.json(result.rows[0]);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// ─── STUDENT PREMIUM VERIFICATION ───
app.get('/api/student/resource/:id', authenticateToken, async (req, res) => {
    try {
        // Fetch resource details
        const resourceRes = await pool.query('SELECT * FROM resources WHERE id = $1 AND is_published = true', [req.params.id]);
        if (resourceRes.rows.length === 0) return res.status(404).json({ error: 'Ressource introuvable' });

        const resource = resourceRes.rows[0];

        // Fetch user premium status
        const userRes = await pool.query('SELECT is_premium_member FROM profiles WHERE id = $1', [req.user.id]);
        if (userRes.rows.length === 0) return res.status(404).json({ error: 'Utilisateur introuvable' });

        const isUserPremium = userRes.rows[0].is_premium_member;

        // Check Access
        if (resource.is_premium && !isUserPremium) {
            return res.status(403).json({
                error: 'Premium Required',
                message: 'Cette ressource est réservée aux abonnés Premium.',
                resourceInfo: { title: resource.title, type: resource.type, is_premium: true }
            });
        }

        // Access Granted - Increase Download/View Count
        await pool.query('UPDATE resources SET downloads_count = downloads_count + 1 WHERE id = $1', [resource.id]);

        res.json({ success: true, resource });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 API running on http://localhost:${PORT}`);
});
