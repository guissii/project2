import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;
const pool = new Pool({
    connectionString: 'postgresql://postgres:admin@localhost:5432/postgres'
});

async function run() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Check if admin test user exists
        const { rows: existingAdmins } = await pool.query('SELECT id FROM profiles WHERE email = $1', ['admin.test@taalim.ma']);
        if (existingAdmins.length === 0) {
            await pool.query(
                `INSERT INTO profiles (email, full_name, password_hash, role, grade, branch, onboarding_completed, is_premium_member)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                ['admin.test@taalim.ma', 'Admin Test', hashedPassword, 'admin', null, null, true, false]
            );
            console.log('✅ Admin Test a été ajouté.');
        } else {
            console.log('ℹ️ Admin Test existe déjà.');
        }

        // Check if eleve test exists
        const { rows: existingEleves } = await pool.query('SELECT id FROM profiles WHERE email = $1', ['eleve.test@taalim.ma']);
        if (existingEleves.length === 0) {
            await pool.query(
                `INSERT INTO profiles (email, full_name, password_hash, role, grade, branch, onboarding_completed, is_premium_member)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                ['eleve.test@taalim.ma', 'Élève Test', hashedPassword, 'student', '1BAC', 'SM', true, false]
            );
            console.log('✅ Élève Test a été ajouté.');
        } else {
            console.log('ℹ️ Élève Test existe déjà.');
        }

        // Add random mock users
        const mockUsers = [
            ['youssef.amrani@example.com', 'Youssef Amrani', 'student', '2BAC', 'SMA', true, false],
            ['lina.benali@example.com', 'Lina Benali', 'student', 'TC', 'SC', true, true],
            ['amina.tazi@example.com', 'Amina Tazi', 'student', '1BAC', 'SE', false, false]
        ];

        for (const user of mockUsers) {
            const { rows } = await pool.query('SELECT id FROM profiles WHERE email = $1', [user[0]]);
            if (rows.length === 0) {
                await pool.query(
                    `INSERT INTO profiles (email, full_name, password_hash, role, grade, branch, onboarding_completed, is_premium_member)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [user[0], user[1], hashedPassword, user[2], user[3], user[4], user[5], user[6]]
                );
                console.log(`✅ ${user[1]} a été ajouté.`);
            } else {
                console.log(`ℹ️ ${user[1]} existe déjà.`);
            }
        }

        console.log('🎉 Insertion des utilisateurs terminée !');
    } catch (err) {
        console.error('Erreur lors de l\\'insertion: ', err);
    } finally {
        pool.end();
    }
}

run();
