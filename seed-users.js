import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;
const pool = new Pool({
    connectionString: 'postgresql://postgres:admin@localhost:5432/postgres',
});

async function run() {
    try {
        await pool.query('SELECT NOW()'); // test simple
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password123', salt);

        await pool.query(
            'INSERT INTO profiles (email, password_hash, full_name, role, onboarding_completed, is_premium_member) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING',
            ['admin@taalim.ma', hash, 'Administrateur', 'admin', true, true]
        );
        await pool.query(
            'INSERT INTO profiles (email, password_hash, full_name, role, onboarding_completed, is_premium_member) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING',
            ['student@taalim.ma', hash, 'Élève Test', 'student', false, false]
        );

        console.log('Test users created successfully.');
    } catch (err) {
        console.error('Error creating users:', err);
    } finally {
        process.exit(0);
    }
}
run();
