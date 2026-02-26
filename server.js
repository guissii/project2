import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

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
        if (!gradeId) return res.json([]);
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

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 API running on http://localhost:${PORT}`);
});
