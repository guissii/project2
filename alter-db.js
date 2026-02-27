import pg from 'pg';

const pool = new pg.Pool({
    connectionString: 'postgresql://postgres:admin@localhost:5432/postgres',
});

async function run() {
    try {
        await pool.query('ALTER TABLE units ADD COLUMN IF NOT EXISTS description TEXT;');
        console.log('Added description column successfully.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
run();
