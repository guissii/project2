import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: 'postgresql://postgres:admin@localhost:5432/postgres' });
async function run() {
    try {
        const { rows } = await pool.query(`
            SELECT b.*, array_remove(array_agg(g.grade_code), NULL) as grades
            FROM branches b
            LEFT JOIN grade_branches gb ON b.id = gb.branch_id
            LEFT JOIN grades g ON gb.grade_id = g.id
            GROUP BY b.id
            ORDER BY b."order" ASC
        `);
        console.log(rows.length);
    } catch (err) {
        console.error("SQL ERROR:", err.message);
    }
    process.exit(0);
}
run();
