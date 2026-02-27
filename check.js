import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: 'postgresql://postgres:admin@localhost:5432/postgres' });

async function check() {
    try {
        const gradeRes = await pool.query("SELECT id, name FROM grades WHERE name ILIKE '%2ème année baccalauréat%' OR name ILIKE '%2BAC%'");
        if (gradeRes.rows.length === 0) {
            console.log("2BAC not found");
            process.exit(0);
        }
        const gradeId = gradeRes.rows[0].id;
        console.log("Grade ID for 2BAC:", gradeId, gradeRes.rows[0].name);

        const branchRes = await pool.query(`
            SELECT b.name FROM branches b
            JOIN grade_branches gb ON b.id = gb.branch_id
            WHERE gb.grade_id = $1
        `, [gradeId]);

        console.log(`Found ${branchRes.rows.length} branches for 2BAC:`);
        console.log(branchRes.rows.map(b => b.name).join(', '));
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

check();
