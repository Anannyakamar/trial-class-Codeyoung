export interface CoursePricing {
  amount: number;
  currency: string;
  currencySymbol: string;
  billingPeriod: string;
  perClassPrice: string;
  isSample: boolean;
  disclaimer: string;
}

export interface Course {
  id: string;
  name: string;
  category: string;
  badge: string;
  ageRange: string;
  grades: string;
  durationPerClass: string;
  totalSessions: string;
  shortDescription: string;
  fullDescription: string;
  learningOutcomes: string[];
  keyTopics: string[];
  prerequisites: string;
  pricing: CoursePricing;
  iconName: 'Calculator' | 'FlaskConical' | 'Binary' | 'ShieldAlert' | 'Layout' | 'Code2';
  colorGradient: string;
  accentColor: string;
}

/**
 * Centralized Demo Catalog for Codeyoung Trial Booking.
 * Note: Prices configured below are sample/placeholder values for demonstration
 * and UI workflow purposes and are not official commercial rates.
 */
export const COURSES: Course[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    category: 'STEM & Logic',
    badge: 'Foundational & Advanced',
    ageRange: 'Ages 6–16',
    grades: 'Grades 1–10',
    durationPerClass: '30 mins (Trial) / 60 mins (Regular)',
    totalSessions: '48 Interactive Sessions',
    shortDescription:
      'Master conceptual math, geometric visualization, algebra, and competition problem-solving through interactive visual models.',
    fullDescription:
      'Codeyoung Mathematics goes beyond rote memorization to nurture deep spatial reasoning, algebraic intuition, and mathematical logic. Designed with visual problem-solving toolkits and game-based challenges, students develop authentic passion and confidence in school math and Olympiad competitions.',
    learningOutcomes: [
      'Number sense, place values, and multi-step mental arithmetic',
      'Algebraic thinking, equation balancing, and proportional reasoning',
      'Euclidean geometry, spatial transformations, and coordinate graphing',
      'Data interpretation, probability models, and competition math heuristics',
    ],
    keyTopics: ['Number Theory', 'Applied Algebra', 'Geometry & Mensuration', 'Logic Puzzles', 'Olympiad Math'],
    prerequisites: 'No prior prerequisites. Curriculum tailored to student grade level.',
    pricing: {
      amount: 24,
      currency: 'USD',
      currencySymbol: '$',
      billingPeriod: 'per class (billed monthly at $96 for 4 classes)',
      perClassPrice: '$24 / class',
      isSample: true,
      disclaimer: 'Sample demo catalog pricing for demonstration purposes.',
    },
    iconName: 'Calculator',
    colorGradient: 'from-blue-500 to-indigo-600',
    accentColor: 'text-blue-600',
  },
  {
    id: 'science',
    name: 'Science',
    category: 'Inquiry & Experiments',
    badge: 'Hands-on Labs',
    ageRange: 'Ages 8–15',
    grades: 'Grades 3–9',
    durationPerClass: '30 mins (Trial) / 60 mins (Regular)',
    totalSessions: '36 Interactive Sessions',
    shortDescription:
      'Explore physics, chemistry, and biology through real-time virtual simulations, hands-on scientific experiments, and guided inquiry.',
    fullDescription:
      'Inspire your child’s natural curiosity with interactive science simulations. Students formulate hypotheses, experiment with physics kinematics, explore cellular biology, and study chemical reactions in a safe, mentor-guided virtual lab environment.',
    learningOutcomes: [
      'Scientific method: hypothesis formation, data observation, and analysis',
      'Forces, energy conservation, simple machines, and astrophysics basics',
      'States of matter, molecular bonds, and environmental cycles',
      'Human body systems, genetics fundamentals, and ecological balance',
    ],
    keyTopics: ['Physics Dynamics', 'Intro Chemistry', 'Life Sciences & Ecology', 'Earth & Space Science'],
    prerequisites: 'Basic reading and curiosity about natural phenomena.',
    pricing: {
      amount: 25,
      currency: 'USD',
      currencySymbol: '$',
      billingPeriod: 'per class (billed monthly at $100 for 4 classes)',
      perClassPrice: '$25 / class',
      isSample: true,
      disclaimer: 'Sample demo catalog pricing for demonstration purposes.',
    },
    iconName: 'FlaskConical',
    colorGradient: 'from-emerald-500 to-teal-600',
    accentColor: 'text-emerald-600',
  },
  {
    id: 'arithmetic',
    name: 'Arithmetic',
    category: 'Speed & Accuracy',
    badge: 'Mental Mastery',
    ageRange: 'Ages 6–12',
    grades: 'Grades 1–6',
    durationPerClass: '30 mins (Trial) / 60 mins (Regular)',
    totalSessions: '32 Interactive Sessions',
    shortDescription:
      'Build lightning-fast mental math speed, precision calculation techniques, Vedic shortcuts, and foundational number confidence.',
    fullDescription:
      'A structured arithmetic program that eliminates calculator dependency and calculation anxiety. Through engaging speed drills, pattern recognition, and mental math tricks, children calculate complex numbers faster with 100% accuracy.',
    learningOutcomes: [
      'Rapid mental addition, subtraction, multiplication, and long division',
      'Fractions, decimals, percentages, and unit conversions made effortless',
      'Vedic math shortcuts and instant error-checking strategies',
      'High confidence and speed in timed classroom tests',
    ],
    keyTopics: ['Speed Drills', 'Mental Math Shortcuts', 'Fractions & Decimals', 'Percentage Mastery', 'Vedic Math'],
    prerequisites: 'Basic knowledge of counting and numbers 1–100.',
    pricing: {
      amount: 22,
      currency: 'USD',
      currencySymbol: '$',
      billingPeriod: 'per class (billed monthly at $88 for 4 classes)',
      perClassPrice: '$22 / class',
      isSample: true,
      disclaimer: 'Sample demo catalog pricing for demonstration purposes.',
    },
    iconName: 'Binary',
    colorGradient: 'from-amber-500 to-orange-600',
    accentColor: 'text-amber-600',
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security',
    category: 'Tech & Safety',
    badge: 'Ethical Hacking',
    ageRange: 'Ages 11–18',
    grades: 'Grades 6–12',
    durationPerClass: '30 mins (Trial) / 60 mins (Regular)',
    totalSessions: '40 Interactive Sessions',
    shortDescription:
      'Learn digital defense, ethical hacking concepts, cryptography, internet safety, and secure network fundamentals.',
    fullDescription:
      'Equip young learners with essential 21st-century digital defense skills. This course covers how networks operate, how data is encrypted, identifying malware and phishing scams, and defensive security measures in simulated cyber labs.',
    learningOutcomes: [
      'Fundamentals of computer networks, IP addressing, and packet routing',
      'Symmetric and asymmetric encryption, hashing, and password security',
      'Identifying social engineering, phishing, malware, and ransomware',
      'Ethical hacking methodologies and defensive firewall configuration',
    ],
    keyTopics: ['Network Protocols', 'Cryptography Basics', 'Web Defense', 'Ethical Hacking Lab', 'Online Privacy'],
    prerequisites: 'Basic computer literacy and familiarity with using web browsers.',
    pricing: {
      amount: 30,
      currency: 'USD',
      currencySymbol: '$',
      billingPeriod: 'per class (billed monthly at $120 for 4 classes)',
      perClassPrice: '$30 / class',
      isSample: true,
      disclaimer: 'Sample demo catalog pricing for demonstration purposes.',
    },
    iconName: 'ShieldAlert',
    colorGradient: 'from-rose-500 to-pink-600',
    accentColor: 'text-rose-600',
  },
  {
    id: 'web-development',
    name: 'Web Development',
    category: 'Creative Coding',
    badge: 'Full-Stack Foundations',
    ageRange: 'Ages 10–18',
    grades: 'Grades 5–12',
    durationPerClass: '30 mins (Trial) / 60 mins (Regular)',
    totalSessions: '44 Interactive Sessions',
    shortDescription:
      'Build real responsive websites, interactive web applications, and digital portfolios from scratch using modern HTML, CSS, and JavaScript.',
    fullDescription:
      'Transform students from passive internet consumers to creative web creators. Students build responsive websites, interactive UI components, games, and web apps, publishing live sites to share with family, teachers, and peers.',
    learningOutcomes: [
      'Semantic HTML5 document structuring and web accessibility standards',
      'Modern CSS3 styling: Flexbox, Grid, animations, and mobile responsiveness',
      'Interactive JavaScript: DOM manipulation, events, and API integration',
      'Publishing and hosting live web applications online',
    ],
    keyTopics: ['HTML5 & Semantic Web', 'CSS3 Layouts & Animations', 'JavaScript Essentials', 'Web Apps & Hosting'],
    prerequisites: 'Comfortable with typing and basic computer operations.',
    pricing: {
      amount: 28,
      currency: 'USD',
      currencySymbol: '$',
      billingPeriod: 'per class (billed monthly at $112 for 4 classes)',
      perClassPrice: '$28 / class',
      isSample: true,
      disclaimer: 'Sample demo catalog pricing for demonstration purposes.',
    },
    iconName: 'Layout',
    colorGradient: 'from-violet-500 to-purple-600',
    accentColor: 'text-violet-600',
  },
  {
    id: 'python-programming',
    name: 'Python Programming',
    category: 'Software & AI',
    badge: 'Industry Standard',
    ageRange: 'Ages 9–18',
    grades: 'Grades 4–12',
    durationPerClass: '30 mins (Trial) / 60 mins (Regular)',
    totalSessions: '48 Interactive Sessions',
    shortDescription:
      'Code real-world Python applications, games, automation scripts, and algorithmic challenges using industry-standard syntax.',
    fullDescription:
      'Python is the world’s most versatile programming language. In this hands-on course, students learn variables, loops, data structures, object-oriented concepts, and build text adventures, GUI tools, and data visualizations with live mentor guidance.',
    learningOutcomes: [
      'Core syntax, data types, conditional branching, loops, and functions',
      'Data structures: lists, tuples, dictionaries, and string manipulation',
      'Object-oriented programming, classes, and modular design',
      'Building arcade games (Pygame), data charts, and creative projects',
    ],
    keyTopics: ['Python Syntax', 'Computational Logic', 'Data Structures', 'Pygame Game Dev', 'Intro to AI Concepts'],
    prerequisites: 'Basic typing ability. No prior programming background required.',
    pricing: {
      amount: 28,
      currency: 'USD',
      currencySymbol: '$',
      billingPeriod: 'per class (billed monthly at $112 for 4 classes)',
      perClassPrice: '$28 / class',
      isSample: true,
      disclaimer: 'Sample demo catalog pricing for demonstration purposes.',
    },
    iconName: 'Code2',
    colorGradient: 'from-sky-500 to-cyan-600',
    accentColor: 'text-sky-600',
  },
];

export function getCourseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id.toLowerCase() === id.toLowerCase() || c.name.toLowerCase() === id.toLowerCase());
}

export const COUNTRY_CODES = [
  { code: '+1', country: 'US / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
];
