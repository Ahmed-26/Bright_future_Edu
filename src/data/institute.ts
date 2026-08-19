// DEMO DATA — placeholder content for design preview only.
// None of the results, teachers or testimonials below describe real people.

export const site = {
  name: "Bright Future Group of Education",
  tagline: "O Level · A Level · IGCSE",
  phone: "+92 300 000 0000",
  email: "admissions@meridian-academy.demo",
  address: "12 Scholars Avenue, Gulberg III, Lahore, Pakistan",
  hours: "Mon – Sat, 9:00 AM – 8:00 PM",
  socials: { facebook: "#", instagram: "#", youtube: "#", whatsapp: "#" },
};

export const stats = [
  { value: 10000, suffix: "+", label: "Students Taught" },
  { value: 50, suffix: "+", label: "Expert Teachers" },
  { value: 25, suffix: "+", label: "Subjects" },
  { value: 95, suffix: "%", label: "Success Rate" },
  { value: 500, suffix: "+", label: "A Grades" },
];

export const examBoards = [
  { name: "Cambridge", note: "CAIE Assessment International Education" },
  { name: "O Level", note: "Cambridge Ordinary Level" },
  { name: "A Level", note: "Advanced Level, AS & A2" },
  { name: "IGCSE", note: "International General Certificate" },
  { name: "Pearson Edexcel", note: "International GCSE & IAL" },
];

export type Subject = {
  slug: string;
  name: string;
  levels: string[];
  description: string;
  courses: number;
};

export const subjects: Subject[] = [
  {
    slug: "accounting",
    name: "Accounting",
    levels: ["O Level", "A Level"],
    description:
      "Financial statements, ledgers, ratio analysis and control accounts taught through structured past-paper practice.",
    courses: 3,
  },
  {
    slug: "business",
    name: "Business",
    levels: ["O Level", "A Level", "IGCSE"],
    description:
      "Enterprise, marketing, operations and finance with case-study technique for data-response questions.",
    courses: 3,
  },
  {
    slug: "economics",
    name: "Economics",
    levels: ["O Level", "A Level", "IGCSE"],
    description:
      "Micro and macro theory, diagrams and essay structuring built for full-mark evaluation answers.",
    courses: 3,
  },
  {
    slug: "mathematics",
    name: "Mathematics",
    levels: ["O Level", "A Level", "IGCSE"],
    description:
      "Pure, mechanics and statistics with weekly problem sets and timed topical assessments.",
    courses: 4,
  },
  {
    slug: "physics",
    name: "Physics",
    levels: ["O Level", "A Level", "IGCSE"],
    description:
      "Concept-first teaching with derivations, practical technique and ATP paper preparation.",
    courses: 3,
  },
  {
    slug: "chemistry",
    name: "Chemistry",
    levels: ["O Level", "A Level", "IGCSE"],
    description:
      "Physical, inorganic and organic chemistry with mechanism drilling and lab-skill coaching.",
    courses: 3,
  },
  {
    slug: "biology",
    name: "Biology",
    levels: ["O Level", "A Level", "IGCSE"],
    description:
      "Diagram-led learning, definition precision and structured recall for long-answer questions.",
    courses: 2,
  },
  {
    slug: "computer-science",
    name: "Computer Science",
    levels: ["O Level", "A Level"],
    description:
      "Theory papers plus pseudocode, Python and problem-solving for the practical component.",
    courses: 2,
  },
  {
    slug: "english",
    name: "English",
    levels: ["O Level", "IGCSE"],
    description:
      "Directed writing, comprehension technique and composition craft with individual marking.",
    courses: 2,
  },
  {
    slug: "urdu",
    name: "Urdu",
    levels: ["O Level"],
    description:
      "Grammar, essay writing and literature with examiner-style feedback on every submission.",
    courses: 1,
  },
  {
    slug: "islamiat",
    name: "Islamiat",
    levels: ["O Level"],
    description:
      "Source-based answers, quotations and part (b) evaluation structure for top-band responses.",
    courses: 1,
  },
  {
    slug: "pakistan-studies",
    name: "Pakistan Studies",
    levels: ["O Level"],
    description: "History and geography coverage with mark-scheme mapped answer frameworks.",
    courses: 1,
  },
];

export type Course = {
  slug: string;
  title: string;
  subject: string;
  subjectSlug: string;
  level: "O Level" | "A Level" | "IGCSE";
  board: "Cambridge" | "Pearson Edexcel" | "Other";
  code: string;
  duration: string;
  schedule: string;
  fee: string;
  teacher: string;
  teacherSlug: string;
  short: string;
  description: string;
  featured: boolean;
  syllabus: string[];
  requirements: string[];
  benefits: string[];
};

export const courses: Course[] = [
  {
    slug: "o-level-accounting",
    title: "O Level Accounting",
    subject: "Accounting",
    subjectSlug: "accounting",
    level: "O Level",
    board: "Cambridge",
    code: "7707",
    duration: "9 months",
    schedule: "Mon & Thu · 5:00 – 6:30 PM",
    fee: "PKR 9,500 / month",
    teacher: "Sana Iqbal",
    teacherSlug: "sana-iqbal",
    short: "Double-entry foundations to final accounts, with weekly examiner-style paper drills.",
    description:
      "A complete O Level Accounting programme covering the full syllabus from the accounting equation through to the analysis and interpretation of financial statements. Every topic ends with a timed paper section marked against the official mark scheme.",
    featured: true,
    syllabus: [
      "The fundamentals of accounting",
      "Sources and recording of data",
      "Verification of accounting records",
      "Accounting procedures",
      "Preparation of financial statements",
      "Analysis and interpretation",
    ],
    requirements: [
      "Registered for the O Level series",
      "Basic arithmetic confidence",
      "Notebook and calculator",
    ],
    benefits: [
      "Topical past papers from 2015 onwards",
      "Monthly graded mock",
      "Parent progress report each term",
    ],
  },
  {
    slug: "o-level-business",
    title: "O Level Business Studies",
    subject: "Business",
    subjectSlug: "business",
    level: "O Level",
    board: "Cambridge",
    code: "7115",
    duration: "9 months",
    schedule: "Tue & Fri · 4:00 – 5:30 PM",
    fee: "PKR 9,000 / month",
    teacher: "Hamza Raza",
    teacherSlug: "hamza-raza",
    short:
      "Case-study technique and application marks made simple across all four business functions.",
    description:
      "Business Studies taught through live case studies so students learn to apply theory rather than recite it. Focused coaching on the command words that decide the top bands.",
    featured: true,
    syllabus: [
      "Understanding business activity",
      "People in business",
      "Marketing",
      "Operations management",
      "Financial information and decisions",
      "External influences",
    ],
    requirements: [
      "No prior business knowledge needed",
      "Willingness to attempt weekly case studies",
    ],
    benefits: [
      "Case-study answer frameworks",
      "Command-word workshops",
      "Full paper 1 and paper 2 practice",
    ],
  },
  {
    slug: "o-level-economics",
    title: "O Level Economics",
    subject: "Economics",
    subjectSlug: "economics",
    level: "O Level",
    board: "Cambridge",
    code: "2281",
    duration: "9 months",
    schedule: "Mon & Wed · 6:30 – 8:00 PM",
    fee: "PKR 9,000 / month",
    teacher: "Dr. Ayesha Khan",
    teacherSlug: "ayesha-khan",
    short: "Diagram-perfect economics with structured evaluation for the four-part questions.",
    description:
      "From scarcity and market forces to developing economies, this course builds the diagram accuracy and evaluative writing the examiner rewards.",
    featured: false,
    syllabus: [
      "The basic economic problem",
      "The allocation of resources",
      "Microeconomic decision makers",
      "Government and the macroeconomy",
      "Economic development",
      "International trade",
    ],
    requirements: ["Comfort with basic graphs", "Regular reading of business news"],
    benefits: [
      "Diagram bank for every topic",
      "Evaluation sentence starters",
      "Weekly definition tests",
    ],
  },
  {
    slug: "igcse-mathematics",
    title: "IGCSE Mathematics (Extended)",
    subject: "Mathematics",
    subjectSlug: "mathematics",
    level: "IGCSE",
    board: "Cambridge",
    code: "0580",
    duration: "10 months",
    schedule: "Tue & Sat · 10:00 – 11:30 AM",
    fee: "PKR 10,500 / month",
    teacher: "Bilal Ahmed",
    teacherSlug: "bilal-ahmed",
    short: "Extended-tier coverage with speed-and-accuracy drills for papers 2 and 4.",
    description:
      "The extended IGCSE Mathematics syllabus taught topic by topic, then rebuilt through mixed papers so students can move fluently between number, algebra, geometry and statistics under time pressure.",
    featured: true,
    syllabus: [
      "Number",
      "Algebra and graphs",
      "Coordinate geometry",
      "Geometry and mensuration",
      "Trigonometry",
      "Vectors and transformations",
      "Probability and statistics",
    ],
    requirements: ["Scientific calculator", "Comfortable with core-tier arithmetic"],
    benefits: [
      "Topical worksheet pack",
      "Timed mixed papers fortnightly",
      "Doubt-clearing sessions",
    ],
  },
  {
    slug: "igcse-physics",
    title: "IGCSE Physics",
    subject: "Physics",
    subjectSlug: "physics",
    level: "IGCSE",
    board: "Cambridge",
    code: "0625",
    duration: "10 months",
    schedule: "Wed & Sat · 12:00 – 1:30 PM",
    fee: "PKR 10,500 / month",
    teacher: "Usman Tariq",
    teacherSlug: "usman-tariq",
    short: "Concept-driven physics with full alternative-to-practical preparation.",
    description:
      "Physics explained from first principles with demonstrations, then reinforced with numerical technique and the exact phrasing the mark scheme expects.",
    featured: true,
    syllabus: [
      "Motion, forces and energy",
      "Thermal physics",
      "Waves",
      "Electricity and magnetism",
      "Nuclear physics",
      "Space physics",
    ],
    requirements: ["IGCSE Mathematics taken alongside", "Scientific calculator"],
    benefits: ["ATP paper 6 workshops", "Formula recall drills", "Marked numerical sets weekly"],
  },
  {
    slug: "a-level-economics",
    title: "A Level Economics",
    subject: "Economics",
    subjectSlug: "economics",
    level: "A Level",
    board: "Cambridge",
    code: "9708",
    duration: "12 months (AS + A2)",
    schedule: "Mon & Thu · 7:00 – 9:00 PM",
    fee: "PKR 14,000 / month",
    teacher: "Dr. Ayesha Khan",
    teacherSlug: "ayesha-khan",
    short: "AS and A2 essay mastery with the analysis-evaluation balance examiners look for.",
    description:
      "A rigorous A Level Economics course covering AS microeconomics and macroeconomics before advancing to A2 theory, with an essay workshop every fortnight.",
    featured: true,
    syllabus: [
      "Basic economic ideas",
      "The price system",
      "Government microeconomic intervention",
      "The macroeconomy",
      "Government macro intervention",
      "A2 extensions and policy debate",
    ],
    requirements: ["A/B grade at O Level or IGCSE", "Strong written English"],
    benefits: [
      "Essay marking with band feedback",
      "Data-response technique clinics",
      "University application guidance",
    ],
  },
  {
    slug: "a-level-accounting",
    title: "A Level Accounting",
    subject: "Accounting",
    subjectSlug: "accounting",
    level: "A Level",
    board: "Cambridge",
    code: "9706",
    duration: "12 months (AS + A2)",
    schedule: "Tue & Fri · 6:00 – 8:00 PM",
    fee: "PKR 14,000 / month",
    teacher: "Sana Iqbal",
    teacherSlug: "sana-iqbal",
    short: "Company accounts, cost accounting and decision-making with full-length paper practice.",
    description:
      "Advanced accounting for students continuing from O Level or joining fresh, with heavy emphasis on presentation marks and workings layout.",
    featured: false,
    syllabus: [
      "Financial accounting fundamentals",
      "Company and partnership accounts",
      "Cash flow statements",
      "Cost and management accounting",
      "Budgeting and standard costing",
      "Investment appraisal",
    ],
    requirements: ["Grade B or above in O Level Accounting, or a bridging module"],
    benefits: [
      "Full-length timed papers",
      "Working-layout templates",
      "One-to-one review sessions",
    ],
  },
  {
    slug: "a-level-business",
    title: "A Level Business",
    subject: "Business",
    subjectSlug: "business",
    level: "A Level",
    board: "Pearson Edexcel",
    code: "WBS11",
    duration: "12 months",
    schedule: "Wed & Sat · 3:00 – 5:00 PM",
    fee: "PKR 13,500 / month",
    teacher: "Hamza Raza",
    teacherSlug: "hamza-raza",
    short: "Edexcel IAL Business with quantitative skills and contextual application built in.",
    description:
      "Structured around the Edexcel International Advanced Level specification, combining theory, quantitative techniques and extended contextual writing.",
    featured: false,
    syllabus: [
      "Marketing and people",
      "Managing business activities",
      "Business decisions and strategy",
      "Global business",
      "Quantitative skills",
      "Synoptic case analysis",
    ],
    requirements: ["Good written English", "Basic numeracy for ratio work"],
    benefits: [
      "Contextual writing frameworks",
      "Quantitative skills booklet",
      "Pre-release case coaching",
    ],
  },
];

export type Teacher = {
  slug: string;
  name: string;
  designation: string;
  subjects: string[];
  qualification: string;
  experience: string;
  bio: string;
  initials: string;
};

export const teachers: Teacher[] = [
  {
    slug: "ayesha-khan",
    name: "Dr. Ayesha Khan",
    designation: "Head of Economics",
    subjects: ["Economics"],
    qualification: "PhD Economics, LUMS",
    experience: "16 years",
    initials: "AK",
    bio: "Leads the economics faculty and has examined at board level. Known for turning dense macro theory into clean, repeatable essay structures.",
  },
  {
    slug: "bilal-ahmed",
    name: "Bilal Ahmed",
    designation: "Senior Mathematics Faculty",
    subjects: ["Mathematics"],
    qualification: "MSc Mathematics, Punjab University",
    experience: "12 years",
    initials: "BA",
    bio: "Specialises in extended-tier IGCSE and A Level pure mathematics, with a method-first approach to problem solving under exam timing.",
  },
  {
    slug: "sana-iqbal",
    name: "Sana Iqbal",
    designation: "Head of Accounting",
    subjects: ["Accounting"],
    qualification: "ACCA, MBA Finance",
    experience: "14 years",
    initials: "SI",
    bio: "Chartered accountant turned educator. Builds precision in layout and workings, where most accounting marks are quietly won or lost.",
  },
  {
    slug: "usman-tariq",
    name: "Usman Tariq",
    designation: "Senior Physics Faculty",
    subjects: ["Physics"],
    qualification: "MPhil Physics, QAU",
    experience: "11 years",
    initials: "UT",
    bio: "Teaches physics through demonstration and derivation, with a dedicated practical-skills clinic before every paper 6 series.",
  },
  {
    slug: "hamza-raza",
    name: "Hamza Raza",
    designation: "Head of Business Studies",
    subjects: ["Business"],
    qualification: "MBA, IBA Karachi",
    experience: "10 years",
    initials: "HR",
    bio: "Former strategy consultant who teaches business through live cases, keeping every concept anchored to a real company decision.",
  },
  {
    slug: "maryam-siddiqui",
    name: "Maryam Siddiqui",
    designation: "Senior Chemistry Faculty",
    subjects: ["Chemistry"],
    qualification: "MSc Chemistry, GCU",
    experience: "9 years",
    initials: "MS",
    bio: "Organic mechanisms specialist. Runs the weekly reaction-map sessions that A Level students consistently rate highest.",
  },
  {
    slug: "faisal-mahmood",
    name: "Faisal Mahmood",
    designation: "Computer Science Faculty",
    subjects: ["Computer Science"],
    qualification: "BS Computer Science, FAST",
    experience: "8 years",
    initials: "FM",
    bio: "Bridges theory papers and practical programming, coaching students through pseudocode fluency and structured Python solutions.",
  },
  {
    slug: "nadia-hussain",
    name: "Nadia Hussain",
    designation: "Head of English",
    subjects: ["English"],
    qualification: "MA English Literature",
    experience: "13 years",
    initials: "NH",
    bio: "Marks every composition personally and teaches directed writing as a craft with clear, repeatable moves for each text type.",
  },
];

export const whyChooseUs = [
  {
    title: "Experienced Faculty",
    text: "Subject heads with a decade or more of board-level teaching behind them.",
  },
  {
    title: "Exam-Focused Preparation",
    text: "Every session maps back to syllabus objectives and mark-scheme language.",
  },
  {
    title: "Small Learning Groups",
    text: "Capped class sizes so no student sits at the back and disappears.",
  },
  {
    title: "Regular Assessments",
    text: "Weekly topicals and monthly graded mocks with written feedback.",
  },
  {
    title: "Past Paper Practice",
    text: "Curated topical and full-length papers from a decade of series.",
  },
  {
    title: "Personalised Guidance",
    text: "Individual improvement plans built from each student's error patterns.",
  },
  {
    title: "Result-Oriented Teaching",
    text: "Progress tracked against grade targets, not attendance sheets.",
  },
  {
    title: "Parent Communication",
    text: "Termly reports and direct access to the subject teacher.",
  },
];

export type Result = {
  student: string;
  subject: string;
  grade: string;
  level: string;
  board: string;
  year: number;
};

export const results: Result[] = [
  {
    student: "Demo Student A",
    subject: "Accounting",
    grade: "A*",
    level: "O Level",
    board: "Cambridge",
    year: 2026,
  },
  {
    student: "Demo Student B",
    subject: "Mathematics",
    grade: "A*",
    level: "IGCSE",
    board: "Cambridge",
    year: 2026,
  },
  {
    student: "Demo Student C",
    subject: "Economics",
    grade: "A",
    level: "A Level",
    board: "Cambridge",
    year: 2026,
  },
  {
    student: "Demo Student D",
    subject: "Physics",
    grade: "A",
    level: "IGCSE",
    board: "Cambridge",
    year: 2025,
  },
  {
    student: "Demo Student E",
    subject: "Business",
    grade: "A*",
    level: "A Level",
    board: "Pearson Edexcel",
    year: 2025,
  },
  {
    student: "Demo Student F",
    subject: "Chemistry",
    grade: "A",
    level: "A Level",
    board: "Cambridge",
    year: 2025,
  },
  {
    student: "Demo Student G",
    subject: "Computer Science",
    grade: "A*",
    level: "O Level",
    board: "Cambridge",
    year: 2024,
  },
  {
    student: "Demo Student H",
    subject: "English",
    grade: "A",
    level: "O Level",
    board: "Cambridge",
    year: 2024,
  },
  {
    student: "Demo Student I",
    subject: "Economics",
    grade: "A*",
    level: "O Level",
    board: "Cambridge",
    year: 2024,
  },
  {
    student: "Demo Student J",
    subject: "Biology",
    grade: "A",
    level: "IGCSE",
    board: "Pearson Edexcel",
    year: 2026,
  },
  {
    student: "Demo Student K",
    subject: "Business",
    grade: "A",
    level: "O Level",
    board: "Cambridge",
    year: 2026,
  },
  {
    student: "Demo Student L",
    subject: "Mathematics",
    grade: "A*",
    level: "A Level",
    board: "Cambridge",
    year: 2025,
  },
];

export type Achievement = {
  title: string;
  category: string;
  student?: string;
  year: number;
  description: string;
};

export const achievements: Achievement[] = [
  {
    title: "Top in Country — O Level Accounting (demo)",
    category: "Student Results",
    student: "Demo Student A",
    year: 2026,
    description:
      "Placeholder record illustrating how a country-level distinction would be published from the admin panel.",
  },
  {
    title: "Academic Excellence Award (demo)",
    category: "Academic Awards",
    student: "Demo Student C",
    year: 2025,
    description: "Sample award entry for a student recognised across all four A Level subjects.",
  },
  {
    title: "National Mathematics Olympiad — Finalist (demo)",
    category: "Competition Results",
    student: "Demo Student B",
    year: 2025,
    description: "Demonstration entry for competition results managed by faculty.",
  },
  {
    title: "Merit Scholarship Programme (demo)",
    category: "Scholarships",
    year: 2024,
    description: "Placeholder describing the institute's need- and merit-based scholarship awards.",
  },
  {
    title: "Fifth Campus Opened (demo)",
    category: "Institute Milestones",
    year: 2024,
    description: "Sample milestone entry showing how institute history is recorded.",
  },
  {
    title: "University Admissions Round (demo)",
    category: "University Admissions",
    year: 2026,
    description: "Placeholder summarising offers received by graduating students.",
  },
];

export const testimonials = [
  {
    name: "Demo Parent — Ms. R.",
    course: "O Level Accounting",
    level: "O Level",
    rating: 5,
    initials: "R",
    text: "The termly reports told us exactly where my son stood. He walked into the exam hall calm, which is not a sentence I expected to write.",
  },
  {
    name: "Demo Student — Ahmed",
    course: "IGCSE Mathematics",
    level: "IGCSE",
    rating: 5,
    initials: "A",
    text: "Papers 2 and 4 stopped feeling like a race. The mixed timed sets every fortnight are what actually changed my grade.",
  },
  {
    name: "Demo Student — Hina",
    course: "A Level Economics",
    level: "A Level",
    rating: 5,
    initials: "H",
    text: "Essay marking with band feedback was brutal at first and then extremely useful. I finally understood what evaluation means.",
  },
  {
    name: "Demo Parent — Mr. K.",
    course: "IGCSE Physics",
    level: "IGCSE",
    rating: 4,
    initials: "K",
    text: "Small groups made the difference. My daughter could ask questions without waiting for a class of forty to settle down.",
  },
];

export const timeline = [
  { year: "2011", text: "Founded as a single-room O Level Accounting tuition with nine students." },
  { year: "2015", text: "Expanded into the full O Level sciences and mathematics faculty." },
  { year: "2019", text: "A Level programme launched with dedicated AS and A2 streams." },
  { year: "2022", text: "IGCSE and Pearson Edexcel pathways added across core subjects." },
  {
    year: "2026",
    text: "Five campuses, fifty faculty members and a purpose-built assessment centre.",
  },
];

export const levels = ["O Level", "A Level", "IGCSE"] as const;
export const boards = ["Cambridge", "Pearson Edexcel", "Other"] as const;
