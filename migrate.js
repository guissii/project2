import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new pg.Pool({
    connectionString: 'postgresql://postgres:admin@localhost:5432/postgres',
});

async function run() {
    const client = await pool.connect();
    try {
        // Drop all old tables
        console.log('⏳ Dropping old tables...');
        await client.query(`
            DROP TABLE IF EXISTS reading_history, favorites, exam_tags, resources,
                units, courses, grade_branches, branches, grades, cycles, profiles,
                pdfs, grade_subjects, subjects CASCADE;
        `);
        console.log('✅ Old tables dropped.');

        // Apply new schema
        console.log('⏳ Applying new schema...');
        const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
        await client.query(schema);
        console.log('✅ Schema applied.');

        // Apply seed
        console.log('⏳ Seeding data...');
        const seed = fs.readFileSync(path.join(__dirname, 'db', 'seed-full.sql'), 'utf8');
        await client.query(seed);
        console.log('✅ Seed data inserted.');

        // Quick verification
        const cycles = await client.query('SELECT COUNT(*) FROM cycles');
        const grades = await client.query('SELECT COUNT(*) FROM grades');
        const branches = await client.query('SELECT COUNT(*) FROM branches');
        const subjects = await client.query('SELECT COUNT(*) FROM subjects');
        const courses = await client.query('SELECT COUNT(*) FROM courses');
        const units = await client.query('SELECT COUNT(*) FROM units');
        const resources = await client.query('SELECT COUNT(*) FROM resources');

        console.log('\n📊 Database contents:');
        console.log(`   Cycles:    ${cycles.rows[0].count}`);
        console.log(`   Grades:    ${grades.rows[0].count}`);
        console.log(`   Branches:  ${branches.rows[0].count}`);
        console.log(`   Subjects:  ${subjects.rows[0].count}`);
        console.log(`   Courses:   ${courses.rows[0].count}`);
        console.log(`   Units:     ${units.rows[0].count}`);
        console.log(`   Resources: ${resources.rows[0].count}`);
        console.log('\n🚀 Migration complete!');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        console.error(err);
    } finally {
        client.release();
        await pool.end();
    }
}

run();
