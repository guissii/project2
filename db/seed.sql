-- =========================================================================================
-- Seed Data : 2ème Année Baccalauréat Sciences Mathématiques A (2BAC SMA) - Maroc
-- =========================================================================================

-- 1. Insert Grade (Niveau)
INSERT INTO grades (id, name, grade_code, description, "order")
VALUES 
  ('11111111-1111-1111-1111-111111111111', '2ème Année Baccalauréat Sciences Mathématiques A', '2BAC_SMA', 'Classe de Terminale, filière Sciences Mathématiques A', 12)
ON CONFLICT (grade_code) DO NOTHING;

-- 2. Insert Subjects (Matières)
INSERT INTO subjects (id, name, code, icon, color)
VALUES
  ('22222222-2222-2222-2222-222222222221', 'Mathématiques', 'MATH', 'Calculator', 'bg-blue-100'),
  ('22222222-2222-2222-2222-222222222222', 'Physique-Chimie', 'PC', 'Zap', 'bg-amber-100'),
  ('22222222-2222-2222-2222-222222222223', 'S.V.T.', 'SVT', 'Leaf', 'bg-emerald-100'),
  ('22222222-2222-2222-2222-222222222224', 'Philosophie', 'PHILO', 'Brain', 'bg-purple-100'),
  ('22222222-2222-2222-2222-222222222225', 'Anglais', 'EN', 'Globe', 'bg-rose-100')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

-- 3. Insert Grade_Subjects (Liaison Niveau - Matière - Semestre)
INSERT INTO grade_subjects (id, grade_id, subject_id, semester)
VALUES
  -- Math
  ('33333333-3333-3333-3333-333333333311', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 1),
  ('33333333-3333-3333-3333-333333333312', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 2),
  -- PC
  ('33333333-3333-3333-3333-333333333321', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 1),
  ('33333333-3333-3333-3333-333333333322', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 2),
  -- SVT
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', 1),
  ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', 2),
  -- PHILO
  ('33333333-3333-3333-3333-333333333341', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222224', 1),
  ('33333333-3333-3333-3333-333333333342', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222224', 2),
  -- EN
  ('33333333-3333-3333-3333-333333333351', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222225', 1),
  ('33333333-3333-3333-3333-333333333352', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222225', 2)
ON CONFLICT (grade_id, subject_id, semester) DO NOTHING;

-- 4. Insert Units (Chapitres)
-- Pour éviter des doublons lors d'exécutions multiples du script si les IDs ne sont pas fixés :
DELETE FROM units WHERE grade_subject_id IN (
  SELECT id FROM grade_subjects WHERE grade_id = '11111111-1111-1111-1111-111111111111'
);

INSERT INTO units (grade_subject_id, title, "order")
VALUES
  -- =========================================
  -- MATHÉMATIQUES (S1 & S2)
  -- =========================================
  -- S1
  ('33333333-3333-3333-3333-333333333311', 'Limites et continuité', 1),
  ('33333333-3333-3333-3333-333333333311', 'Dérivation et étude des fonctions (TAF)', 2),
  ('33333333-3333-3333-3333-333333333311', 'Suites numériques', 3),
  ('33333333-3333-3333-3333-333333333311', 'Fonctions logarithmiques', 4),
  ('33333333-3333-3333-3333-333333333311', 'Nombres complexes (Partie 1)', 5),
  -- S2
  ('33333333-3333-3333-3333-333333333312', 'Fonctions exponentielles', 1),
  ('33333333-3333-3333-3333-333333333312', 'Nombres complexes (Partie 2)', 2),
  ('33333333-3333-3333-3333-333333333312', 'Calcul intégral et Primitives', 3),
  ('33333333-3333-3333-3333-333333333312', 'Équations différentielles', 4),
  ('33333333-3333-3333-3333-333333333312', 'Arithmétique dans Z', 5),
  ('33333333-3333-3333-3333-333333333312', 'Structures algébriques', 6),
  ('33333333-3333-3333-3333-333333333312', 'Espaces vectoriels', 7),
  ('33333333-3333-3333-3333-333333333312', 'Probabilités', 8),

  -- =========================================
  -- PHYSIQUE-CHIMIE (S1 & S2)
  -- =========================================
  -- S1
  ('33333333-3333-3333-3333-333333333321', 'Ondes mécaniques progressives', 1),
  ('33333333-3333-3333-3333-333333333321', 'Ondes mécaniques progressives périodiques', 2),
  ('33333333-3333-3333-3333-333333333321', 'Propagation des ondes lumineuses', 3),
  ('33333333-3333-3333-3333-333333333321', 'Décroissance radioactive & Noyaux, masse et énergie', 4),
  ('33333333-3333-3333-3333-333333333321', 'Dipôle RC', 5),
  ('33333333-3333-3333-3333-333333333321', 'Dipôle RL', 6),
  ('33333333-3333-3333-3333-333333333321', 'Transformations lentes et rapides & Suivi temporel', 7),
  ('33333333-3333-3333-3333-333333333321', 'Transformations chimiques s''effectuant dans les deux sens', 8),
  ('33333333-3333-3333-3333-333333333321', 'État d''équilibre d''un système chimique', 9),
  ('33333333-3333-3333-3333-333333333321', 'Transformations liées à des réactions acide-base', 10),
  -- S2
  ('33333333-3333-3333-3333-333333333322', 'Oscillations libres d''un circuit RLC', 1),
  ('33333333-3333-3333-3333-333333333322', 'Circuit RLC série en régime sinusoïdal forcé', 2),
  ('33333333-3333-3333-3333-333333333322', 'Ondes électromagnétiques et Modulation d''amplitude', 3),
  ('33333333-3333-3333-3333-333333333322', 'Lois de Newton', 4),
  ('33333333-3333-3333-3333-333333333322', 'Chute libre verticale & Mouvements plans', 5),
  ('33333333-3333-3333-3333-333333333322', 'Mouvement des satellites et planètes', 6),
  ('33333333-3333-3333-3333-333333333322', 'Systèmes mécaniques oscillants & Aspects énergétiques', 7),
  ('33333333-3333-3333-3333-333333333322', 'Atome et mécanique de Newton', 8),
  ('33333333-3333-3333-3333-333333333322', 'Évolution spontanée d''un système chimique (Piles)', 9),
  ('33333333-3333-3333-3333-333333333322', 'Transformations forcées (Électrolyse)', 10),
  ('33333333-3333-3333-3333-333333333322', 'Réactions d''estérification et d''hydrolyse', 11),

  -- =========================================
  -- S.V.T. (S1 & S2)
  -- =========================================
  -- S1
  ('33333333-3333-3333-3333-333333333331', 'Consommation de la matière organique et flux d''énergie', 1),
  ('33333333-3333-3333-3333-333333333331', 'Nature et expression du matériel génétique (Génie génétique)', 2),
  ('33333333-3333-3333-3333-333333333331', 'Transfert de l''information génétique par reproduction sexuée', 3),
  ('33333333-3333-3333-3333-333333333331', 'Génétique humaine', 4),
  -- S2
  ('33333333-3333-3333-3333-333333333332', 'La génétique des populations', 1),
  ('33333333-3333-3333-3333-333333333332', 'Immunologie: Notion de soi et non soi', 2),
  ('33333333-3333-3333-3333-333333333332', 'Immunologie: Les moyens de défense et dysfonctionnements', 3),
  ('33333333-3333-3333-3333-333333333332', 'Phénomènes géologiques liés à la formation des montagnes', 4),
  ('33333333-3333-3333-3333-333333333332', 'Le métamorphisme et la granitisation', 5),

  -- =========================================
  -- PHILOSOPHIE (S1 & S2)
  -- =========================================
  -- S1
  ('33333333-3333-3333-3333-333333333341', 'La Condition Humaine: La Personne', 1),
  ('33333333-3333-3333-3333-333333333341', 'La Condition Humaine: Autrui', 2),
  ('33333333-3333-3333-3333-333333333341', 'La Connaissance: La Théorie et l''Expérience', 3),
  ('33333333-3333-3333-3333-333333333341', 'La Connaissance: La Vérité', 4),
  -- S2
  ('33333333-3333-3333-3333-333333333342', 'La Politique: L''État', 1),
  ('33333333-3333-3333-3333-333333333342', 'La Politique: Le Droit et la Justice', 2),
  ('33333333-3333-3333-3333-333333333342', 'L''Éthique: Le Devoir', 3),
  ('33333333-3333-3333-3333-333333333342', 'L''Éthique: La Liberté', 4),
  ('33333333-3333-3333-3333-333333333342', 'Méthodologie philosophique appliquée', 5),

  -- =========================================
  -- ANGLAIS (S1 & S2)
  -- =========================================
  -- S1
  ('33333333-3333-3333-3333-333333333351', 'Unit 1: Gifts of Youth', 1),
  ('33333333-3333-3333-3333-333333333351', 'Unit 2: Humor', 2),
  ('33333333-3333-3333-3333-333333333351', 'Unit 3: Formal, Informal and Non-formal Education', 3),
  ('33333333-3333-3333-3333-333333333351', 'Unit 4: Sustainable Development', 4),
  ('33333333-3333-3333-3333-333333333351', 'Unit 5: Women and Power', 5),
  -- S2
  ('33333333-3333-3333-3333-333333333352', 'Unit 6: Cultural Values', 1),
  ('33333333-3333-3333-3333-333333333352', 'Unit 7: Citizenship', 2),
  ('33333333-3333-3333-3333-333333333352', 'Unit 8: International Organizations', 3),
  ('33333333-3333-3333-3333-333333333352', 'Unit 9: Advances in Science and Technology', 4),
  ('33333333-3333-3333-3333-333333333352', 'Unit 10: Brain Drain', 5);

-- =========================================================================================
-- Seed Data : 2ème Année Baccalauréat Sciences Physiques (2BAC PC) - Maroc
-- =========================================================================================

-- 1. Insert Grade (Niveau)
INSERT INTO grades (id, name, grade_code, description, "order")
VALUES 
  ('11111111-1111-1111-1111-111111111112', '2ème Année Baccalauréat Sciences Physiques', '2BAC_PC', 'Classe de Terminale, filière Sciences Physiques', 13)
ON CONFLICT (grade_code) DO NOTHING;

-- 2. Insert Grade_Subjects (Liaison Niveau - Matière - Semestre)
INSERT INTO grade_subjects (id, grade_id, subject_id, semester)
VALUES
  -- Math
  ('33333333-3333-3333-3333-333333333411', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222221', 1),
  ('33333333-3333-3333-3333-333333333412', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222221', 2),
  -- PC
  ('33333333-3333-3333-3333-333333333421', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 1),
  ('33333333-3333-3333-3333-333333333422', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 2),
  -- SVT
  ('33333333-3333-3333-3333-333333333431', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222223', 1),
  ('33333333-3333-3333-3333-333333333432', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222223', 2),
  -- PHILO
  ('33333333-3333-3333-3333-333333333441', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222224', 1),
  ('33333333-3333-3333-3333-333333333442', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222224', 2),
  -- EN
  ('33333333-3333-3333-3333-333333333451', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222225', 1),
  ('33333333-3333-3333-3333-333333333452', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222225', 2)
ON CONFLICT (grade_id, subject_id, semester) DO NOTHING;

-- 4. Insert Units (Chapitres)
DELETE FROM units WHERE grade_subject_id IN (
  SELECT id FROM grade_subjects WHERE grade_id = '11111111-1111-1111-1111-111111111112'
);

INSERT INTO units (grade_subject_id, title, "order")
VALUES
  -- =========================================
  -- MATHÉMATIQUES (S1 & S2)
  -- =========================================
  -- S1
  ('33333333-3333-3333-3333-333333333411', 'Limites et continuité', 1),
  ('33333333-3333-3333-3333-333333333411', 'Dérivation et étude des fonctions', 2),
  ('33333333-3333-3333-3333-333333333411', 'Suites numériques', 3),
  ('33333333-3333-3333-3333-333333333411', 'Fonctions primitives', 4),
  ('33333333-3333-3333-3333-333333333411', 'Fonctions logarithmiques', 5),
  ('33333333-3333-3333-3333-333333333411', 'Nombres complexes (Partie 1)', 6),
  -- S2
  ('33333333-3333-3333-3333-333333333412', 'Fonctions exponentielles', 1),
  ('33333333-3333-3333-3333-333333333412', 'Nombres complexes (Partie 2)', 2),
  ('33333333-3333-3333-3333-333333333412', 'Calcul intégral', 3),
  ('33333333-3333-3333-3333-333333333412', 'Équations différentielles', 4),
  ('33333333-3333-3333-3333-333333333412', 'Géométrie dans l''espace', 5),
  ('33333333-3333-3333-3333-333333333412', 'Dénombrement et probabilités', 6),

  -- =========================================
  -- PHYSIQUE-CHIMIE (S1 & S2)
  -- =========================================
  -- S1
  ('33333333-3333-3333-3333-333333333421', 'Ondes mécaniques progressives', 1),
  ('33333333-3333-3333-3333-333333333421', 'Ondes mécaniques progressives périodiques', 2),
  ('33333333-3333-3333-3333-333333333421', 'Propagation des ondes lumineuses', 3),
  ('33333333-3333-3333-3333-333333333421', 'Décroissance radioactive & Noyaux, masse et énergie', 4),
  ('33333333-3333-3333-3333-333333333421', 'Dipôle RC', 5),
  ('33333333-3333-3333-3333-333333333421', 'Dipôle RL', 6),
  ('33333333-3333-3333-3333-333333333421', 'Transformations lentes et rapides & Suivi temporel', 7),
  ('33333333-3333-3333-3333-333333333421', 'Transformations chimiques s''effectuant dans les deux sens', 8),
  ('33333333-3333-3333-3333-333333333421', 'État d''équilibre d''un système chimique', 9),
  ('33333333-3333-3333-3333-333333333421', 'Transformations liées à des réactions acide-base', 10),
  -- S2
  ('33333333-3333-3333-3333-333333333422', 'Oscillations libres d''un circuit RLC', 1),
  ('33333333-3333-3333-3333-333333333422', 'Circuit RLC série en régime sinusoïdal forcé', 2),
  ('33333333-3333-3333-3333-333333333422', 'Ondes électromagnétiques et Modulation d''amplitude', 3),
  ('33333333-3333-3333-3333-333333333422', 'Lois de Newton', 4),
  ('33333333-3333-3333-3333-333333333422', 'Chute libre verticale & Mouvements plans', 5),
  ('33333333-3333-3333-3333-333333333422', 'Mouvement des satellites et planètes', 6),
  ('33333333-3333-3333-3333-333333333422', 'Systèmes mécaniques oscillants & Aspects énergétiques', 7),
  ('33333333-3333-3333-3333-333333333422', 'Évolution spontanée d''un système chimique (Piles)', 8),
  ('33333333-3333-3333-3333-333333333422', 'Transformations forcées (Électrolyse)', 9),
  ('33333333-3333-3333-3333-333333333422', 'Réactions d''estérification et d''hydrolyse', 10),
  ('33333333-3333-3333-3333-333333333422', 'Contrôle de l''évolution d''un système chimique', 11),

  -- =========================================
  -- S.V.T. (S1 & S2)
  -- =========================================
  -- S1
  ('33333333-3333-3333-3333-333333333431', 'Consommation de la matière organique et flux d''énergie', 1),
  ('33333333-3333-3333-3333-333333333431', 'Nature et expression du matériel génétique', 2),
  ('33333333-3333-3333-3333-333333333431', 'Transfert de l''information génétique par reproduction sexuée', 3),
  ('33333333-3333-3333-3333-333333333431', 'Lois statistiques de la transmission des caractères (Diploïdes)', 4),
  -- S2
  ('33333333-3333-3333-3333-333333333432', 'Ordures ménagères (Utilisation organiques/inorganiques)', 1),
  ('33333333-3333-3333-3333-333333333432', 'Pollution des milieux naturels', 2),
  ('33333333-3333-3333-3333-333333333432', 'Matières radioactives et énergie nucléaire', 3),
  ('33333333-3333-3333-3333-333333333432', 'Phénomènes géologiques liés à la tectonique des plaques', 4),
  ('33333333-3333-3333-3333-333333333432', 'Le métamorphisme', 5),
  ('33333333-3333-3333-3333-333333333432', 'La granitisation', 6),

  -- =========================================
  -- PHILOSOPHIE (S1 & S2)
  -- =========================================
  ('33333333-3333-3333-3333-333333333441', 'La Condition Humaine: La Personne', 1),
  ('33333333-3333-3333-3333-333333333441', 'La Condition Humaine: Autrui', 2),
  ('33333333-3333-3333-3333-333333333441', 'La Connaissance: La Théorie et l''Expérience', 3),
  ('33333333-3333-3333-3333-333333333441', 'La Connaissance: La Vérité', 4),
  ('33333333-3333-3333-3333-333333333442', 'La Politique: L''État', 1),
  ('33333333-3333-3333-3333-333333333442', 'La Politique: Le Droit et la Justice', 2),
  ('33333333-3333-3333-3333-333333333442', 'L''Éthique: Le Devoir', 3),
  ('33333333-3333-3333-3333-333333333442', 'L''Éthique: La Liberté', 4),
  ('33333333-3333-3333-3333-333333333442', 'Méthodologie philosophique appliquée', 5),

  -- =========================================
  -- ANGLAIS (S1 & S2)
  -- =========================================
  ('33333333-3333-3333-3333-333333333451', 'Unit 1: Gifts of Youth', 1),
  ('33333333-3333-3333-3333-333333333451', 'Unit 2: Humor', 2),
  ('33333333-3333-3333-3333-333333333451', 'Unit 3: Formal, Informal and Non-formal Education', 3),
  ('33333333-3333-3333-3333-333333333451', 'Unit 4: Sustainable Development', 4),
  ('33333333-3333-3333-3333-333333333451', 'Unit 5: Women and Power', 5),
  ('33333333-3333-3333-3333-333333333452', 'Unit 6: Cultural Values', 1),
  ('33333333-3333-3333-3333-333333333452', 'Unit 7: Citizenship', 2),
  ('33333333-3333-3333-3333-333333333452', 'Unit 8: International Organizations', 3),
  ('33333333-3333-3333-3333-333333333452', 'Unit 9: Advances in Science and Technology', 4),
  ('33333333-3333-3333-3333-333333333452', 'Unit 10: Brain Drain', 5);

-- END OF SCRIPT
