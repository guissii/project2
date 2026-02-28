-- ============================================================
-- Plateforme E-Learning Marocaine — Architecture Simplifiée
-- ============================================================

-- Suppression de toutes les anciennes tables
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

-- 1. Profiles (Utilisateurs / Abonnés)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  grade VARCHAR(100),  -- Ex: "2BAC"
  branch VARCHAR(100), -- Ex: "SMA"
  onboarding_completed BOOLEAN DEFAULT false,
  is_premium_member BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Modules (L'entité centrale : Chapitres ou Unités Pédagogiques)
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,       -- Ex: "Limites et continuité"
  description TEXT,                  
  subject VARCHAR(100) NOT NULL,     -- Ex: "Mathématiques", "Physique-Chimie"
  tags TEXT[],                       -- Ex: ['2BAC', 'SMA', 'S1', 'Mathématiques']
  "order" INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Resources (Les fichiers Google Drive, YouTube, liés aux Modules)
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(30) NOT NULL CHECK (type IN (
    'pdf_cours', 'pdf_resume', 'video_capsule',
    'exercices', 'correction', 'quiz',
    'controle_type', 'annales', 'methode'
  )),
  file_url TEXT,                     -- URL du PDF (Drive) ou de la Vidéo (YouTube)
  downloads_count INT DEFAULT 0,     -- Nombre de consultations/téléchargements
  is_premium BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Favorites (Favoris de l'élève)
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, resource_id)
);

-- 5. Track read progress (Historique de lecture)
CREATE TABLE reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, resource_id)
);

-- Indexes pour les performances de tri & filtres
CREATE INDEX idx_modules_subject ON modules(subject);
CREATE INDEX idx_modules_tags ON modules USING GIN (tags);
CREATE INDEX idx_resources_module ON resources(module_id);
