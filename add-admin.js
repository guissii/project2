import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;
const pool = new Pool({ connectionString: 'postgresql://postgres:admin@localhost:5432/postgres' });

async function createAdmin() {
    try {
        const password = 'admin';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const email = 'superadmin@taalim.ma';

        await pool.query(
            `INSERT INTO profiles (email, password_hash, full_name, role, onboarding_completed) 
       VALUES ($1, $2, $3, 'admin', true) 
       ON CONFLICT (email) DO UPDATE SET password_hash = $2`,
            [email, hash, 'Super Admin']
        );
        console.log(`Admin account created! Email: ${email} / Password: ${password}`);
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

createAdmin();
