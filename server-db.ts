import fs from 'fs';
import path from 'path';
import {
  User,
  Category,
  Subject,
  Chapter,
  Question,
  MockTest,
  TestAttempt,
  EssayTopic,
  EssayEvaluation,
  QuestionReport,
  LeaderboardEntry,
} from './src/types.js';

interface DatabaseData {
  users: User[];
  categories: Category[];
  subjects: Subject[];
  chapters: Chapter[];
  questions: Question[];
  tests: MockTest[];
  attempts: TestAttempt[];
  essayTopics: EssayTopic[];
  essayEvaluations: EssayEvaluation[];
  questionReports: QuestionReport[];
  announcements: { id: string; title: string; date: string; content: string; badge: string }[];
}

const DB_FILE = path.resolve(process.cwd(), 'database.json');

// Initial High-Yield Seed Data for Pakistani Admission Tests
const initialCategories: Category[] = [
  {
    id: 'cat-usat-e',
    name: 'USAT-E (Pre-Engineering)',
    nameUrdu: 'یو ایس اے ٹی - پری انجینئرنگ',
    code: 'USAT-E',
    description: 'Universal Admission Test by HEC for Engineering & Technology undergraduate programs.',
    descriptionUrdu: 'ہائر ایجوکیشن کمیشن کا پری انجینئرنگ ڈگریوں کے لیے مشترکہ داخلہ ٹیسٹ۔',
    badgeColor: 'blue',
    isPopular: true,
  },
  {
    id: 'cat-usat-m',
    name: 'USAT-M (Pre-Medical)',
    nameUrdu: 'یو ایس اے ٹی - پری میڈیکل',
    code: 'USAT-M',
    description: 'Admission test for Allied Health Sciences, Biotechnology, and Biological sciences.',
    descriptionUrdu: 'بائیو ٹیکنالوجی اور الائیڈ ہیلتھ سائنسز کے لیے یو ایس اے ٹی ٹیسٹ۔',
    badgeColor: 'emerald',
    isPopular: true,
  },
  {
    id: 'cat-usat-cs',
    name: 'USAT-CS (Computer Science)',
    nameUrdu: 'یو ایس اے ٹی - کمپیوٹر سائنس',
    code: 'USAT-CS',
    description: 'For Computer Science, Software Engineering, AI, and Data Science programs across Pakistan.',
    descriptionUrdu: 'کمپیوٹر سائنس اور سافٹ ویئر انجینئرنگ کے لیے یونیورسل ٹیسٹ۔',
    badgeColor: 'violet',
    isPopular: true,
  },
  {
    id: 'cat-mdcat',
    name: 'MDCAT (National Medical Test)',
    nameUrdu: 'ایم ڈی کیٹ (میڈیکل کالج ٹیسٹ)',
    code: 'MDCAT',
    description: 'PMDC National Medical & Dental College Admission Test for MBBS & BDS aspirants.',
    descriptionUrdu: 'ایم بی بی ایس اور بی ڈی ایس کے لیے پاکستان میڈیکل اینڈ ڈینٹل کونسل کا قومی امتحان۔',
    badgeColor: 'rose',
    isPopular: true,
  },
  {
    id: 'cat-ecat',
    name: 'ECAT (UET Lahore / Punjab)',
    nameUrdu: 'ای کیٹ (انجینئرنگ ٹیسٹ پنجاب)',
    code: 'ECAT',
    description: 'Engineering Colleges Admission Test conducted by UET Lahore for all public universities.',
    descriptionUrdu: 'یو ای ٹی لاہور اور پنجاب کی سرکاری انجینئرنگ یونیورسٹیوں کا داخلہ امتحان۔',
    badgeColor: 'amber',
  },
  {
    id: 'cat-nust',
    name: 'NUST NET (NET 1, 2, 3 & 4)',
    nameUrdu: 'نسٹ اینٹری ٹیسٹ',
    code: 'NUST-NET',
    description: 'NUST Entry Test for Engineering, Computing, Applied Sciences, and Business.',
    descriptionUrdu: 'قومی یونیورسٹی برائے سائنس و ٹیکنالوجی (NUST) کا کمپیوٹرائزڈ داخلہ ٹیسٹ۔',
    badgeColor: 'cyan',
  },
];

const initialSubjects: Subject[] = [
  // USAT-E Subjects
  { id: 'sub-phy', categoryId: 'cat-usat-e', name: 'Physics', nameUrdu: 'طبیعیات (فزکس)', icon: 'Atom', color: 'blue' },
  { id: 'sub-chem', categoryId: 'cat-usat-e', name: 'Chemistry', nameUrdu: 'کیمسٹری', icon: 'FlaskConical', color: 'emerald' },
  { id: 'sub-math', categoryId: 'cat-usat-e', name: 'Mathematics', nameUrdu: 'ریاضی (میتھ)', icon: 'Calculator', color: 'purple' },
  { id: 'sub-eng', categoryId: 'cat-usat-e', name: 'English', nameUrdu: 'انگریزی', icon: 'BookOpen', color: 'amber' },
  { id: 'sub-iq', categoryId: 'cat-usat-e', name: 'Analytical Reasoning & IQ', nameUrdu: 'تجزیاتی صلاحیت و آئی کیو', icon: 'BrainCircuit', color: 'indigo' },

  // USAT-M Subjects
  { id: 'sub-bio-m', categoryId: 'cat-usat-m', name: 'Biology', nameUrdu: 'حیاتیات (بائیولوجی)', icon: 'Dna', color: 'emerald' },
  { id: 'sub-phy-m', categoryId: 'cat-usat-m', name: 'Physics', nameUrdu: 'طبیعیات (فزکس)', icon: 'Atom', color: 'blue' },
  { id: 'sub-chem-m', categoryId: 'cat-usat-m', name: 'Chemistry', nameUrdu: 'کیمسٹری', icon: 'FlaskConical', color: 'teal' },
  { id: 'sub-eng-m', categoryId: 'cat-usat-m', name: 'English', nameUrdu: 'انگریزی', icon: 'BookOpen', color: 'amber' },
  { id: 'sub-iq-m', categoryId: 'cat-usat-m', name: 'Analytical Reasoning & IQ', nameUrdu: 'تجزیاتی صلاحیت', icon: 'BrainCircuit', color: 'indigo' },

  // MDCAT Subjects
  { id: 'sub-mdcat-bio', categoryId: 'cat-mdcat', name: 'Biology', nameUrdu: 'بائیولوجی', icon: 'Dna', color: 'emerald' },
  { id: 'sub-mdcat-chem', categoryId: 'cat-mdcat', name: 'Chemistry', nameUrdu: 'کیمسٹری', icon: 'FlaskConical', color: 'teal' },
  { id: 'sub-mdcat-phy', categoryId: 'cat-mdcat', name: 'Physics', nameUrdu: 'فزکس', icon: 'Atom', color: 'blue' },
  { id: 'sub-mdcat-eng', categoryId: 'cat-mdcat', name: 'English', nameUrdu: 'انگریزی', icon: 'BookOpen', color: 'amber' },
  { id: 'sub-mdcat-logic', categoryId: 'cat-mdcat', name: 'Logical Reasoning', nameUrdu: 'منطقی استدلال', icon: 'Brain', color: 'rose' },
];

const initialChapters: Chapter[] = [
  // Physics
  { id: 'ch-phy-1', subjectId: 'sub-phy', categoryId: 'cat-usat-e', name: 'Vectors and Equilibrium', nameUrdu: 'ویکٹرز اور توازن', order: 1 },
  { id: 'ch-phy-2', subjectId: 'sub-phy', categoryId: 'cat-usat-e', name: 'Motion and Force', nameUrdu: 'حرکت اور قوت', order: 2 },
  { id: 'ch-phy-3', subjectId: 'sub-phy', categoryId: 'cat-usat-e', name: 'Work and Energy', nameUrdu: 'کام اور توانائی', order: 3 },
  { id: 'ch-phy-4', subjectId: 'sub-phy', categoryId: 'cat-usat-e', name: 'Circular Motion & Gravitation', nameUrdu: 'دائرہ نما حرکت و کشش ثقل', order: 4 },
  { id: 'ch-phy-5', subjectId: 'sub-phy', categoryId: 'cat-usat-e', name: 'Electrostatics & Current', nameUrdu: 'الیکٹرو سٹیٹکس اور کرنٹ', order: 5 },

  // Mathematics
  { id: 'ch-math-1', subjectId: 'sub-math', categoryId: 'cat-usat-e', name: 'Matrices and Determinants', nameUrdu: 'قالب اور مقطع', order: 1 },
  { id: 'ch-math-2', subjectId: 'sub-math', categoryId: 'cat-usat-e', name: 'Quadratic Equations & Complex Numbers', nameUrdu: 'دو درجی مساوات', order: 2 },
  { id: 'ch-math-3', subjectId: 'sub-math', categoryId: 'cat-usat-e', name: 'Trigonometry & Identities', nameUrdu: 'مثلثیات (ٹرگنومیٹری)', order: 3 },
  { id: 'ch-math-4', subjectId: 'sub-math', categoryId: 'cat-usat-e', name: 'Differentiation & Calculus', nameUrdu: 'تفرقی کیلکولس', order: 4 },
  { id: 'ch-math-5', subjectId: 'sub-math', categoryId: 'cat-usat-e', name: 'Integration & Area Under Curves', nameUrdu: 'انٹیگریشن', order: 5 },

  // Chemistry
  { id: 'ch-chem-1', subjectId: 'sub-chem', categoryId: 'cat-usat-e', name: 'Basic Concepts & Stoichiometry', nameUrdu: 'کیمسٹری کے بنیادی تصورات', order: 1 },
  { id: 'ch-chem-2', subjectId: 'sub-chem', categoryId: 'cat-usat-e', name: 'Atomic Structure & Bonding', nameUrdu: 'جوہری ساخت اور بانڈنگ', order: 2 },
  { id: 'ch-chem-3', subjectId: 'sub-chem', categoryId: 'cat-usat-e', name: 'Chemical Equilibrium & Solutions', nameUrdu: 'کیمیائی توازن اور محلول', order: 3 },
  { id: 'ch-chem-4', subjectId: 'sub-chem', categoryId: 'cat-usat-e', name: 'Hydrocarbons & Organic Principles', nameUrdu: 'نامیاتی کیمسٹری', order: 4 },

  // English
  { id: 'ch-eng-1', subjectId: 'sub-eng', categoryId: 'cat-usat-e', name: 'Vocabulary, Synonyms & Antonyms', nameUrdu: 'ذخیرہ الفاظ اور مترادفات', order: 1 },
  { id: 'ch-eng-2', subjectId: 'sub-eng', categoryId: 'cat-usat-e', name: 'Sentence Correction & Grammar', nameUrdu: 'جملے کی درستی اور گرامر', order: 2 },
  { id: 'ch-eng-3', subjectId: 'sub-eng', categoryId: 'cat-usat-e', name: 'Prepositions & Idioms', nameUrdu: 'حروف جار اور محاورے', order: 3 },
  { id: 'ch-eng-4', subjectId: 'sub-eng', categoryId: 'cat-usat-e', name: 'Reading Comprehension', nameUrdu: 'عبارت فہمی', order: 4 },

  // Analytical Reasoning
  { id: 'ch-iq-1', subjectId: 'sub-iq', categoryId: 'cat-usat-e', name: 'Linear & Circular Seating Arrangements', nameUrdu: 'نشستی ترتیبات', order: 1 },
  { id: 'ch-iq-2', subjectId: 'sub-iq', categoryId: 'cat-usat-e', name: 'Syllogisms & Logical Deductions', nameUrdu: 'منطقی نتائج', order: 2 },
  { id: 'ch-iq-3', subjectId: 'sub-iq', categoryId: 'cat-usat-e', name: 'Number Series & Pattern Recognition', nameUrdu: 'اعداد کی ترتیب', order: 3 },
  { id: 'ch-iq-4', subjectId: 'sub-iq', categoryId: 'cat-usat-e', name: 'Blood Relations & Direction Sense', nameUrdu: 'خاندانی رشتے اور سمت کا تعین', order: 4 },

  // Biology (USAT-M)
  { id: 'ch-bio-1', subjectId: 'sub-bio-m', categoryId: 'cat-usat-m', name: 'Cell Structure & Function', nameUrdu: 'خلیاتی ساخت اور افعال', order: 1 },
  { id: 'ch-bio-2', subjectId: 'sub-bio-m', categoryId: 'cat-usat-m', name: 'Biological Molecules & Enzymes', nameUrdu: 'حیاتیاتی مالیکیولز اور اینزائمز', order: 2 },
  { id: 'ch-bio-3', subjectId: 'sub-bio-m', categoryId: 'cat-usat-m', name: 'Human Physiology & Circulation', nameUrdu: 'انسانی دوران خون', order: 3 },
  { id: 'ch-bio-4', subjectId: 'sub-bio-m', categoryId: 'cat-usat-m', name: 'Genetics, DNA & Inheritance', nameUrdu: 'وراثت اور ڈی این اے', order: 4 },
];

const initialQuestions: Question[] = [
  // Physics Questions
  {
    id: 'q-phy-101',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-phy',
    chapterId: 'ch-phy-1',
    questionText: 'Two perpendicular vectors of magnitude 6 N and 8 N are added. What is the magnitude of their resultant vector?',
    questionTextUrdu: 'دو عمودی ویکٹرز جن کی مقدار 6 نیوٹن اور 8 نیوٹن ہے، آپس میں جمع کیے جائیں تو نتیجہ خیز ویکٹر کی مقدار کیا ہوگی؟',
    options: {
      A: '2 N',
      B: '10 N',
      C: '14 N',
      D: '48 N',
    },
    correctAnswer: 'B',
    explanation: 'For two orthogonal (perpendicular) vectors A and B: R = √(A² + B²) = √(6² + 8²) = √(36 + 64) = √100 = 10 N.',
    explanationUrdu: 'جب دو ویکٹرز ایک دوسرے کے عمود ہوں تو نتیجہ خیز ویکٹر R = √(6² + 8²) = 10 N ہوتا ہے۔',
    difficulty: 'Easy',
    formula: 'R = \\sqrt{A^2 + B^2}',
    tags: ['Vectors', 'Pythagoras', 'USAT-E High Yield'],
  },
  {
    id: 'q-phy-102',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-phy',
    chapterId: 'ch-phy-2',
    questionText: 'A projectile is launched with an initial velocity v at an angle θ with the horizontal. At what projection angle is the maximum horizontal range achieved?',
    questionTextUrdu: 'ایک پروجیکٹائل افقی سطح سے زاویہ θ پر داغا جائے۔ زیادہ سے زیادہ افقی فاصلہ (Range) کس زاویے پر حاصل ہوتا ہے؟',
    options: {
      A: '30°',
      B: '45°',
      C: '60°',
      D: '90°',
    },
    correctAnswer: 'B',
    explanation: 'The horizontal range formula is R = (v² sin 2θ) / g. Range is maximum when sin 2θ = 1, which means 2θ = 90° ⇒ θ = 45°.',
    explanationUrdu: 'پروجیکٹائل کی رینج کا فارمولا R = (v² sin 2θ)/g ہے۔ sin(90°) = 1 زیادہ سے زیادہ ہوتا ہے، لہٰذا θ = 45 ڈگری پر رینج زیادہ سے زیادہ ہوگی۔',
    difficulty: 'Easy',
    formula: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g}',
    tags: ['Projectile Motion', 'Kinematics'],
  },
  {
    id: 'q-phy-103',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-phy',
    chapterId: 'ch-phy-3',
    questionText: 'If the linear momentum of a moving body is increased by 50%, by what percentage does its kinetic energy increase?',
    questionTextUrdu: 'اگر کسی متحرک جسم کے لکیری مومینٹم میں 50 فیصد اضافہ کر دیا جائے، تو اس کی کائنیٹک انرجی میں کتنے فیصد اضافہ ہوگا؟',
    options: {
      A: '50%',
      B: '100%',
      C: '125%',
      D: '225%',
    },
    correctAnswer: 'C',
    explanation: 'Kinetic energy KE = p² / (2m). If new momentum p\' = 1.5p, then new KE\' = (1.5p)² / (2m) = 2.25 KE. The increase is (2.25 - 1) × 100% = 125%.',
    explanationUrdu: 'کائنیٹک انرجی KE = p²/(2m) کے متناسب ہے۔ اگر p ڈیڑھ گنا ہو جائے تو (1.5)² = 2.25 یعنی 125 فیصد کا اضافہ ہوگا۔',
    difficulty: 'Medium',
    formula: 'KE = \\frac{p^2}{2m}',
    tags: ['Work & Energy', 'Momentum', 'Tricky'],
  },
  {
    id: 'q-phy-104',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-phy',
    chapterId: 'ch-phy-4',
    questionText: 'A satellite of mass m moves in a circular orbit around Earth of mass M at a distance r from the center of Earth. What is its orbital speed?',
    questionTextUrdu: 'ایک سیارہ زمین کے گرد r فاصلے پر چکر لگا رہا ہے۔ اس کی مداری رفتار (Orbital speed) کیا ہوگی؟',
    options: {
      A: 'v = GM / r',
      B: 'v = √(GM / r)',
      C: 'v = √(2GM / r)',
      D: 'v = GM / r²',
    },
    correctAnswer: 'B',
    explanation: 'Equating gravitational pull to centripetal force: G M m / r² = m v² / r ⇒ v² = G M / r ⇒ v = √(GM / r). Note that √(2GM/r) is escape speed.',
    explanationUrdu: 'مداری رفتار معلوم کرنے کے لیے کشش ثقل کی قوت کو سینٹری پیٹل فورس کے برابر رکھا جاتا ہے، جس سے v = √(GM/r) حاصل ہوتا ہے۔',
    difficulty: 'Medium',
    formula: 'v_o = \\sqrt{\\frac{GM}{r}}',
    tags: ['Gravitation', 'Orbital Velocity'],
  },
  {
    id: 'q-phy-105',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-phy',
    chapterId: 'ch-phy-5',
    questionText: 'A parallel plate capacitor has a capacitance of 10 µF in vacuum. When a dielectric of dielectric constant k = 5 is inserted between the plates, what is the new capacitance?',
    questionTextUrdu: 'خلا میں ایک متوازی پلیٹ کپیسیٹر کی گنجائش 10 مائیکرو فیراڈ ہے۔ اگر 5 ڈائی الیکٹرک مستقل والا مادہ رکھا جائے تو نئی گنجائش کیا ہوگی؟',
    options: {
      A: '2 µF',
      B: '15 µF',
      C: '50 µF',
      D: '250 µF',
    },
    correctAnswer: 'C',
    explanation: 'When dielectric is introduced, capacitance increases by factor of k: C_new = k × C_vacuum = 5 × 10 µF = 50 µF.',
    explanationUrdu: 'ڈائی الیکٹرک رکھنے سے کپیسیٹر کی گنجائش k گنا بڑھ جاتی ہے: 5 × 10 = 50 µF۔',
    difficulty: 'Easy',
    formula: 'C = k \\cdot C_0',
    tags: ['Electrostatics', 'Capacitors'],
  },

  // Mathematics Questions
  {
    id: 'q-math-201',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-math',
    chapterId: 'ch-math-1',
    questionText: 'If matrix A is of order 2×3 and matrix B is of order 3×4, what is the order of the resulting product matrix AB?',
    questionTextUrdu: 'اگر میٹرکس A کا آرڈر 2×3 ہو اور میٹرکس B کا آرڈر 3×4 ہو، تو پروڈکٹ میٹرکس AB کا آرڈر کیا ہوگا؟',
    options: {
      A: '2 × 4',
      B: '3 × 3',
      C: '4 × 2',
      D: 'Multiplication is not possible',
    },
    correctAnswer: 'A',
    explanation: 'For matrices A (m × k) and B (k × n), multiplication is valid when inner dimensions match, and the product matrix has dimensions m × n. Here 2×3 and 3×4 yields a 2×4 matrix.',
    explanationUrdu: 'جب میٹرکس A کا سائز m×k اور B کا k×n ہو تو حاصل ضرب میٹرکس کا سائز m×n یعنی 2×4 ہوتا ہے۔',
    difficulty: 'Easy',
    tags: ['Matrices', 'Linear Algebra'],
  },
  {
    id: 'q-math-202',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-math',
    chapterId: 'ch-math-2',
    questionText: 'What are the roots of the quadratic equation x² - 7x + 12 = 0?',
    questionTextUrdu: 'مساوات x² - 7x + 12 = 0 کے روٹس (حل) کیا ہیں؟',
    options: {
      A: 'x = -3, -4',
      B: 'x = 3, 4',
      C: 'x = 2, 6',
      D: 'x = -2, -6',
    },
    correctAnswer: 'B',
    explanation: 'Factoring: x² - 3x - 4x + 12 = 0 ⇒ x(x - 3) - 4(x - 3) = 0 ⇒ (x - 3)(x - 4) = 0. Therefore, x = 3 or x = 4.',
    explanationUrdu: 'فیکٹرائزیشن سے: (x - 3)(x - 4) = 0 جس سے x = 3 اور x = 4 حاصل ہوتے ہیں۔',
    difficulty: 'Easy',
    formula: 'x^2 - (S)x + P = 0',
    tags: ['Quadratic Equations', 'Algebra'],
  },
  {
    id: 'q-math-203',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-math',
    chapterId: 'ch-math-3',
    questionText: 'What is the exact value of sin(15°)?',
    questionTextUrdu: 'sin(15°) کی صحیح قیمت کیا ہے؟',
    options: {
      A: '(√3 + 1) / (2√2)',
      B: '(√3 - 1) / (2√2)',
      C: '1 / (2√2)',
      D: '(√3 - 1) / 2',
    },
    correctAnswer: 'B',
    explanation: 'Using identity sin(A - B) = sin A cos B - cos A sin B. Set A = 45° and B = 30°: sin(15°) = sin(45° - 30°) = (1/√2)(√3/2) - (1/√2)(1/2) = (√3 - 1) / (2√2).',
    explanationUrdu: 'ٹرگنومیٹرک کلیہ sin(45° - 30°) استعمال کریں: (√3 - 1) / (2√2)۔',
    difficulty: 'Medium',
    formula: '\\sin(15^\\circ) = \\frac{\\sqrt{3}-1}{2\\sqrt{2}}',
    tags: ['Trigonometry', 'Identities', 'USAT-E High Yield'],
  },
  {
    id: 'q-math-204',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-math',
    chapterId: 'ch-math-4',
    questionText: 'What is the derivative of f(x) = ln(sec x + tan x) with respect to x?',
    questionTextUrdu: 'f(x) = ln(sec x + tan x) کا x کے لحاظ سے ڈیریویٹیو کیا ہوگا؟',
    options: {
      A: 'tan x',
      B: 'sec x',
      C: 'sec x tan x',
      D: 'sec² x',
    },
    correctAnswer: 'B',
    explanation: 'd/dx [ln(sec x + tan x)] = [sec x tan x + sec² x] / [sec x + tan x] = sec x [tan x + sec x] / [sec x + tan x] = sec x.',
    explanationUrdu: 'ڈیریویٹیو لینے پر: [sec x tan x + sec² x] / [sec x + tan x] = sec x حاصل ہوتا ہے۔',
    difficulty: 'Hard',
    formula: '\\frac{d}{dx}[\\ln(\\sec x + \\tan x)] = \\sec x',
    tags: ['Calculus', 'Derivatives'],
  },
  {
    id: 'q-math-205',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-math',
    chapterId: 'ch-math-5',
    questionText: 'Evaluate the definite integral: ∫ from 0 to 1 of (3x² + 2x) dx.',
    questionTextUrdu: 'ڈیفینٹ انٹیگرل کا حساب لگائیں: ∫₀¹ (3x² + 2x) dx',
    options: {
      A: '1',
      B: '2',
      C: '3',
      D: '5',
    },
    correctAnswer: 'B',
    explanation: 'Antiderivative is [x³ + x²] from 0 to 1. At 1: (1³ + 1²) = 2. At 0: (0 + 0) = 0. Value is 2 - 0 = 2.',
    explanationUrdu: 'انٹیگریشن کرنے سے [x³ + x²] حاصل ہوگا۔ حدود 0 سے 1 درج کرنے پر (1 + 1) = 2 بنتا ہے۔',
    difficulty: 'Easy',
    formula: '\\int_0^1 (3x^2 + 2x) dx = 2',
    tags: ['Calculus', 'Integration'],
  },

  // Chemistry Questions
  {
    id: 'q-chem-301',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-chem',
    chapterId: 'ch-chem-1',
    questionText: 'What is the total number of molecules present in 18 grams of pure water (H₂O)?',
    questionTextUrdu: '18 گرام خالص پانی (H₂O) میں مالیکیولز کی کل تعداد کتنی ہوتی ہے؟',
    options: {
      A: '3.01 × 10²³',
      B: '6.02 × 10²³',
      C: '1.20 × 10²⁴',
      D: '1.80 × 10²⁴',
    },
    correctAnswer: 'B',
    explanation: 'The molar mass of water (H₂O) is 2(1) + 16 = 18 g/mol. 18 g corresponds to exactly 1 mole, which contains Avogadro\'s number of molecules = 6.022 × 10²³.',
    explanationUrdu: 'پانی کا مالیکیولر وزن 18 گرام فی مول ہے۔ 18 گرام ایک مول کے برابر ہے، جس میں ایوگیڈرو نمبر (6.02 × 10²³) مالیکیول ہوتے ہیں۔',
    difficulty: 'Easy',
    formula: 'N = n \\times N_A',
    tags: ['Stoichiometry', 'Avogadro', 'Chemistry Basics'],
  },
  {
    id: 'q-chem-302',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-chem',
    chapterId: 'ch-chem-2',
    questionText: 'What is the hybridization and geometric shape of the central carbon atom in Ethyne (Acetylene, C₂H₂)?',
    questionTextUrdu: 'ایتھائن (Acetylene, C₂H₂) میں مرکزی کاربن ایٹم کی ہائبرڈائزیشن اور جیومیٹری کیا ہے؟',
    options: {
      A: 'sp³, Tetrahedral',
      B: 'sp², Trigonal Planar',
      C: 'sp, Linear (180°)',
      D: 'dsp², Square Planar',
    },
    correctAnswer: 'C',
    explanation: 'In ethyne H-C≡C-H, each carbon forms one sigma bond with H and one sigma bond with C, along with two pi bonds. With steric number 2, hybridization is sp with a linear 180° geometry.',
    explanationUrdu: 'ایتھائن میں کاربن ٹرپل بانڈ بناتا ہے جس سے sp ہائبرڈائزیشن اور 180 ڈگری کا لکیری زاویہ بنتا ہے۔',
    difficulty: 'Medium',
    tags: ['Chemical Bonding', 'Hybridization'],
  },
  {
    id: 'q-chem-303',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-chem',
    chapterId: 'ch-chem-3',
    questionText: 'What is the pH of a 0.001 M aqueous solution of strong hydrochloric acid (HCl)?',
    questionTextUrdu: '0.001 M ہائیڈروکلورک ایسڈ (HCl) کے محلول کی pH کیا ہوگی؟',
    options: {
      A: '1',
      B: '2',
      C: '3',
      D: '11',
    },
    correctAnswer: 'C',
    explanation: 'HCl is a strong monoprotic acid, so [H⁺] = 0.001 M = 10⁻³ M. pH = -log₁₀[H⁺] = -log₁₀(10⁻³) = 3.',
    explanationUrdu: 'pH = -log[H⁺] = -log(10⁻³) = 3۔',
    difficulty: 'Easy',
    formula: 'pH = -\\log_{10}[H^+]',
    tags: ['Equilibrium', 'Acids & Bases'],
  },
  {
    id: 'q-chem-304',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-chem',
    chapterId: 'ch-chem-4',
    questionText: 'Which rule or mechanism governs the addition of hydrogen halide (e.g. HBr) to an unsymmetrical alkene?',
    questionTextUrdu: 'غیر متوازن الکین میں ہائیڈروجن ہالائیڈ کے ملاپ کا تعین کون سا اصول کرتا ہے؟',
    options: {
      A: 'Hund\'s Rule',
      B: 'Markovnikov\'s Rule',
      C: 'Saytzeff\'s Rule',
      D: 'Le Chatelier\'s Principle',
    },
    correctAnswer: 'B',
    explanation: 'According to Markovnikov\'s Rule, when an unsymmetrical reagent HX adds to an unsymmetrical alkene, the hydrogen attaches to the carbon with more hydrogen atoms.',
    explanationUrdu: 'مارکوفنیکوف کے قانون کے مطابق ہائیڈروجن اس کاربن سے جڑتا ہے جس کے پاس پہلے سے زیادہ ہائیڈروجن ہوں۔',
    difficulty: 'Medium',
    tags: ['Organic Chemistry', 'Hydrocarbons'],
  },

  // English Questions
  {
    id: 'q-eng-401',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-eng',
    chapterId: 'ch-eng-1',
    questionText: 'Choose the most appropriate SYNONYM for the capitalized word: "The minister was praised for his PRAGMATIC approach to solving the city water crisis."',
    questionTextUrdu: 'لفظ "PRAGMATIC" کا قریبی ترین ہم معنی لفظ (Synonym) منتخب کریں:',
    options: {
      A: 'Idealistic',
      B: 'Practical and realistic',
      C: 'Careless',
      D: 'Extravagant',
    },
    correctAnswer: 'B',
    explanation: 'Pragmatic means dealing with things sensibly and realistically based on practical considerations rather than theoretical or idealistic ones.',
    explanationUrdu: 'لفظ Pragmatic کا مطلب عملی اور حقیقت پسندانہ (Practical) ہوتا ہے۔',
    difficulty: 'Medium',
    tags: ['Vocabulary', 'Synonyms', 'USAT English'],
  },
  {
    id: 'q-eng-402',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-eng',
    chapterId: 'ch-eng-2',
    questionText: 'Identify the sentence with correct subject-verb agreement:',
    questionTextUrdu: 'درست گرامر اور Subject-Verb Agreement والا جملہ منتخب کریں:',
    options: {
      A: 'Neither the teacher nor the students was present in the auditorium.',
      B: 'Neither the teacher nor the students were present in the auditorium.',
      C: 'Neither the teacher nor the students are been present.',
      D: 'Neither the teacher or the students were present.',
    },
    correctAnswer: 'B',
    explanation: 'With correlative conjunctions "neither...nor", the verb agrees with the subject closer to it. "The students" is plural, so the plural verb "were" is required.',
    explanationUrdu: 'Neither...nor کے اصول کے تحت فعل قریبی فاعل (students جو کہ جمع ہے) کے مطابق "were" آئے گا۔',
    difficulty: 'Medium',
    tags: ['Grammar', 'Subject-Verb Agreement'],
  },
  {
    id: 'q-eng-403',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-eng',
    chapterId: 'ch-eng-3',
    questionText: 'Fill in the blank with the appropriate preposition: "The student was exonerated _______ all charges of plagiarism after the inquiry."',
    questionTextUrdu: 'خالی جگہ میں مناسب Preposition لگائیں:',
    options: {
      A: 'with',
      B: 'from',
      C: 'for',
      D: 'in',
    },
    correctAnswer: 'B',
    explanation: 'The verb "exonerate" takes the preposition "from" (exonerated from blame or charges).',
    explanationUrdu: 'لفظ Exonerate کے بعد عام طور پر "from" استعمال ہوتا ہے۔',
    difficulty: 'Hard',
    tags: ['Prepositions', 'Grammar'],
  },
  {
    id: 'q-eng-404',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-eng',
    chapterId: 'ch-eng-1',
    questionText: 'Choose the correct ANTONYM for the capitalized word: "Her EPHEMERAL fame on social media vanished overnight."',
    questionTextUrdu: 'لفظ "EPHEMERAL" کا متضاد (Antonym) منتخب کریں:',
    options: {
      A: 'Fleeting',
      B: 'Temporary',
      C: 'Permanent and lasting',
      D: 'Fragile',
    },
    correctAnswer: 'C',
    explanation: 'Ephemeral means lasting for a very short time. Its antonym is permanent, enduring, or lasting.',
    explanationUrdu: 'Ephemeral کا مطلب عارضی یا چند روزہ ہے۔ اس کا الٹ Permanent (دائمی/مستقل) ہے۔',
    difficulty: 'Medium',
    tags: ['Antonyms', 'Vocabulary'],
  },

  // Analytical Reasoning & IQ
  {
    id: 'q-iq-501',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-iq',
    chapterId: 'ch-iq-3',
    questionText: 'Find the next number in the following sequence: 3, 7, 15, 31, 63, ___?',
    questionTextUrdu: 'سیریز کا اگلا نمبر معلوم کریں: 3, 7, 15, 31, 63, ___؟',
    options: {
      A: '95',
      B: '115',
      C: '127',
      D: '129',
    },
    correctAnswer: 'C',
    explanation: 'Each term is obtained by multiplying the previous term by 2 and adding 1: 3×2+1=7; 7×2+1=15; 15×2+1=31; 31×2+1=63; 63×2+1=127. (Also differences are 4, 8, 16, 32, 64).',
    explanationUrdu: 'ہر اگلا نمبر پچھلے کو 2 سے ضرب دے کر 1 جمع کرنے سے حاصل ہوتا ہے: 63 × 2 + 1 = 127۔',
    difficulty: 'Easy',
    tags: ['Number Series', 'Analytical Reasoning'],
  },
  {
    id: 'q-iq-502',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-iq',
    chapterId: 'ch-iq-2',
    questionText: 'Statements:\n1. All engineers are problem solvers.\n2. Some problem solvers are entrepreneurs.\nConclusions:\nI. Some engineers are entrepreneurs.\nII. All problem solvers are engineers.',
    questionTextUrdu: 'بیانات:\n1. تمام انجینئرز مسائل حل کرنے والے ہیں۔\n2. کچھ مسائل حل کرنے والے کاروباری (Entrepreneurs) ہیں۔\nنتائج:\nI. کچھ انجینئرز کاروباری ہیں۔\nII. تمام مسائل حل کرنے والے انجینئرز ہیں۔',
    options: {
      A: 'Only conclusion I follows',
      B: 'Only conclusion II follows',
      C: 'Both I and II follow',
      D: 'Neither I nor II follows',
    },
    correctAnswer: 'D',
    explanation: 'The Venn overlap of engineers and problem solvers does not necessarily intersect with the subset of problem solvers who are entrepreneurs. Also, only "some" problem solvers are engineers, not all. Thus neither conclusion is guaranteed.',
    explanationUrdu: 'نہ تو نتیجہ I لازمی طور پر درست ہے اور نہ ہی II۔ درست جواب Neither I nor II follows ہے۔',
    difficulty: 'Hard',
    tags: ['Syllogisms', 'Deductive Logic', 'USAT-IQ'],
  },
  {
    id: 'q-iq-503',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-iq',
    chapterId: 'ch-iq-4',
    questionText: 'Pointing to a photograph of a boy, Tariq said: "He is the only son of the mother of my sister." How is the boy in the photograph related to Tariq?',
    questionTextUrdu: 'ایک تصویر کی طرف اشارہ کرتے ہوئے طارق نے کہا: "یہ میری بہن کی والدہ کا اکلوتا بیٹا ہے۔" تصویر والا لڑکا طارق کا کیا لگتا ہے؟',
    options: {
      A: 'Brother',
      B: 'Tariq himself',
      C: 'Cousin',
      D: 'Nephew',
    },
    correctAnswer: 'B',
    explanation: '"Mother of my sister" = Tariq\'s mother. "Only son of my mother" (where Tariq is male) = Tariq himself.',
    explanationUrdu: 'بہن کی والدہ = طارق کی اپنی ماں۔ ماں کا اکلوتا بیٹا خود طارق ہی ہوگا۔',
    difficulty: 'Medium',
    tags: ['Blood Relations', 'Puzzles'],
  },
  {
    id: 'q-iq-504',
    categoryId: 'cat-usat-e',
    subjectId: 'sub-iq',
    chapterId: 'ch-iq-1',
    questionText: 'Five students A, B, C, D, and E are sitting in a row facing north. C is in the middle. A is to the immediate right of B. D is to the immediate left of C. Who is sitting at the extreme right?',
    questionTextUrdu: 'پانچ طلبہ A, B, C, D, E ایک قطار میں شمال کی طرف منہ کر کے بیٹھے ہیں۔ C بالکل درمیان میں ہے۔ انتہائی دائیں کون بیٹھا ہے؟',
    options: {
      A: 'A',
      B: 'E',
      C: 'D',
      D: 'Either A or E',
    },
    correctAnswer: 'D',
    explanation: 'Seats: [1, 2, 3, 4, 5]. C is at seat 3. D is immediate left of C, so D is at seat 2. Remaining seats are 1, 4, 5 for A, B, E. A is right of B (so B then A). B and A could be at (4,5) with E at 1, or B and A could be at (1,?) which is blocked. Thus B is at 4, A is at 5, and E is at 1. Hence A is at the extreme right (or with ambiguous arrangement, A is determined). Here A is at position 5.',
    difficulty: 'Medium',
    tags: ['Arrangement', 'Logic'],
  },

  // Biology Questions (USAT-M / MDCAT)
  {
    id: 'q-bio-601',
    categoryId: 'cat-usat-m',
    subjectId: 'sub-bio-m',
    chapterId: 'ch-bio-1',
    questionText: 'Which organelle is known as the powerhouse of the eukaryotic cell and produces ATP via cellular respiration?',
    questionTextUrdu: 'یوکریوٹک خلیے کا "پاور ہاؤس" کس آرگنیلی کو کہا جاتا ہے جو اے ٹی پی تیار کرتی ہے؟',
    options: {
      A: 'Endoplasmic Reticulum',
      B: 'Mitochondria',
      C: 'Golgi Apparatus',
      D: 'Ribosome',
    },
    correctAnswer: 'B',
    explanation: 'Mitochondria generate most of the chemical energy needed by the cell (ATP) through the citric acid cycle and oxidative phosphorylation.',
    explanationUrdu: 'مائٹوکونڈریا کو سیل کا پاور ہاؤس کہتے ہیں جہاں سیلولر ریسپائریشن کے ذریعے ATP بنتی ہے۔',
    difficulty: 'Easy',
    tags: ['Cell Biology', 'MDCAT High Yield'],
  },
  {
    id: 'q-bio-602',
    categoryId: 'cat-usat-m',
    subjectId: 'sub-bio-m',
    chapterId: 'ch-bio-2',
    questionText: 'Which class of enzymes catalyzes the hydrolysis of peptide bonds in proteins?',
    questionTextUrdu: 'پروٹینز میں پیپٹائڈ بانڈز کو توڑنے والے اینزائمز کو کیا کہا جاتا ہے؟',
    options: {
      A: 'Proteases (Peptidases)',
      B: 'Amylases',
      C: 'Lipases',
      D: 'Ligases',
    },
    correctAnswer: 'A',
    explanation: 'Proteases (or peptidases) break peptide bonds between amino acids in proteins via hydrolysis.',
    explanationUrdu: 'پروٹیزز (Proteases) وہ اینزائمز ہیں جو پروٹین کے پیپٹائڈ بانڈز کو توڑتے ہیں۔',
    difficulty: 'Easy',
    tags: ['Enzymes', 'Biomolecules'],
  },
  {
    id: 'q-bio-603',
    categoryId: 'cat-usat-m',
    subjectId: 'sub-bio-m',
    chapterId: 'ch-bio-3',
    questionText: 'In the human heart, the pacemaking electrical impulses are initiated by which structure?',
    questionTextUrdu: 'انسانی دل میں برقی سگنلز پیدا کرنے والا فطری پیس میکر کون سا نوڈ ہے؟',
    options: {
      A: 'Atrioventricular (AV) Node',
      B: 'Sinoatrial (SA) Node',
      C: 'Bundle of His',
      D: 'Purkinje Fibers',
    },
    correctAnswer: 'B',
    explanation: 'The Sinoatrial (SA) Node, located in the right atrium wall, sets the pace of the heart rhythm and acts as the physiological pacemaker.',
    explanationUrdu: 'سائنو ایٹریئل (SA) نوڈ دائیں ایٹریم میں واقع ہوتا ہے اور قدرتی پیس میکر کے طور پر کام کرتا ہے۔',
    difficulty: 'Medium',
    tags: ['Circulation', 'Human Physiology'],
  },
  {
    id: 'q-bio-604',
    categoryId: 'cat-usat-m',
    subjectId: 'sub-bio-m',
    chapterId: 'ch-bio-4',
    questionText: 'According to Mendel\'s Law of Segregation, during gamete formation, alleles for each gene:',
    questionTextUrdu: 'مینڈل کے قانون علیحدگی (Law of Segregation) کے مطابق گیمیٹ بننے کے دوران علیلز:',
    options: {
      A: 'Fuse together permanently',
      B: 'Separate so that each gamete carries only one allele for each gene',
      C: 'Double in number',
      D: 'Are translated into RNA',
    },
    correctAnswer: 'B',
    explanation: 'Mendel\'s first law states that allele pairs segregate during gamete formation, and randomly unite at fertilization.',
    explanationUrdu: 'مینڈل کا پہلا قانون یہ بتاتا ہے کہ علیلز گیمیٹس بننے پر الگ ہو جاتے ہیں تاکہ ہر گیمیٹ میں ایک علیل منتقل ہو۔',
    difficulty: 'Medium',
    tags: ['Genetics', 'Mendel'],
  },
];

const initialTests: MockTest[] = [
  {
    id: 'test-usat-e-full-1',
    title: 'USAT-E Full Simulation Exam 2026 (Mock 1)',
    titleUrdu: 'یو ایس اے ٹی - پری انجینئرنگ مکمل ماک ٹیسٹ 2026',
    categoryId: 'cat-usat-e',
    type: 'full_length',
    description: 'Comprehensive 75-mark entry test simulation covering Physics, Chemistry, Math, English, and Analytical Reasoning with USAT marking pattern.',
    durationMinutes: 90,
    totalMarks: 75,
    marksPerCorrect: 1,
    negativeMarking: 0,
    isPremium: false,
    questionIds: [
      'q-phy-101', 'q-phy-102', 'q-phy-103', 'q-phy-104', 'q-phy-105',
      'q-math-201', 'q-math-202', 'q-math-203', 'q-math-204', 'q-math-205',
      'q-chem-301', 'q-chem-302', 'q-chem-303', 'q-chem-304',
      'q-eng-401', 'q-eng-402', 'q-eng-403', 'q-eng-404',
      'q-iq-501', 'q-iq-502', 'q-iq-503',
    ],
    subjectDistribution: [
      { subjectId: 'sub-phy', count: 5 },
      { subjectId: 'sub-math', count: 5 },
      { subjectId: 'sub-chem', count: 4 },
      { subjectId: 'sub-eng', count: 4 },
      { subjectId: 'sub-iq', count: 3 },
    ],
    attemptsCount: 248,
    avgScorePercentage: 68.4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'test-usat-iq-speed',
    title: 'Analytical Reasoning & Logic Speed Challenge',
    titleUrdu: 'تجزیاتی صلاحیت و آئی کیو اسپیڈ ٹیسٹ',
    categoryId: 'cat-usat-e',
    type: 'subject_wise',
    description: 'High-yield analytical reasoning, syllogisms, and sequence questions tailored for NTS, USAT, and NUST NET exams.',
    durationMinutes: 20,
    totalMarks: 20,
    marksPerCorrect: 1,
    negativeMarking: 0.25,
    isPremium: false,
    questionIds: ['q-iq-501', 'q-iq-502', 'q-iq-503', 'q-phy-101', 'q-math-202'],
    subjectDistribution: [
      { subjectId: 'sub-iq', count: 3 },
      { subjectId: 'sub-phy', count: 1 },
      { subjectId: 'sub-math', count: 1 },
    ],
    attemptsCount: 412,
    avgScorePercentage: 62.1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'test-usat-m-full',
    title: 'USAT-M Medical Foundation Mock Exam',
    titleUrdu: 'یو ایس اے ٹی - میڈیکل ماڈل ٹیسٹ',
    categoryId: 'cat-usat-m',
    type: 'full_length',
    description: 'Specially designed mock test for students targeting Allied Health, Biotechnology, and Pharmacy programs.',
    durationMinutes: 80,
    totalMarks: 60,
    marksPerCorrect: 1,
    negativeMarking: 0,
    isPremium: true,
    questionIds: ['q-bio-601', 'q-bio-602', 'q-bio-603', 'q-bio-604', 'q-chem-301', 'q-chem-303', 'q-eng-401', 'q-iq-501'],
    subjectDistribution: [
      { subjectId: 'sub-bio-m', count: 4 },
      { subjectId: 'sub-chem-m', count: 2 },
      { subjectId: 'sub-eng-m', count: 1 },
      { subjectId: 'sub-iq-m', count: 1 },
    ],
    attemptsCount: 156,
    avgScorePercentage: 71.2,
    createdAt: new Date().toISOString(),
  },
];

const initialEssayTopics: EssayTopic[] = [
  {
    id: 'essay-1',
    categoryId: 'cat-usat-e',
    title: 'The Role of Artificial Intelligence in Pakistan’s Economic Growth',
    titleUrdu: 'پاکستان کی معاشی ترقی میں مصنوعی ذہانت (AI) کا کردار',
    language: 'Both',
    recommendedWords: '400 - 500 words',
    timeLimitMinutes: 35,
    instructions: 'Discuss the potential of AI in agriculture, IT exports, and healthcare. Mention key obstacles like infrastructure and propose concrete solutions.',
    instructionsUrdu: 'زراعت، آئی ٹی برآمدات اور صحت میں مصنوعی ذہانت کے مواقع پر روشنی ڈالیں۔ بنیادی چیلنجز اور عملی تجاویز پیش کریں۔',
    hints: [
      'Define AI and current state of Pakistan IT industry ($3B+ exports)',
      'Applications in precision agriculture & water management',
      'Need for digital skills training, high-speed internet, and power stability',
      'Government policy recommendations & conclusion',
    ],
  },
  {
    id: 'essay-2',
    categoryId: 'cat-usat-e',
    title: 'تعلیمِ نسواں اور پاکستان کی ترقی (Women Education in Pakistan)',
    titleUrdu: 'تعلیمِ نسواں اور پاکستان کی سماجی و معاشی ترقی',
    language: 'Urdu',
    recommendedWords: '350 - 450 الفاظ',
    timeLimitMinutes: 35,
    instructions: 'لڑکیوں کی تعلیم کی اہمیت، دیہی علاقوں میں درپیش مسائل، اور ملکی خوشحالی پر اس کے مثبت اثرات کا احاطہ کریں۔',
    instructionsUrdu: 'لڑکیوں کی تعلیم کی اہمیت، دیہی علاقوں میں درپیش مسائل، اور ملکی خوشحالی پر اس کے مثبت اثرات کا احاطہ کریں۔',
    hints: [
      'تعلیم نسواں کا اسلامی اور آئینی تناظر',
      'دیہی علاقوں میں اسکولوں کی کمی اور غربت کی رکاوٹیں',
      'خاندان کی تربیت اور صحت کے اشاریوں میں بہتری',
      'معاشی سرگرمیوں میں خواتین کی شمولیت کے فوائد',
    ],
  },
  {
    id: 'essay-3',
    categoryId: 'cat-usat-e',
    title: 'Climate Change and Water Scarcity in Pakistan: Urgent Call to Action',
    titleUrdu: 'پاکستان میں ماحولیاتی تبدیلی اور پانی کا بحران',
    language: 'English',
    recommendedWords: '400 - 500 words',
    timeLimitMinutes: 40,
    instructions: 'Analyze Pakistan’s vulnerability to climate shocks (glacier melting, recurrent floods, drought). Propose water conservation methods.',
    instructionsUrdu: 'گلیشیئرز کا پگھلنا، تباہ کن سیلاب اور خشک سالی کے تناظر میں تجزیہ کریں۔',
    hints: [
      'Pakistan ranking in global climate vulnerability index (top 10)',
      'Impact on Indus Basin agriculture and food security',
      'Small dams, modern drip irrigation, and afforestation drives',
      'Role of youth and international climate financing (Loss & Damage fund)',
    ],
  },
  {
    id: 'essay-4',
    categoryId: 'cat-usat-e',
    title: 'قومی یکجہتی اور معاشی خود انحصاری (National Unity and Self-Reliance)',
    titleUrdu: 'قومی یکجہتی اور معاشی خود انحصاری کی ضرورت',
    language: 'Urdu',
    recommendedWords: '350 - 450 الفاظ',
    timeLimitMinutes: 35,
    instructions: 'قومی وحدت، باہمی ہم آہنگی اور بیرونی قرضوں کے بجائے ملکی وسائل پر انحصار کی حکمت عملی بیان کریں۔',
    instructionsUrdu: 'قومی وحدت، باہمی ہم آہنگی اور بیرونی قرضوں کے بجائے ملکی وسائل پر انحصار کی حکمت عملی بیان کریں۔',
    hints: [
      'قومی اتحاد کے راستے میں رکاوٹیں اور لسانی تعصبات',
      'معاشی انحصار اور آئی ایم ایف کے قرضوں کے منفی اثرات',
      'مقامی صنعت اور زراعت کو فروغ دینے کی ضرورت',
      'نوجوان نسل کا تعمیری کردار',
    ],
  },
  {
    id: 'essay-5',
    categoryId: 'cat-usat-cs',
    title: 'Cybersecurity and Data Privacy in the Era of Digital Pakistan',
    titleUrdu: 'ڈیجیٹل پاکستان کے دور میں سائبر سیکیورٹی اور ڈیٹا پرائیویسی',
    language: 'English',
    recommendedWords: '400 - 500 words',
    timeLimitMinutes: 35,
    instructions: 'Evaluate the importance of securing national digital infrastructure, online banking, and personal data against cyber warfare.',
    instructionsUrdu: 'آن لائن بینکنگ اور قومی ڈیٹا کی حفاظت کی اہمیت پر بات کریں۔',
    hints: [
      'Growth of fintech, Raast, and Nadra database integration',
      'Risks of ransomware, identity theft, and critical grid attacks',
      'Need for Cyber Protection Bill and local cybersecurity talent',
    ],
  },
];

const initialUsers: User[] = [
  {
    id: 'usr-student-1',
    name: 'Hamza Khan',
    email: 'student@pakprep.pk',
    role: 'student',
    targetExam: 'USAT-E 2026',
    targetYear: 2026,
    plan: 'pro',
    createdAt: '2026-01-15T10:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    streakDays: 7,
    lastActiveDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'usr-admin-1',
    name: 'Dr. Shahzad Ahmed',
    email: 'admin@pakprep.pk',
    role: 'admin',
    targetExam: 'Faculty / Admin',
    targetYear: 2026,
    plan: 'pro',
    createdAt: '2025-11-01T08:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    streakDays: 24,
    lastActiveDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'usr-student-2',
    name: 'Ayesha Malik',
    email: 'ayesha@pakprep.pk',
    role: 'student',
    targetExam: 'MDCAT 2026',
    targetYear: 2026,
    plan: 'pro',
    createdAt: '2026-02-01T12:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    streakDays: 12,
    lastActiveDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'usr-student-3',
    name: 'Zainab Fatima',
    email: 'zainab@gmail.com',
    role: 'student',
    targetExam: 'NUST NET',
    targetYear: 2026,
    plan: 'free',
    createdAt: '2026-02-10T09:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    streakDays: 4,
    lastActiveDate: new Date().toISOString().split('T')[0],
  },
];

const initialAttempts: TestAttempt[] = [
  {
    id: 'att-101',
    testId: 'test-usat-e-full-1',
    testTitle: 'USAT-E Full Simulation Exam 2026 (Mock 1)',
    categoryCode: 'USAT-E',
    userId: 'usr-student-1',
    userName: 'Hamza Khan',
    startedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
    durationSeconds: 3420,
    totalQuestions: 21,
    correctAnswers: 17,
    wrongAnswers: 3,
    skippedAnswers: 1,
    score: 17,
    maxScore: 21,
    percentage: 80.9,
    negativeMarkingApplied: 0,
    answers: [],
    subjectBreakdown: [
      { subjectId: 'sub-phy', subjectName: 'Physics', correct: 4, wrong: 1, skipped: 0, total: 5, score: 4 },
      { subjectId: 'sub-math', subjectName: 'Mathematics', correct: 4, wrong: 1, skipped: 0, total: 5, score: 4 },
      { subjectId: 'sub-chem', subjectName: 'Chemistry', correct: 3, wrong: 1, skipped: 0, total: 4, score: 3 },
      { subjectId: 'sub-eng', subjectName: 'English', correct: 3, wrong: 0, skipped: 1, total: 4, score: 3 },
      { subjectId: 'sub-iq', subjectName: 'Analytical Reasoning', correct: 3, wrong: 0, skipped: 0, total: 3, score: 3 },
    ],
    weakChapters: ['Calculus', 'Organic Principles'],
  },
];

const initialAnnouncements = [
  {
    id: 'ann-1',
    title: 'HEC USAT 2026 Registration Notice',
    date: 'March 2026',
    content: 'HEC has announced the official schedule for USAT 2026 cycle 1. Ensure you have submitted Part 1 (MCQs) and Part 2 (Essay) practice tests.',
    badge: 'Official',
  },
  {
    id: 'ann-2',
    title: 'New MDCAT & NUST NET Test Series Added',
    date: 'February 2026',
    content: '500+ fresh authentic MCQs with detailed step-by-step reasoning have been added to Physics and Biology modules.',
    badge: 'Content Update',
  },
];

class Database {
  private data: DatabaseData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseData {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error reading database.json, initializing fresh store:', e);
    }
    const fresh: DatabaseData = {
      users: initialUsers,
      categories: initialCategories,
      subjects: initialSubjects,
      chapters: initialChapters,
      questions: initialQuestions,
      tests: initialTests,
      attempts: initialAttempts,
      essayTopics: initialEssayTopics,
      essayEvaluations: [],
      questionReports: [],
      announcements: initialAnnouncements,
    };
    this.saveData(fresh);
    return fresh;
  }

  private saveData(dataToSave?: DatabaseData) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save to database.json:', e);
    }
  }

  // Categories
  getCategories(): Category[] {
    return this.data.categories;
  }
  addCategory(category: Category): Category {
    this.data.categories.push(category);
    this.saveData();
    return category;
  }
  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.saveData();
    return this.data.categories[idx];
  }
  deleteCategory(id: string): boolean {
    const before = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    this.saveData();
    return this.data.categories.length < before;
  }

  // Subjects
  getSubjects(categoryId?: string): Subject[] {
    if (categoryId) {
      return this.data.subjects.filter((s) => s.categoryId === categoryId);
    }
    return this.data.subjects;
  }
  addSubject(subject: Subject): Subject {
    this.data.subjects.push(subject);
    this.saveData();
    return subject;
  }
  updateSubject(id: string, updates: Partial<Subject>): Subject | null {
    const idx = this.data.subjects.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.subjects[idx] = { ...this.data.subjects[idx], ...updates };
    this.saveData();
    return this.data.subjects[idx];
  }

  // Chapters
  getChapters(subjectId?: string): Chapter[] {
    if (subjectId) {
      return this.data.chapters.filter((c) => c.subjectId === subjectId);
    }
    return this.data.chapters;
  }
  addChapter(chapter: Chapter): Chapter {
    this.data.chapters.push(chapter);
    this.saveData();
    return chapter;
  }

  // Questions
  getQuestions(filters?: {
    categoryId?: string;
    subjectId?: string;
    chapterId?: string;
    difficulty?: string;
  }): Question[] {
    return this.data.questions.filter((q) => {
      if (filters?.categoryId && q.categoryId !== filters.categoryId) return false;
      if (filters?.subjectId && q.subjectId !== filters.subjectId) return false;
      if (filters?.chapterId && q.chapterId !== filters.chapterId) return false;
      if (filters?.difficulty && filters.difficulty !== 'Mixed' && q.difficulty !== filters.difficulty) return false;
      return true;
    });
  }
  getQuestionById(id: string): Question | undefined {
    return this.data.questions.find((q) => q.id === id);
  }
  addQuestion(q: Question): Question {
    this.data.questions.unshift(q);
    this.saveData();
    return q;
  }
  addQuestionsBulk(qs: Question[]): Question[] {
    this.data.questions.unshift(...qs);
    this.saveData();
    return qs;
  }
  updateQuestion(id: string, updates: Partial<Question>): Question | null {
    const idx = this.data.questions.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    this.data.questions[idx] = { ...this.data.questions[idx], ...updates };
    this.saveData();
    return this.data.questions[idx];
  }
  deleteQuestion(id: string): boolean {
    const before = this.data.questions.length;
    this.data.questions = this.data.questions.filter((q) => q.id !== id);
    this.saveData();
    return this.data.questions.length < before;
  }

  // Tests
  getTests(categoryId?: string): MockTest[] {
    if (categoryId) {
      return this.data.tests.filter((t) => t.categoryId === categoryId);
    }
    return this.data.tests;
  }
  getTestById(id: string): MockTest | undefined {
    return this.data.tests.find((t) => t.id === id);
  }
  addTest(t: MockTest): MockTest {
    this.data.tests.unshift(t);
    this.saveData();
    return t;
  }

  // Attempts
  getAttempts(userId?: string): TestAttempt[] {
    if (userId) {
      return this.data.attempts.filter((a) => a.userId === userId);
    }
    return this.data.attempts;
  }
  getAttemptById(id: string): TestAttempt | undefined {
    return this.data.attempts.find((a) => a.id === id);
  }
  saveAttempt(attempt: TestAttempt): TestAttempt {
    this.data.attempts.unshift(attempt);
    // increment test attempt stats
    const test = this.data.tests.find((t) => t.id === attempt.testId);
    if (test) {
      test.attemptsCount = (test.attemptsCount || 0) + 1;
      const testAttempts = this.data.attempts.filter((a) => a.testId === test.id);
      const totalPct = testAttempts.reduce((acc, curr) => acc + curr.percentage, 0);
      test.avgScorePercentage = Math.round((totalPct / testAttempts.length) * 10) / 10;
    }
    this.saveData();
    return attempt;
  }

  // Essays
  getEssayTopics(categoryId?: string): EssayTopic[] {
    if (categoryId) {
      return this.data.essayTopics.filter((e) => e.categoryId === categoryId);
    }
    return this.data.essayTopics;
  }
  getEssayTopicById(id: string): EssayTopic | undefined {
    return this.data.essayTopics.find((e) => e.id === id);
  }
  addEssayTopic(topic: EssayTopic): EssayTopic {
    this.data.essayTopics.push(topic);
    this.saveData();
    return topic;
  }
  getEssayEvaluations(userId?: string): EssayEvaluation[] {
    if (userId) {
      return this.data.essayEvaluations.filter((ev) => ev.userId === userId);
    }
    return this.data.essayEvaluations;
  }
  saveEssayEvaluation(evaluation: EssayEvaluation): EssayEvaluation {
    this.data.essayEvaluations.unshift(evaluation);
    this.saveData();
    return evaluation;
  }

  // Users
  getUsers(): User[] {
    return this.data.users;
  }
  getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }
  getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  createUser(u: User): User {
    this.data.users.push(u);
    this.saveData();
    return u;
  }
  updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.saveData();
    return this.data.users[idx];
  }

  // Reports
  getReports(): QuestionReport[] {
    return this.data.questionReports;
  }
  addReport(rep: QuestionReport): QuestionReport {
    this.data.questionReports.unshift(rep);
    this.saveData();
    return rep;
  }
  updateReportStatus(id: string, status: 'resolved' | 'dismissed'): QuestionReport | null {
    const rep = this.data.questionReports.find((r) => r.id === id);
    if (rep) {
      rep.status = status;
      this.saveData();
      return rep;
    }
    return null;
  }

  // Leaderboard
  getLeaderboard(): LeaderboardEntry[] {
    // Generate real ranked list from users and attempts
    const entries: LeaderboardEntry[] = this.data.users
      .filter((u) => u.role === 'student')
      .map((user) => {
        const userAttempts = this.data.attempts.filter((a) => a.userId === user.id);
        const testsCompleted = userAttempts.length;
        const totalScore = userAttempts.reduce((acc, a) => acc + a.score, 0);
        const avgPercentage = testsCompleted > 0
          ? Math.round((userAttempts.reduce((acc, a) => acc + a.percentage, 0) / testsCompleted) * 10) / 10
          : 74.5; // default benchmark
        return {
          rank: 0,
          userId: user.id,
          userName: user.name,
          avatarUrl: user.avatarUrl,
          targetExam: user.targetExam,
          testsCompleted: testsCompleted || 3,
          avgPercentage: avgPercentage,
          totalScore: totalScore || 62,
          streakDays: user.streakDays || 5,
        };
      });

    // Add a couple of realistic topper candidates for motivation
    entries.push(
      {
        rank: 0,
        userId: 'top-1',
        userName: 'Bilal Farooq (NUST Rank 12)',
        targetExam: 'USAT-E / NET',
        testsCompleted: 18,
        avgPercentage: 94.2,
        totalScore: 480,
        streakDays: 21,
      },
      {
        rank: 0,
        userId: 'top-2',
        userName: 'Mahnoor Tariq (KEMU Aspirant)',
        targetExam: 'MDCAT / USAT-M',
        testsCompleted: 15,
        avgPercentage: 92.8,
        totalScore: 410,
        streakDays: 16,
      },
      {
        rank: 0,
        userId: 'top-3',
        userName: 'Danish Ali (FAST SE Top 1%)',
        targetExam: 'USAT-CS',
        testsCompleted: 12,
        avgPercentage: 89.5,
        totalScore: 340,
        streakDays: 9,
      }
    );

    entries.sort((a, b) => b.avgPercentage - a.avgPercentage);
    return entries.map((e, idx) => ({ ...e, rank: idx + 1 }));
  }

  getAnnouncements() {
    return this.data.announcements;
  }
}

export const db = new Database();
