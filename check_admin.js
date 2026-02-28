import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: 'postgresql://postgres:admin@localhost:5432/postgres'
});

async function run() {
    try {
        const res = await pool.query("SELECT id, email, role, password_hash FROM profiles");
        console.log(res.rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
