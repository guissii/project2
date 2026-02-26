# Architecture Base de Données : Plateforme E-Learning Marocaine

Ce document centralise la structure de la base de données PostgreSQL qui répond aux exigences du programme scolaire marocain (cycles, niveaux, branches, matières, unités, et ressources), afin de ne plus avoir à ré-analyser l'intégralité des rapports de recherche.

## Diagramme relationnel (Concepts)

1. **`cycles`** : Les grands cycles de l'éducation (Primaire, Collège, Lycée).
2. **`grades`** : Les niveaux scolaires spécifiques (ex: 1AP..6AP, 1AC..3AC, TC, 1BAC, 2BAC). Ils sont liés à un cycle.
3. **`branches`** : Les filières ou spécialités (ex: Sciences Mathématiques, Sciences Expérimentales, SEG).
4. **`grade_branches`** : Table de liaison pour indiquer quelles filières sont disponibles pour quels niveaux (principalement utile au Lycée).
5. **`subjects`** : Référentiel des matières (Mathématiques, Physique-Chimie, SVT, Français, Arabe...).
6. **`courses`** : La combinaison d'un niveau (et optionnellement d'une filière) et d'une matière (ex: Cours de Maths pour 2BAC Sciences Expérimentales).
7. **`units`** : Les chapitres ou éléments de programme d'un `course` (ex: "Limites et Continuité", "Ondes mécaniques progressives").
8. **`resources`** : Les contenus pédagogiques (PDF, vidéos, quiz, exercices) rattachés à une `unit`.

## Tags et Taxonomie respectés

- **Cycle** : `primaire`, `college`, `lycee`
- **Grade Code** : `1AP`, `6AP`, `3AC`, `TCS`, `1BAC`, `2BAC`...
- **Branch Code** : `SM`, `SE`, `SEG`, `LETTRES`, `COMMON` (tronc commun) ...
- **Resource Types** : `pdf_cours`, `video_capsule`, `quiz_auto`, `exercices_progressifs`, `correction_detaillee`, `controle_type`, `annales_corrigees`.

## Choix Techniques
- **Identifiants** : UUID par défaut pour toutes les tables (sécurité et flexibilité).
- **Traductions** : Noms en français et en arabe (`name`, `name_ar`) intégrés pour les entités principales.
- **Statut de Publication** : Booléen `is_published` sur les cours, unités et ressources pour gérer la mise en ligne progressive suggérée par le calendrier (S1, S2, Révisions).

Cette architecture sera implémentée via un script SQL (`db/schema.sql`) et pré-remplie avec un script de seed (`db/seed.sql`).
