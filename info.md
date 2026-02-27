Using Node.js 20, Tailwind CSS v3.4.19, and Vite v7.2.4

Tailwind CSS has been set up with the shadcn theme

Setup complete: /mnt/okcomputer/output/app

Components (40+):
  accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb,
  button-group, button, calendar, card, carousel, chart, checkbox, collapsible,
  command, context-menu, dialog, drawer, dropdown-menu, empty, field, form,
  hover-card, input-group, input-otp, input, item, kbd, label, menubar,
  navigation-menu, pagination, popover, progress, radio-group, resizable,
  scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner,
  spinner, switch, table, tabs, textarea, toggle-group, toggle, tooltip

Usage:
  import { Button } from '@/components/ui/button'
  import { Card, CardHeader, CardTitle } from '@/components/ui/card'

Structure:
  src/pages/           Page sections (LandingPage.tsx, admin/*)
  src/hooks/           Custom hooks
  src/types/           Type definitions
  src/App.css          Styles specific to the Webapp
  src/App.tsx          Root React component (Router: Landing vs Admin)
  src/index.css        Global styles
  src/main.tsx         Entry point for rendering the Webapp
  db/                  PostgreSQL schema (schema.sql) and initial data (seed.sql)
  database_architecture.md Concepts and relations for the e-learning schema
  index.html           Entry point for the Webapp
  tailwind.config.js   Configures Tailwind's theme, plugins, etc.
  vite.config.ts       Main build and dev server settings for Vite
  postcss.config.js    Config file for CSS post-processing tools

Modifications récentes:
- Création du `db/schema.sql` (Tables: cycles, grades, branches, subjects, courses, units, resources) et `db/seed.sql` avec curriculum marocain.
- Documentation centrale de la DB dans `database_architecture.md`.
- Installation de `react-router-dom` pour fractionner l'application (`/` = LandingPage, `/admin` = Administration).
- Création du Dashboard Admin Complet (`src/pages/admin`) permettant de modifier tous les features :
  - `AdminLayout.tsx` : Sidebar de navigation principale.
  - `DashboardView.tsx` : Vue 360 globale.
  - `CurriculumView.tsx` : Gestion Cycles, Niveaux, Branches, Matières.
  - `ResourcesView.tsx` : Gestion PDF, Vidéos, Exercices, Quiz.
  - `UnitsView.tsx` : Gestion complète des unités / chapitres du programme.
  - `UsersView.tsx` : Gestion des abonnés / étudiants (Standard, Premium).

---
### 🔒 Identifiants de Test (Démonstration)

**Accès Élève (Tableau de bord Étudiant)**
- **Email** : `student@taalim.ma`
- **Mot de passe** : `password123`

**Accès Administrateur (Gestion Nationale)**
- **Email** : `admin@taalim.ma`
- **Mot de passe** : `password123`