// ════════════════════════════════════════════════════════════════
// Moroccan Education System Hierarchy — Hardcoded Reference Data
// This is static/structural data that CANNOT be modified by admin.
// ════════════════════════════════════════════════════════════════

export const CYCLES = [
    { code: 'Lycée', label: 'Lycée (Secondaire Qualifiant)', label_ar: 'الثانوي التأهيلي', icon: '🎓' },
    { code: 'Collège', label: 'Collège (Secondaire Collégial)', label_ar: 'الثانوي الإعدادي', icon: '📚' },
    { code: 'Primaire', label: 'Primaire (Enseignement Primaire)', label_ar: 'التعليم الابتدائي', icon: '✏️' },
];

export const GRADES: Record<string, { code: string; label: string; label_ar: string }[]> = {
    'Lycée': [
        { code: 'TC', label: 'Tronc Commun', label_ar: 'الجذع المشترك' },
        { code: '1BAC', label: '1ère Bac', label_ar: 'الأولى باكالوريا' },
        { code: '2BAC', label: '2ème Bac', label_ar: 'الثانية باكالوريا' },
    ],
    'Collège': [
        { code: '1AC', label: '1ère Année Collège', label_ar: 'الأولى إعدادي' },
        { code: '2AC', label: '2ème Année Collège', label_ar: 'الثانية إعدادي' },
        { code: '3AC', label: '3ème Année Collège', label_ar: 'الثالثة إعدادي' },
    ],
    'Primaire': [
        { code: '1AP', label: '1ère Année', label_ar: 'الأول ابتدائي' },
        { code: '2AP', label: '2ème Année', label_ar: 'الثاني ابتدائي' },
        { code: '3AP', label: '3ème Année', label_ar: 'الثالث ابتدائي' },
        { code: '4AP', label: '4ème Année', label_ar: 'الرابع ابتدائي' },
        { code: '5AP', label: '5ème Année', label_ar: 'الخامس ابتدائي' },
        { code: '6AP', label: '6ème Année', label_ar: 'السادس ابتدائي' },
    ],
};

export const BRANCHES: Record<string, { code: string; label: string; label_ar: string }[]> = {
    'TC': [
        { code: 'TC_SCI', label: 'Sciences', label_ar: 'علوم' },
        { code: 'TC_TECH', label: 'Technologies', label_ar: 'تكنولوجيا' },
        { code: 'TC_LSH', label: 'Lettres et Sciences Humaines', label_ar: 'آداب وعلوم إنسانية' },
    ],
    '1BAC': [
        { code: 'SM', label: 'Sciences Mathématiques', label_ar: 'علوم رياضية' },
        { code: 'SE', label: 'Sciences Expérimentales', label_ar: 'علوم تجريبية' },
        { code: 'STE', label: 'Sciences et Technologies Électriques', label_ar: 'علوم وتكنولوجيات كهربائية' },
        { code: 'STM', label: 'Sciences et Technologies Mécaniques', label_ar: 'علوم وتكنولوجيات ميكانيكية' },
        { code: 'SEG', label: 'Sciences Économiques et Gestion', label_ar: 'علوم اقتصادية والتدبير' },
        { code: 'LSH', label: 'Lettres et Sciences Humaines', label_ar: 'آداب وعلوم إنسانية' },
    ],
    '2BAC': [
        { code: 'SMA', label: 'Sciences Mathématiques A', label_ar: 'علوم رياضية أ' },
        { code: 'SMB', label: 'Sciences Mathématiques B', label_ar: 'علوم رياضية ب' },
        { code: 'PC', label: 'Sciences Physiques', label_ar: 'علوم فيزيائية' },
        { code: 'SVT', label: 'Sciences de la Vie et de la Terre (SVT)', label_ar: 'علوم الحياة والأرض' },
        { code: 'SA', label: 'Sciences Agronomiques', label_ar: 'علوم زراعية' },
        { code: 'STE', label: 'Sciences et Technologies Électriques', label_ar: 'علوم وتكنولوجيات كهربائية' },
        { code: 'STM', label: 'Sciences et Technologies Mécaniques', label_ar: 'علوم وتكنولوجيات ميكانيكية' },
        { code: 'SE', label: 'Sciences Économiques', label_ar: 'علوم اقتصادية' },
        { code: 'SGC', label: 'Sciences de Gestion Comptable (SGC)', label_ar: 'علوم التدبير المحاسباتي' },
        { code: 'LET', label: 'Lettres', label_ar: 'آداب' },
        { code: 'SH', label: 'Sciences Humaines', label_ar: 'علوم إنسانية' },
    ],
};

export const SEMESTERS = [
    { code: 'S1', label: 'Semestre 1', label_ar: 'الأسدس الأول' },
    { code: 'S2', label: 'Semestre 2', label_ar: 'الأسدس الثاني' },
];

// ════════════════════════════════════════════════════════════════
// Subjects per Grade+Branch — key = "gradeCode" or "gradeCode_branchCode"
// ════════════════════════════════════════════════════════════════

export const SUBJECTS: Record<string, string[]> = {
    // ── Lycée: Tronc Commun ──
    'TC_TC_SCI': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de la Vie et de la Terre (SVT)',
        'Arabe', 'Français', 'Anglais', 'Education Islamique', 'Informatique',
    ],
    'TC_TC_TECH': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de l\'Ingénieur',
        'Arabe', 'Français', 'Anglais', 'Education Islamique', 'Informatique',
    ],
    'TC_TC_LSH': [
        'Langue Arabe', 'Français', 'Anglais', 'Education Islamique',
        'Histoire et Géographie', 'Philosophie',
    ],

    // ── Lycée: 1ère Bac ──
    '1BAC_SM': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de l\'Ingénieur',
        'Arabe', 'Français', 'Anglais', 'Education Islamique', 'Philosophie',
    ],
    '1BAC_SE': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de la Vie et de la Terre (SVT)',
        'Arabe', 'Français', 'Anglais', 'Education Islamique', 'Philosophie',
    ],
    '1BAC_STE': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de l\'Ingénieur',
        'Arabe', 'Français', 'Anglais', 'Education Islamique', 'Philosophie',
    ],
    '1BAC_STM': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de l\'Ingénieur',
        'Arabe', 'Français', 'Anglais', 'Education Islamique', 'Philosophie',
    ],
    '1BAC_SEG': [
        'Mathématiques', 'Economie Générale et Statistiques',
        'Economie et Organisation Administrative des Entreprises',
        'Comptabilité et Mathématiques Financières',
        'Arabe', 'Français', 'Anglais', 'Education Islamique', 'Philosophie',
    ],
    '1BAC_LSH': [
        'Langue Arabe', 'Philosophie', 'Histoire et Géographie',
        'Français', 'Anglais', 'Education Islamique',
    ],

    // ── Lycée: 2ème Bac ──
    '2BAC_SMA': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de l\'Ingénieur',
        'Arabe', 'Français', 'Anglais', 'Traduction', 'Education Islamique', 'Philosophie',
    ],
    '2BAC_SMB': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de l\'Ingénieur',
        'Arabe', 'Français', 'Anglais', 'Education Islamique', 'Philosophie',
    ],
    '2BAC_PC': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de la Vie et de la Terre (SVT)',
        'Arabe', 'Français', 'Anglais', 'Education Islamique', 'Philosophie',
    ],
    '2BAC_SVT': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de la Vie et de la Terre (SVT)',
        'Arabe', 'Français', 'Anglais', 'Education Islamique', 'Philosophie',
    ],
    '2BAC_SA': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de la Vie et de la Terre (SVT)',
        'Sciences Agronomiques',
        'Arabe', 'Français', 'Anglais', 'Education Islamique', 'Philosophie',
    ],
    '2BAC_STE': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de l\'Ingénieur',
        'Arabe', 'Français', 'Anglais', 'Education Islamique', 'Philosophie',
    ],
    '2BAC_STM': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de l\'Ingénieur',
        'Arabe', 'Français', 'Anglais', 'Education Islamique', 'Philosophie',
    ],
    '2BAC_SE': [
        'Mathématiques', 'Economie Générale et Statistiques',
        'Economie et Organisation Administrative des Entreprises',
        'Comptabilité et Mathématiques Financières', 'Droit', 'Informatique de Gestion',
        'Arabe', 'Français', 'Anglais', 'Education Islamique', 'Philosophie',
    ],
    '2BAC_SGC': [
        'Mathématiques', 'Economie Générale et Statistiques',
        'Economie et Organisation Administrative des Entreprises',
        'Comptabilité et Mathématiques Financières', 'Droit', 'Informatique de Gestion',
        'Arabe', 'Français', 'Anglais', 'Education Islamique', 'Philosophie',
    ],
    '2BAC_LET': [
        'Littérature Arabe', 'Philosophie', 'Histoire et Géographie',
        'Expression et Création', 'Français', 'Anglais', 'Education Islamique',
    ],
    '2BAC_SH': [
        'Philosophie', 'Histoire et Géographie', 'Sociologie',
        'Arabe', 'Français', 'Anglais', 'Education Islamique',
    ],

    // ── Collège (pas de filières) ──
    '1AC': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de la Vie et de la Terre (SVT)',
        'Arabe', 'Français', 'Anglais', 'Education Islamique',
        'Histoire et Géographie', 'Informatique',
    ],
    '2AC': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de la Vie et de la Terre (SVT)',
        'Arabe', 'Français', 'Anglais', 'Education Islamique',
        'Histoire et Géographie', 'Informatique',
    ],
    '3AC': [
        'Mathématiques', 'Physique et Chimie', 'Sciences de la Vie et de la Terre (SVT)',
        'Arabe', 'Français', 'Anglais', 'Education Islamique',
        'Histoire et Géographie', 'Informatique',
    ],

    // ── Primaire (pas de filières) ──
    '1AP': ['Mathématiques', 'Arabe', 'Français', 'Education Islamique', 'Activité Scientifique'],
    '2AP': ['Mathématiques', 'Arabe', 'Français', 'Education Islamique', 'Activité Scientifique'],
    '3AP': ['Mathématiques', 'Arabe', 'Français', 'Education Islamique', 'Activité Scientifique'],
    '4AP': ['Mathématiques', 'Arabe', 'Français', 'Education Islamique', 'Activité Scientifique'],
    '5AP': ['Mathématiques', 'Arabe', 'Français', 'Education Islamique', 'Activité Scientifique'],
    '6AP': ['Mathématiques', 'Arabe', 'Français', 'Education Islamique', 'Activité Scientifique'],
};

