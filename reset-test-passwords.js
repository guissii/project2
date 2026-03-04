import bcrypt from 'bcryptjs';
import pg from 'pg';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:admin@localhost:5432/postgres',
});

async function resetPasswords() {
    try {
        const hash = await bcrypt.hash('password123', 10);
        console.log('New hash generated');

        // Check if accounts exist
        const existing = await pool.query(`SELECT email, role FROM profiles WHERE email IN ('student@taalim.ma', 'admin@taalim.ma')`);
        console.log('Existing accounts:', existing.rows);

        // Update student
        let r = await pool.query(
            `UPDATE profiles SET password_hash = $1 WHERE email = 'student@taalim.ma' RETURNING email, role`,
            [hash]
        );
        if (r.rowCount > 0) {
            console.log('✅ Student password reset:', r.rows[0]);
        } else {
            r = await pool.query(
                `INSERT INTO profiles (email, password_hash, full_name, role) VALUES ('student@taalim.ma', $1, 'Élève Test', 'student') RETURNING email, role`,
                [hash]
            );
            console.log('✅ Student account created:', r.rows[0]);
        }

        // Update admin
        r = await pool.query(
            `UPDATE profiles SET password_hash = $1 WHERE email = 'admin@taalim.ma' RETURNING email, role`,
            [hash]
        );
        if (r.rowCount > 0) {
            console.log('✅ Admin password reset:', r.rows[0]);
        } else {
            r = await pool.query(
                `INSERT INTO profiles (email, password_hash, full_name, role) VALUES ('admin@taalim.ma', $1, 'Admin Test', 'admin') RETURNING email, role`,
                [hash]
            );
            console.log('✅ Admin account created:', r.rows[0]);
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

resetPasswords();
