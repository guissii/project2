-- ============================================================
-- Plateforme E-Learning Marocaine — Schéma Complet
-- Aligné sur le programme officiel MEN (Primaire→Collège→Lycée)
-- ============================================================

-- 1. Cycles (Primaire, Collège, Lycée)
CREATE TABLE cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,        -- Ex: "Lycée"
  name_ar VARCHAR(100),             -- Ex: "الثانوي التأهيلي"
  slug VARCHAR(20) UNIQUE NOT NULL, -- Ex: "lycee"
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Grades (Niveaux scolaires) : 1AP..6AP, 1AC..3AC, TC, 1BAC, 2BAC
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,        -- Ex: "2ème Année Baccalauréat"
  name_ar VARCHAR(150),              -- Ex: "الثانية بكالوريا"
  grade_code VARCHAR(20) UNIQUE NOT NULL, -- Ex: "2BAC"
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Branches (Filières) : SM, SE, SEG, Lettres, Arts, Pro...
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,        -- Ex: "Sciences Mathématiques A"
  name_ar VARCHAR(200),              -- Ex: "علوم رياضية أ"
  branch_code VARCHAR(30) UNIQUE NOT NULL, -- Ex: "SMA"
  category VARCHAR(50),              -- "general", "technologique", "professionnel"
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Grade-Branches (Quelles filières pour quel niveau)
CREATE TABLE grade_branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(grade_id, branch_id)
);

-- 5. Subjects (Matières) : Maths, Physique-Chimie, SVT, Français...
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,        -- Ex: "Mathématiques"
  name_ar VARCHAR(150),              -- Ex: "الرياضيات"
  code VARCHAR(30) UNIQUE NOT NULL,  -- Ex: "maths"
  icon VARCHAR(50),                  -- Lucide icon name
  color VARCHAR(30),                 -- Tailwind color class
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Courses (Combinaison Grade + Branch + Subject + Semester)
--    Ex: "Maths pour 2BAC SMA, Semestre 1"
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL, -- NULL = tronc commun / collège / primaire
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  semester INT NOT NULL CHECK (semester IN (1, 2)),
  option_langue VARCHAR(20) DEFAULT 'standard', -- 'standard', 'biof_fr', 'biof_en'
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(grade_id, branch_id, subject_id, semester)
);

-- 7. Units (Chapitres / Éléments de programme)
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,       -- Ex: "Limites et continuité"
  title_ar VARCHAR(255),             -- Ex: "النهايات والاتصال"
  description TEXT,                  -- Grande description pour la section
  unit_ref VARCHAR(30),              -- Ex: "MATH-A-01"
  "order" INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Resources (Contenus pédagogiques — remplace l'ancienne table "pdfs")
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(30) NOT NULL CHECK (type IN (
    'pdf_cours', 'pdf_resume', 'video_capsule',
    'exercices', 'correction', 'quiz',
    'controle_type', 'annales', 'methode'
  )),
  file_url TEXT,                     -- URL fichier/vidéo
  file_size_kb INT,
  difficulty INT CHECK (difficulty BETWEEN 1 AND 5),
  duration_min INT,                  -- Durée (vidéo/quiz)
  is_premium BOOLEAN DEFAULT false,
  downloads_count INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Exam Tags (Tags examens sur les resources)
CREATE TABLE exam_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  exam_type VARCHAR(30) NOT NULL,    -- 'controle_continu', 'local', 'regional', 'national', 'rattrapage'
  session VARCHAR(20),               -- 'normale', 'rattrapage'
  year INT,                          -- 2023, 2024...
  academy VARCHAR(100),              -- Académie (facultatif)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Profiles (Utilisateurs)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  grade_id UUID REFERENCES grades(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  onboarding_completed BOOLEAN DEFAULT false,
  is_premium_member BOOLEAN DEFAULT false,
  interests TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, resource_id)
);

-- 12. Reading History
CREATE TABLE reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, resource_id)
);

-- Indexes for performance
CREATE INDEX idx_grades_cycle ON grades(cycle_id);
CREATE INDEX idx_grade_branches_grade ON grade_branches(grade_id);
CREATE INDEX idx_grade_branches_branch ON grade_branches(branch_id);
CREATE INDEX idx_courses_grade ON courses(grade_id);
CREATE INDEX idx_courses_branch ON courses(branch_id);
CREATE INDEX idx_courses_subject ON courses(subject_id);
CREATE INDEX idx_units_course ON units(course_id);
CREATE INDEX idx_resources_unit ON resources(unit_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_exam_tags_resource ON exam_tags(resource_id);
