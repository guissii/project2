-- =========================================================================================
-- Seed Data : Plateforme E-Learning Marocaine â€” Architecture SimplifiÃ©e (Flattened)
-- =========================================================================================

-- 1. Insert Admin
INSERT INTO profiles (id, email, password_hash, full_name, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@taalim.ma', '$2b$10$VjtMznwpJLNWsTbrgPnriUtnZ7uHjFDeF39kRFpSG1ls.72i', 'Administrateur', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Student
INSERT INTO profiles (id, email, password_hash, full_name, role, grade, branch, is_premium_member)
VALUES ('00000000-0000-0000-0000-000000000002', 'student@taalim.ma', '$2b$10$VjtMznwpJLNWsTbrgPnriUtnZ7uHjFDeF39kRFpSG1ls.72i', 'Ã‰lÃ¨ve Test', 'student', '2BAC', 'SMA', true)
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Modules (Chapitres / UnitÃ©s)
-- Tags structure: ['Cycle', 'Grade', 'FiliÃ¨re(s)', 'Semestre']
-- Subject = colonne sÃ©parÃ©e

-- >> MATHÃ‰MATIQUES (2BAC SMA/SMB) <<
INSERT INTO modules (title, subject, tags, "order") VALUES 
  ('Limites et continuitÃ©', 'MathÃ©matiques', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'S1'], 1),
  ('DÃ©rivation et Ã©tude des fonctions', 'MathÃ©matiques', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'S1'], 2),
  ('Suites numÃ©riques', 'MathÃ©matiques', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'S1'], 3),
  ('Fonction logarithme nÃ©pÃ©rien', 'MathÃ©matiques', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'S1'], 4),
  ('Fonction exponentielle', 'MathÃ©matiques', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'S1'], 5),
  ('Calcul intÃ©gral', 'MathÃ©matiques', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'S2'], 6),
  ('Ã‰quations diffÃ©rentielles', 'MathÃ©matiques', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'S2'], 7),
  ('Nombres complexes', 'MathÃ©matiques', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'S2'], 8),
  ('ArithmÃ©tique', 'MathÃ©matiques', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'S2'], 9),
  ('GÃ©omÃ©trie dans l''espace', 'MathÃ©matiques', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'S2'], 10),
  ('ProbabilitÃ©s', 'MathÃ©matiques', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'S2'], 11);

-- >> PHYSIQUE-CHIMIE (2BAC SMA/SMB/PC) <<
INSERT INTO modules (title, subject, tags, "order") VALUES
  ('Ondes mÃ©caniques progressives', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 1),
  ('Ondes mÃ©caniques progressives pÃ©riodiques', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 2),
  ('Propagation des ondes lumineuses', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 3),
  ('DÃ©croissance radioactive & Noyaux, masse et Ã©nergie', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 4),
  ('DipÃ´le RC', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 5),
  ('DipÃ´le RL', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 6),
  ('Transformations lentes et rapides & Suivi temporel', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 7),
  ('Transformations chimiques s''effectuant dans les deux sens', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 8),
  ('Ã‰tat d''Ã©quilibre d''un systÃ¨me chimique', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 9),
  ('Transformations liÃ©es Ã  des rÃ©actions acide-base', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S1'], 10),
  ('Oscillations libres d''un circuit RLC', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 11),
  ('Circuit RLC sÃ©rie en rÃ©gime sinusoÃ¯dal forcÃ©', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 12),
  ('Ondes Ã©lectromagnÃ©tiques et Modulation d''amplitude', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 13),
  ('CinÃ©matique du point', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 14),
  ('Loi de Newton', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 15),
  ('Applications aux mouvements rectilignes et circulaires', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 16),
  ('Poids / Masse / AccÃ©lÃ©ration', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 17),
  ('QuantitÃ©s de mouvement', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 18),
  ('Impulsion', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 19),
  ('Forces et interactions', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 20),
  ('RÃ©sultat des forces', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 21),
  ('SystÃ¨mes de forces', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 22),
  ('Dynamique du point', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 23),
  ('Travail et Ã©nergie', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 24),
  ('Ã‰nergie cinÃ©tique', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 25),
  ('Ã‰nergie potentielle', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 26),
  ('ThÃ©orÃ¨me de l''Ã©nergie', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 27),
  ('Conservation de l''Ã©nergie mÃ©canique', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 28),
  ('Ã‰volution spontanÃ©e d''un systÃ¨me chimique (Piles)', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 29),
  ('Transformations forcÃ©es (Ã‰lectrolyse)', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 30),
  ('RÃ©actions d''estÃ©rification et d''hydrolyse', 'Physique-Chimie', ARRAY['LycÃ©e', '2BAC', 'SMA', 'SMB', 'PC', 'S2'], 31);

-- >> SVT (2BAC SVT/PC) <<
INSERT INTO modules (title, subject, tags, "order") VALUES
  ('Consommation de la matiÃ¨re organique et flux d''Ã©nergie', 'S.V.T.', ARRAY['LycÃ©e', '2BAC', 'SVT', 'PC', 'S1'], 1),
  ('Nature et expression du matÃ©riel gÃ©nÃ©tique (GÃ©nie gÃ©nÃ©tique)', 'S.V.T.', ARRAY['LycÃ©e', '2BAC', 'SVT', 'S1'], 2),
  ('Transfert de l''information gÃ©nÃ©tique par reproduction sexuÃ©e', 'S.V.T.', ARRAY['LycÃ©e', '2BAC', 'SVT', 'S1'], 3),
  ('GÃ©nÃ©tique humaine', 'S.V.T.', ARRAY['LycÃ©e', '2BAC', 'SVT', 'S1'], 4),
  ('La gÃ©nÃ©tique des populations', 'S.V.T.', ARRAY['LycÃ©e', '2BAC', 'SVT', 'S2'], 5),
  ('Immunologie: Notion de soi et non soi', 'S.V.T.', ARRAY['LycÃ©e', '2BAC', 'SVT', 'S2'], 6),
  ('Immunologie: Les moyens de dÃ©fense et dysfonctionnements', 'S.V.T.', ARRAY['LycÃ©e', '2BAC', 'SVT', 'S2'], 7),
  ('PhÃ©nomÃ¨nes gÃ©ologiques liÃ©s Ã  la formation des montagnes', 'S.V.T.', ARRAY['LycÃ©e', '2BAC', 'SVT', 'PC', 'S2'], 8),
  ('Le mÃ©tamorphisme et la granitisation', 'S.V.T.', ARRAY['LycÃ©e', '2BAC', 'SVT', 'PC', 'S2'], 9);

-- >> PHILOSOPHIE (2BAC, toutes filiÃ¨res) <<
INSERT INTO modules (title, subject, tags, "order") VALUES
  ('La Condition Humaine: La Personne', 'Philosophie', ARRAY['LycÃ©e', '2BAC', 'S1'], 1),
  ('La Condition Humaine: Autrui', 'Philosophie', ARRAY['LycÃ©e', '2BAC', 'S1'], 2),
  ('La Connaissance: La ThÃ©orie et l''ExpÃ©rience', 'Philosophie', ARRAY['LycÃ©e', '2BAC', 'S1'], 3),
  ('La Connaissance: La VÃ©ritÃ©', 'Philosophie', ARRAY['LycÃ©e', '2BAC', 'S1'], 4),
  ('La Politique: L''Ã‰tat', 'Philosophie', ARRAY['LycÃ©e', '2BAC', 'S2'], 5),
  ('La Politique: Le Droit et la Justice', 'Philosophie', ARRAY['LycÃ©e', '2BAC', 'S2'], 6),
  ('L''Ã‰thique: Le Devoir', 'Philosophie', ARRAY['LycÃ©e', '2BAC', 'S2'], 7),
  ('L''Ã‰thique: La LibertÃ©', 'Philosophie', ARRAY['LycÃ©e', '2BAC', 'S2'], 8),
  ('MÃ©thodologie philosophique appliquÃ©e', 'Philosophie', ARRAY['LycÃ©e', '2BAC', 'S2'], 9);

-- >> ANGLAIS (2BAC, toutes filiÃ¨res) <<
INSERT INTO modules (title, subject, tags, "order") VALUES
  ('Unit 1: Gifts of Youth', 'Anglais', ARRAY['LycÃ©e', '2BAC', 'S1'], 1),
  ('Unit 2: Humor', 'Anglais', ARRAY['LycÃ©e', '2BAC', 'S1'], 2),
  ('Unit 3: Formal, Informal and Non-formal Education', 'Anglais', ARRAY['LycÃ©e', '2BAC', 'S1'], 3),
  ('Unit 4: Sustainable Development', 'Anglais', ARRAY['LycÃ©e', '2BAC', 'S1'], 4),
  ('Unit 5: Women and Power', 'Anglais', ARRAY['LycÃ©e', '2BAC', 'S1'], 5),
  ('Unit 6: Cultural Values', 'Anglais', ARRAY['LycÃ©e', '2BAC', 'S2'], 6),
  ('Unit 7: Citizenship', 'Anglais', ARRAY['LycÃ©e', '2BAC', 'S2'], 7),
  ('Unit 8: International Organizations', 'Anglais', ARRAY['LycÃ©e', '2BAC', 'S2'], 8),
  ('Unit 9: Advances in Science and Technology', 'Anglais', ARRAY['LycÃ©e', '2BAC', 'S2'], 9),
  ('Unit 10: Brain Drain', 'Anglais', ARRAY['LycÃ©e', '2BAC', 'S2'], 10);

-- =========================================================================================
-- 4. Insert Resources For "Loi de Newton"
-- =========================================================================================

INSERT INTO resources (module_id, title, type, file_url, is_published, is_premium)
SELECT id, 'PDF Cours (Prof. Sbiro)', 'pdf_cours', 'https://drive.google.com/open?id=1dwdBwPBaln1aMuLWiP8aIefve40uOekF', true, false FROM modules WHERE title = 'Loi de Newton';

INSERT INTO resources (module_id, title, type, file_url, is_published, is_premium)
SELECT id, 'PDF Cours 2', 'pdf_cours', 'https://drive.google.com/open?id=0ByqxF-yryhmydk9MZDh4YzYta0U', true, false FROM modules WHERE title = 'Loi de Newton';

INSERT INTO resources (module_id, title, type, file_url, is_published, is_premium)
SELECT id, 'PDF Cours 3', 'pdf_cours', 'https://drive.google.com/open?id=0ByqxF-yryhmyLW0wc1RQVmZxNTA', true, false FROM modules WHERE title = 'Loi de Newton';

INSERT INTO resources (module_id, title, type, file_url, is_published, is_premium)
SELECT id, 'PDF Cours 4', 'pdf_cours', 'https://drive.google.com/open?id=1je_aGYNpnHLPfpgNKLEobr-EF6ugPi38', true, false FROM modules WHERE title = 'Loi de Newton';

INSERT INTO resources (module_id, title, type, file_url, is_published, is_premium)
SELECT id, 'PDF Cours (Prof. Hajji)', 'pdf_cours', 'https://drive.google.com/open?id=14FLfWBMEmRhJfeCnSc2hHPoV5Y-Q1EvI', true, false FROM modules WHERE title = 'Loi de Newton';

INSERT INTO resources (module_id, title, type, file_url, is_published, is_premium)
SELECT id, 'PDF Cours (Prof. Hadjyne)', 'pdf_cours', 'https://drive.google.com/file/d/1leuWHtiU416iI-9N50NUhLlCsUbA5Sj_/view?usp=sharing', true, false FROM modules WHERE title = 'Loi de Newton';

INSERT INTO resources (module_id, title, type, file_url, is_published, is_premium)
SELECT id, 'PDF Cours (Prof. Asnaoui)', 'pdf_cours', 'https://drive.google.com/file/d/14Yx-XOY-Nhr3BBT3dQu1zooHlHZO8Kq5/view?usp=sharing', true, false FROM modules WHERE title = 'Loi de Newton';

INSERT INTO resources (module_id, title, type, file_url, is_published, is_premium)
SELECT id, 'PDF Cours 8', 'pdf_cours', 'https://drive.google.com/open?id=1ofqhLFauMrLioiLjMOqNaRHcp5gaEVdI', true, false FROM modules WHERE title = 'Loi de Newton';

INSERT INTO resources (module_id, title, type, file_url, is_published, is_premium)
SELECT id, 'PPT Cours (Prof. Asnaoui)', 'pdf_cours', 'https://drive.google.com/open?id=1S04-hPvbNrnzjn59N1_IUAtliCEeElMX', true, false FROM modules WHERE title = 'Loi de Newton';

INSERT INTO resources (module_id, title, type, file_url, is_published, is_premium)
SELECT id, 'PDF Cours 10 (Prof. Asnaoui)', 'pdf_cours', 'https://drive.google.com/open?id=1aj_Jb5JE4qk2Nj2xYl7rBMtL0glm07Nq', true, false FROM modules WHERE title = 'Loi de Newton';
