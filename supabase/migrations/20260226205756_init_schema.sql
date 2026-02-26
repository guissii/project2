-- Architecture SaaS : Plateforme Nationale Élèves (Centrée PDF)

-- 1. Niveaux (Grades) : ex. 3AC, 1BAC, 2BAC
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  grade_code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Matières (Subjects) : ex. Mathématiques, Physique-Chimie
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  icon VARCHAR(50), -- Pour UI (ex: 'Calculator')
  color VARCHAR(50), -- Pour UI (ex: 'bg-blue-100')
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Cours / Programme (Grade_Subjects) : Liaison Niveau <-> Matière avec Semestre
CREATE TABLE grade_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_id UUID REFERENCES grades(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  semester INT CHECK (semester IN (1, 2)), -- Semestre 1 ou 2
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(grade_id, subject_id, semester)
);

-- 4. Chapitres (Units) : Rattachés à un Grade_Subject
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_subject_id UUID REFERENCES grade_subjects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. PDFs (Resources) : Le coeur de la plateforme
CREATE TABLE pdfs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('cours', 'exercices', 'examens')),
  file_url TEXT NOT NULL,
  file_size_kb INT, -- Pour UX (Indication taille fichier)
  downloads_count INT DEFAULT 0, -- Statistiques
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Profils Utilisateurs (Profiles) : Liés à Auth Supabase
CREATE TABLE profiles (
  id UUID PRIMARY KEY, -- Correspond au auth.uid() de Supabase
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  grade_id UUID REFERENCES grades(id) ON DELETE SET NULL, -- Niveau actuel de l'élève
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Favoris Élève (Favorites)
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pdf_id UUID REFERENCES pdfs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(profile_id, pdf_id)
);

-- 8. Historique de Lecture (Reading History)
CREATE TABLE reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pdf_id UUID REFERENCES pdfs(id) ON DELETE CASCADE,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(profile_id, pdf_id)
);

-- RLS (Row Level Security) - Sécurisation des données élèves
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;

-- Exemples de Policies (À affiner plus tard)
-- Les utilisateurs peuvent voir/modifier uniquement leur propre profil
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Favoris et Historique restreints au propriétaire
CREATE POLICY "Users manage own favorites" ON favorites FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Users manage own history" ON reading_history FOR ALL USING (auth.uid() = profile_id);
