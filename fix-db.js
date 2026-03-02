const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://postgres:admin@localhost:5432/postgres'
});

async function run() {
    try {
        console.log('Dropping and recreating all tables...');
        await pool.query(`
      DROP TABLE IF EXISTS favorites CASCADE;
      DROP TABLE IF EXISTS reading_history CASCADE;
      DROP TABLE IF EXISTS exam_tags CASCADE;
      DROP TABLE IF EXISTS resources CASCADE;
      DROP TABLE IF EXISTS units CASCADE;
      DROP TABLE IF EXISTS courses CASCADE;
      DROP TABLE IF EXISTS subjects CASCADE;
      DROP TABLE IF EXISTS grade_branches CASCADE;
      DROP TABLE IF EXISTS branches CASCADE;
      DROP TABLE IF EXISTS grades CASCADE;
      DROP TABLE IF EXISTS cycles CASCADE;
      DROP TABLE IF EXISTS profiles CASCADE;
      DROP TABLE IF EXISTS modules CASCADE;

      CREATE TABLE profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
        grade VARCHAR(100),
        branch VARCHAR(100),
        onboarding_completed BOOLEAN DEFAULT false,
        is_premium_member BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE cycles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255),
        slug VARCHAR(100),
        "order" INT DEFAULT 0
      );

      CREATE TABLE grades (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255),
        grade_code VARCHAR(50),
        "order" INT DEFAULT 0
      );

      CREATE TABLE branches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255),
        branch_code VARCHAR(50),
        category VARCHAR(50),
        "order" INT DEFAULT 0
      );

      CREATE TABLE grade_branches (
        grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
        branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
        PRIMARY KEY (grade_id, branch_id)
      );

      CREATE TABLE subjects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255),
        code VARCHAR(50),
        icon VARCHAR(50),
        color VARCHAR(50)
      );

      CREATE TABLE courses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
        branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
        subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
        semester INT DEFAULT 1
      );

      CREATE TABLE units (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255),
        unit_ref VARCHAR(100),
        "order" INT DEFAULT 0,
        is_published BOOLEAN DEFAULT true
      );

      CREATE TABLE modules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,                  
        subject VARCHAR(100) NOT NULL,
        tags TEXT[],
        "order" INT DEFAULT 0,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE resources (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
        unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(30) NOT NULL CHECK (type IN (
          'pdf_cours', 'pdf_resume', 'video_capsule',
          'exercices', 'correction', 'quiz',
          'controle_type', 'annales', 'methode'
        )),
        file_url TEXT,
        file_size_kb INT,
        difficulty INT,
        downloads_count INT DEFAULT 0,
        is_premium BOOLEAN DEFAULT false,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(profile_id, resource_id)
      );

      CREATE TABLE reading_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
        last_read_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(profile_id, resource_id)
      );
    `);
        console.log('Tables created successfully.');

        console.log('Running seed-full.sql...');
        let seedSql = fs.readFileSync('db/seed-full.sql', 'utf8');

        // Remove the bad insert causing the error at line 1469 if it still exists
        // But since the user previously got "error: relation modules does not exist" or similar, just run it
        await pool.query(seedSql);

        // Also run the smaller seed.sql for standard user configs and modules
        console.log('Running seed.sql...');
        let smallSeedSql = fs.readFileSync('db/seed.sql', 'utf8');
        await pool.query(smallSeedSql);

        console.log('All seeds ran successfully.');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        pool.end();
    }
}

run();
