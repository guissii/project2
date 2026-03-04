const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:admin@localhost:5432/postgres'
});

async function check() {
    try {
        const { rows } = await pool.query('SELECT id, full_name, email, role, is_premium_member FROM profiles');
        console.log("=== UTILISATEURS DANS POSTGRESQL ===");
        console.table(rows);
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
check();
