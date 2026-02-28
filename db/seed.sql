-- =========================================================================================
-- Seed Data : Plateforme E-Learning Marocaine — Architecture Simplifiée (Flattened)
-- =========================================================================================

-- 1. Insert Admin
INSERT INTO profiles (id, email, password_hash, full_name, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@taalim.ma', '$2b$10$eDKSjwQ8x1IxoqkUlVfBNlItboLwYBRPC/rnAaialXyYWPLuC.ty', 'Administrateur', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Student
INSERT INTO profiles (id, email, password_hash, full_name, role, grade, branch, is_premium_member)
VALUES ('00000000-0000-0000-0000-000000000002', 'student@taalim.ma', '$2b$10$eDKSjwQ8x1IxoqkUlVfBNlItboLwYBRPC/rnAaialXyYWPLuC.ty', 'Élève Test', 'student', '2BAC', 'SMA', true)
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Modules (Chapitres / Unités)
-- Tags structure: ['Cycle', 'Grade', 'Filière(s)', 'Semestre']
-- Subject = colonne séparée

-- >> MATHÉMATIQUES (2BAC SMA/SMB) <<
INSERT INTO modules (title, subject, tags, "order") VALUES 
  ('Limites et continuité', 'Mathématiques', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'S1'], 1),
  ('Dérivation et étude des fonctions', 'Mathématiques', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'S1'], 2),
  ('Suites numériques', 'Mathématiques', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'S1'], 3),
  ('Fonction logarithme népérien', 'Mathématiques', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'S1'], 4),
  ('Fonction exponentielle', 'Mathématiques', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'S1'], 5),
  ('Calcul intégral', 'Mathématiques', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'S2'], 6),
  ('Équations différentielles', 'Mathématiques', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'S2'], 7),
  ('Nombres complexes', 'Mathématiques', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'S2'], 8),
  ('Arithmétique', 'Mathématiques', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'S2'], 9),
  ('Géométrie dans l''espace', 'Mathématiques', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'S2'], 10),
  ('Probabilités', 'Mathématiques', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'S2'], 11);

-- >> PHYSIQUE-CHIMIE (2BAC SMA/SMB/PC) <<
INSERT INTO modules (title, subject, tags, "order") VALUES
  ('Ondes mécaniques progressives', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 1),
  ('Ondes mécaniques progressives périodiques', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 2),
  ('Propagation des ondes lumineuses', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 3),
  ('Décroissance radioactive & Noyaux, masse et énergie', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 4),
  ('Dipôle RC', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 5),
  ('Dipôle RL', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 6),
  ('Transformations lentes et rapides & Suivi temporel', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 7),
  ('Transformations chimiques s''effectuant dans les deux sens', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 8),
  ('État d''équilibre d''un système chimique', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 9),
  ('Transformations liées à des réactions acide-base', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 10),
  ('Oscillations libres d''un circuit RLC', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 11),
  ('Circuit RLC série en régime sinusoïdal forcé', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 12),
  ('Ondes électromagnétiques et Modulation d''amplitude', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 13),
  ('Cinématique du point', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 14),
  ('Loi de Newton', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 15),
  ('Applications aux mouvements rectilignes et circulaires', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 16),
  ('Poids / Masse / Accélération', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 17),
  ('Quantités de mouvement', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 18),
  ('Impulsion', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 19),
  ('Forces et interactions', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 20),
  ('Résultat des forces', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 21),
  ('Systèmes de forces', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 22),
  ('Dynamique du point', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 23),
  ('Travail et énergie', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 24),
  ('Énergie cinétique', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 25),
  ('Énergie potentielle', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 26),
  ('Théorème de l''énergie', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 27),
  ('Conservation de l''énergie mécanique', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 28),
  ('Évolution spontanée d''un système chimique (Piles)', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 29),
  ('Transformations forcées (Électrolyse)', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 30),
  ('Réactions d''estérification et d''hydrolyse', 'Physique-Chimie', ARRAY['Lycée', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 31);

-- >> SVT (2BAC SVT/PC) <<
INSERT INTO modules (title, subject, tags, "order") VALUES
  ('Consommation de la matière organique et flux d''énergie', 'S.V.T.', ARRAY['Lycée', '2BAC', 'SVT', 'PC', 'S1'], 1),
  ('Nature et expression du matériel génétique (Génie génétique)', 'S.V.T.', ARRAY['Lycée', '2BAC', 'SVT', 'S1'], 2),
  ('Transfert de l''information génétique par reproduction sexuée', 'S.V.T.', ARRAY['Lycée', '2BAC', 'SVT', 'S1'], 3),
  ('Génétique humaine', 'S.V.T.', ARRAY['Lycée', '2BAC', 'SVT', 'S1'], 4),
  ('La génétique des populations', 'S.V.T.', ARRAY['Lycée', '2BAC', 'SVT', 'S2'], 5),
  ('Immunologie: Notion de soi et non soi', 'S.V.T.', ARRAY['Lycée', '2BAC', 'SVT', 'S2'], 6),
  ('Immunologie: Les moyens de défense et dysfonctionnements', 'S.V.T.', ARRAY['Lycée', '2BAC', 'SVT', 'S2'], 7),
  ('Phénomènes géologiques liés à la formation des montagnes', 'S.V.T.', ARRAY['Lycée', '2BAC', 'SVT', 'PC', 'S2'], 8),
  ('Le métamorphisme et la granitisation', 'S.V.T.', ARRAY['Lycée', '2BAC', 'SVT', 'PC', 'S2'], 9);

-- >> PHILOSOPHIE (2BAC, toutes filières) <<
INSERT INTO modules (title, subject, tags, "order") VALUES
  ('La Condition Humaine: La Personne', 'Philosophie', ARRAY['Lycée', '2BAC', 'S1'], 1),
  ('La Condition Humaine: Autrui', 'Philosophie', ARRAY['Lycée', '2BAC', 'S1'], 2),
  ('La Connaissance: La Théorie et l''Expérience', 'Philosophie', ARRAY['Lycée', '2BAC', 'S1'], 3),
  ('La Connaissance: La Vérité', 'Philosophie', ARRAY['Lycée', '2BAC', 'S1'], 4),
  ('La Politique: L''État', 'Philosophie', ARRAY['Lycée', '2BAC', 'S2'], 5),
  ('La Politique: Le Droit et la Justice', 'Philosophie', ARRAY['Lycée', '2BAC', 'S2'], 6),
  ('L''Éthique: Le Devoir', 'Philosophie', ARRAY['Lycée', '2BAC', 'S2'], 7),
  ('L''Éthique: La Liberté', 'Philosophie', ARRAY['Lycée', '2BAC', 'S2'], 8),
  ('Méthodologie philosophique appliquée', 'Philosophie', ARRAY['Lycée', '2BAC', 'S2'], 9);

-- >> ANGLAIS (2BAC, toutes filières) <<
INSERT INTO modules (title, subject, tags, "order") VALUES
  ('Unit 1: Gifts of Youth', 'Anglais', ARRAY['Lycée', '2BAC', 'S1'], 1),
  ('Unit 2: Humor', 'Anglais', ARRAY['Lycée', '2BAC', 'S1'], 2),
  ('Unit 3: Formal, Informal and Non-formal Education', 'Anglais', ARRAY['Lycée', '2BAC', 'S1'], 3),
  ('Unit 4: Sustainable Development', 'Anglais', ARRAY['Lycée', '2BAC', 'S1'], 4),
  ('Unit 5: Women and Power', 'Anglais', ARRAY['Lycée', '2BAC', 'S1'], 5),
  ('Unit 6: Cultural Values', 'Anglais', ARRAY['Lycée', '2BAC', 'S2'], 6),
  ('Unit 7: Citizenship', 'Anglais', ARRAY['Lycée', '2BAC', 'S2'], 7),
  ('Unit 8: International Organizations', 'Anglais', ARRAY['Lycée', '2BAC', 'S2'], 8),
  ('Unit 9: Advances in Science and Technology', 'Anglais', ARRAY['Lycée', '2BAC', 'S2'], 9),
  ('Unit 10: Brain Drain', 'Anglais', ARRAY['Lycée', '2BAC', 'S2'], 10);
