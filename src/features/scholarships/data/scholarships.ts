export interface ScholarshipDetail {
  id: string;
  title: string;
  organization: string;
  amount: number;
  deadline: string;
  category: 'Merit' | 'Need Based' | 'Minority' | 'Sports' | 'Research' | 'Other';
  educationLevel: 'school' | 'college' | 'other' | 'all';
  boardTarget?: 'State Board' | 'Central Board' | 'All Boards';
  region: string;
  description: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  tags: string[];
  factVersion: string;
}

export const SCHOLARSHIPS_DATA: ScholarshipDetail[] = [
  {
    id: 'sch-tn-001',
    title: 'Moovalur Ramamirtham Ammaiyar Higher Education Scheme (Pudhumai Penn)',
    organization: 'Department of Social Welfare, Govt of Tamil Nadu',
    amount: 12000,
    deadline: '2026-12-15',
    category: 'Merit',
    educationLevel: 'college',
    boardTarget: 'State Board',
    region: 'Tamil Nadu',
    description: 'Special monthly financial assistance for female State Board school students pursuing undergraduate degree/diploma courses in Tamil Nadu colleges.',
    eligibilityCriteria: [
      'Studied in Tamil Nadu State Board Government Schools from Class 6 to 12',
      'Enrolled in full-time College Degree (B.Tech, B.Sc, B.A, MBBS, Diploma)',
      'Aadhaar verification required',
    ],
    requiredDocuments: [
      'State Board Transfer Certificate',
      'Aadhaar Card Copy',
      'College Admission Fee Receipt',
      '10th & 12th State Board Marksheets',
    ],
    tags: ['Tamil Nadu', 'State Board', 'College', 'Women Empowerment'],
    factVersion: 'v3.2.0',
  },
  {
    id: 'sch-tn-002',
    title: 'Tamil Nadu Chief Minister STEM Fellowship for College Engineers',
    organization: 'Tamil Nadu State Council for Higher Education (TANSCHE)',
    amount: 50000,
    deadline: '2026-11-20',
    category: 'Research',
    educationLevel: 'college',
    boardTarget: 'All Boards',
    region: 'Tamil Nadu',
    description: 'Prestigious fellowship for engineering and science college students pursuing AI, Robotics, Data Science, and Green Technology degrees in Tamil Nadu.',
    eligibilityCriteria: [
      'Enrolled in 2nd, 3rd, or 4th Year College B.E/B.Tech/M.Sc',
      'CGPA 8.0 or above / 80%+ in 12th',
      'Project proposal in advanced technology domain',
    ],
    requiredDocuments: [
      'College Bonafide Certificate',
      'Semester Mark Statements',
      'Research Proposal Abstract',
    ],
    tags: ['Engineering', 'College', 'Research', 'STEM'],
    factVersion: 'v2.1.0',
  },
  {
    id: 'sch-001',
    title: 'Central Sector Scheme for University & College Students',
    organization: 'Ministry of Education, Govt of India',
    amount: 20000,
    deadline: '2026-11-30',
    category: 'Merit',
    educationLevel: 'college',
    boardTarget: 'Central Board',
    region: 'All India',
    description: 'Merit-cum-means scholarship for top percentile Class 12 CBSE / ICSE / Central Board students admitted into recognized colleges and universities.',
    eligibilityCriteria: [
      'Above 80th percentile in Class 12 Central / State Board exams',
      'Enrolled in regular College Degree (B.Tech, B.Com, B.Sc, BBA)',
      'Annual family income below ₹4.5 Lakhs',
    ],
    requiredDocuments: [
      '12th Central Board Marksheet',
      'Income Certificate',
      'Aadhaar Linked Bank Account Details',
    ],
    tags: ['Central Board', 'CBSE', 'College Merit', 'Government of India'],
    factVersion: 'v2.4.1',
  },
  {
    id: 'sch-002',
    title: 'State Board Merit Scholarship for High School Seniors',
    organization: 'Directorate of School Education, Tamil Nadu',
    amount: 10000,
    deadline: '2026-10-25',
    category: 'Merit',
    educationLevel: 'school',
    boardTarget: 'State Board',
    region: 'Tamil Nadu',
    description: 'Awarded to high-performing 10th and 12th State Board students securing top district marks across Tamil Nadu.',
    eligibilityCriteria: [
      'Enrolled in Tamil Nadu State Board High School',
      'Minimum 85% in 10th Public Examinations',
    ],
    requiredDocuments: [
      '10th State Board Marksheet',
      'School ID Card',
      'Aadhaar Card',
    ],
    tags: ['State Board', 'School', 'Tamil Nadu', 'Merit'],
    factVersion: 'v1.8.0',
  },
  {
    id: 'sch-003',
    title: 'Post-Matric College Diversity & Inclusion Scholarship',
    organization: 'Universal Educational Scholars Trust',
    amount: 15000,
    deadline: '2026-12-10',
    category: 'Need Based',
    educationLevel: 'all',
    boardTarget: 'All Boards',
    region: 'All India',
    description: 'Need-based financial assistance for economically weaker section students attending professional college courses.',
    eligibilityCriteria: [
      'Open to State Board and Central Board College Students',
      'Annual family income below ₹2.5 Lakhs',
    ],
    requiredDocuments: [
      'Income Tax / Tehsildar Income Certificate',
      'College Fee Receipt',
      'Aadhaar Identification',
    ],
    tags: ['Need-Based', 'College', 'Financial Aid'],
    factVersion: 'v3.1.0',
  },
  {
    id: 'sch-004',
    title: 'Women in AI & Robotics Fellowship for College Scholars',
    organization: 'Frontier Tech Diversity Alliance',
    amount: 25000,
    deadline: '2026-11-05',
    category: 'Minority',
    educationLevel: 'college',
    boardTarget: 'All Boards',
    region: 'Global',
    description: 'Empowering female college students in Computer Science, AI, Robotics, and Mechanical Engineering degrees.',
    eligibilityCriteria: [
      'Female college student in accredited B.Tech / M.Tech / B.Sc degree',
      'Passionate about technology and innovation',
    ],
    requiredDocuments: [
      'College Identity Proof',
      'Statement of Purpose (SOP)',
      'GitHub / Portfolio link',
    ],
    tags: ['Women in Tech', 'College', 'AI', 'Fellowship'],
    factVersion: 'v4.0.2',
  },
];
