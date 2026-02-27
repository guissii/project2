import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_dev';


const pool = new Pool({
    connectionString: 'postgresql://postgres:admin@localhost:5432/postgres',
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

// ─── SEARCH (full-text across resources + units) ───
app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.json([]);
        const searchTerm = `%${q}%`;

        const { rows } = await pool.query(`
            SELECT r.*, u.title as unit_title, s.name as subject_name, g.grade_code,
                   b.branch_code, c.semester
            FROM resources r
            JOIN units u ON r.unit_id = u.id
            JOIN courses c ON u.course_id = c.id
            JOIN subjects s ON c.subject_id = s.id
            JOIN grades g ON c.grade_id = g.id
            LEFT JOIN branches b ON c.branch_id = b.id
            WHERE r.is_published = true AND (
                r.title ILIKE $1 OR u.title ILIKE $1 OR s.name ILIKE $1
            )
            ORDER BY r.downloads_count DESC
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
             VALUES ($1, $2, $3, $4, false) RETURNING id, email, full_name, role, onboarding_completed, grade_id, branch_id, interests`,
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
        const result = await pool.query('SELECT id, email, full_name, role, grade_id, branch_id, onboarding_completed, interests FROM profiles WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.json(result.rows[0]);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/auth/onboarding', authenticateToken, async (req, res) => {
    try {
        const { grade_id, branch_id, interests } = req.body;

        const result = await pool.query(
            `UPDATE profiles 
             SET grade_id = $1, branch_id = $2, interests = $3, onboarding_completed = true 
             WHERE id = $4 RETURNING id, email, full_name, role, grade_id, branch_id, onboarding_completed, interests`,
            [grade_id || null, branch_id || null, interests || [], req.user.id]
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

app.get('/api/admin/units', authenticateAdmin, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM units ORDER BY "order" ASC, title ASC');
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/admin/units', authenticateAdmin, async (req, res) => {
    try {
        const { course_id, title, description, unit_ref, order, is_published } = req.body;
        const result = await pool.query(
            `INSERT INTO units (course_id, title, description, unit_ref, "order", is_published)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [course_id, title, description, unit_ref || null, order || 0, is_published ?? true]
        );
        res.json(result.rows[0]);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/units/:id', authenticateAdmin, async (req, res) => {
    try {
        const { title, description, unit_ref, order, is_published } = req.body;
        const result = await pool.query(
            `UPDATE units 
             SET title = COALESCE($1, title), description = COALESCE($2, description), 
                 unit_ref = COALESCE($3, unit_ref), "order" = COALESCE($4, "order"), 
                 is_published = COALESCE($5, is_published)
             WHERE id = $6 RETURNING *`,
            [title, description, unit_ref, order, is_published, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Unit not found' });
        res.json(result.rows[0]);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/admin/resources', authenticateAdmin, async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT r.*, u.title as unit_title, s.name as subject_name, g.grade_code, b.branch_code
            FROM resources r
            JOIN units u ON r.unit_id = u.id
            JOIN courses c ON u.course_id = c.id
            JOIN subjects s ON c.subject_id = s.id
            JOIN grades g ON c.grade_id = g.id
            LEFT JOIN branches b ON c.branch_id = b.id
            ORDER BY r.created_at DESC
        `);
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/admin/resources', authenticateAdmin, async (req, res) => {
    try {
        const { unit_id, title, type, file_url, file_size_kb, difficulty, duration_min, is_premium, is_published } = req.body;
        const result = await pool.query(
            `INSERT INTO resources (unit_id, title, type, file_url, file_size_kb, difficulty, duration_min, is_premium, is_published)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [unit_id, title, type, file_url, file_size_kb, difficulty, duration_min, is_premium || false, is_published ?? true]
        );
        res.json(result.rows[0]);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/resources/:id', authenticateAdmin, async (req, res) => {
    try {
        const { title, type, file_url, file_size_kb, difficulty, duration_min, is_premium, is_published } = req.body;
        const result = await pool.query(
            `UPDATE resources 
             SET title = COALESCE($1, title), type = COALESCE($2, type), file_url = COALESCE($3, file_url), 
                 file_size_kb = COALESCE($4, file_size_kb), difficulty = COALESCE($5, difficulty), 
                 duration_min = COALESCE($6, duration_min), is_premium = COALESCE($7, is_premium), 
                 is_published = COALESCE($8, is_published)
             WHERE id = $9 RETURNING *`,
            [title, type, file_url, file_size_kb, difficulty, duration_min, is_premium, is_published, req.params.id]
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
