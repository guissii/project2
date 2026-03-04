const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    connectionString: 'postgresql://postgres:admin@localhost:5432/postgres'
});

async function run() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        const { rows: existingAdmins } = await pool.query("SELECT id FROM profiles WHERE email = 'admin.test@taalim.ma'");
        if (existingAdmins.length === 0) {
            await pool.query(
                "INSERT INTO profiles (email, full_name, password_hash, role, onboarding_completed, is_premium_member) VALUES ($1, $2, $3, $4, $5, $6)",
                ['admin.test@taalim.ma', 'Admin Test', hashedPassword, 'admin', true, false]
            );
        }

        const { rows: existingEleves } = await pool.query("SELECT id FROM profiles WHERE email = 'eleve.test@taalim.ma'");
        if (existingEleves.length === 0) {
            await pool.query(
                "INSERT INTO profiles (email, full_name, password_hash, role, grade, branch, onboarding_completed, is_premium_member) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                ['eleve.test@taalim.ma', 'Eleve Test', hashedPassword, 'student', '1BAC', 'SM', true, false]
            );
        }

        const mockUsers = [
            ['youssef.amrani@example.com', 'Youssef Amrani', 'student', '2BAC', 'SMA', true, false],
            ['lina.benali@example.com', 'Lina Benali', 'student', 'TC', 'SC', true, true],
            ['amina.tazi@example.com', 'Amina Tazi', 'student', '1BAC', 'SE', false, false]
        ];

        for (const user of mockUsers) {
            const { rows } = await pool.query('SELECT id FROM profiles WHERE email = $1', [user[0]]);
            if (rows.length === 0) {
                await pool.query(
                    "INSERT INTO profiles (email, full_name, password_hash, role, grade, branch, onboarding_completed, is_premium_member) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                    [user[0], user[1], hashedPassword, user[2], user[3], user[4], user[5], user[6]]
                );
            }
        }
        console.log("Seed complete");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding", err);
        process.exit(1);
    }
}
run();
