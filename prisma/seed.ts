import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load .env.local so ts-node can find DATABASE_URL
config({ path: '.env.local' });

const prisma = new PrismaClient();

// ── Hand-crafted core alumni profiles (20) ──

const coreAlumni = [
  {
    name: 'Sarah Chen',
    graduationYear: 2021,
    school: 'MIT - Massachusetts Institute of Technology',
    major: 'Computer Science',
    currentRole: 'Product Manager',
    currentCompany: 'ClimateTech Solutions',
    industry: 'Climate Tech',
    careerTimeline: [
      { title: 'Data Analyst', company: 'TechCorp', startYear: 2017, endYear: 2019 },
      { title: 'Graduate Student', company: 'MIT', startYear: 2019, endYear: 2021 },
      { title: 'Product Manager', company: 'ClimateTech Solutions', startYear: 2021, endYear: null },
    ],
    pivotType: 'data analyst → product manager',
    skills: ['Product Strategy', 'Data Analytics', 'SQL', 'Python', 'User Research'],
    visaHistory: ['F-1', 'H-1B'],
    geographicHistory: ['Boston', 'San Francisco'],
    openness: 'one_time_chat',
    topicsWilling: ['Career Pivot', 'Product Management', 'Visa Process', 'Climate Tech'],
    responseRate: 0.9,
    bio: 'Former data analyst who pivoted into product management at a climate tech startup. Passionate about using technology to solve environmental challenges.',
  },
  {
    name: 'Michael Rodriguez',
    graduationYear: 2020,
    school: 'MIT - Massachusetts Institute of Technology',
    major: 'Electrical Engineering',
    currentRole: 'Strategy Consultant',
    currentCompany: 'McKinsey & Company',
    industry: 'Consulting',
    careerTimeline: [
      { title: 'Software Engineer', company: 'Google', startYear: 2015, endYear: 2018 },
      { title: 'Graduate Student', company: 'MIT', startYear: 2018, endYear: 2020 },
      { title: 'Strategy Consultant', company: 'McKinsey & Company', startYear: 2020, endYear: null },
    ],
    pivotType: 'software engineer → strategy consultant',
    skills: ['Strategy', 'Problem Solving', 'Software Development', 'Leadership'],
    visaHistory: ['citizen'],
    geographicHistory: ['San Francisco', 'New York', 'Boston'],
    openness: 'ongoing_mentorship',
    topicsWilling: ['Career Pivot', 'Consulting', 'Tech to Consulting', 'Leadership'],
    responseRate: 0.85,
    bio: 'Transitioned from software engineering at Google to strategy consulting at McKinsey. Love helping others think through career transitions.',
  },
  {
    name: 'Priya Sharma',
    graduationYear: 2022,
    school: 'MIT - Massachusetts Institute of Technology',
    major: 'Economics',
    currentRole: 'Venture Capital Associate',
    currentCompany: 'Breakthrough Energy Ventures',
    industry: 'Climate Tech',
    careerTimeline: [
      { title: 'Financial Analyst', company: 'Goldman Sachs', startYear: 2017, endYear: 2020 },
      { title: 'Graduate Student', company: 'MIT', startYear: 2020, endYear: 2022 },
      { title: 'VC Associate', company: 'Breakthrough Energy Ventures', startYear: 2022, endYear: null },
    ],
    pivotType: 'financial analyst → venture capital',
    skills: ['Financial Modeling', 'Due Diligence', 'Clean Energy', 'Investment Analysis'],
    visaHistory: ['F-1', 'H-1B', 'Green Card'],
    geographicHistory: ['New York', 'Boston', 'San Francisco'],
    openness: 'short_term_advising',
    topicsWilling: ['Finance to VC', 'Climate Tech Investing', 'Visa Process', 'Networking'],
    responseRate: 0.75,
    bio: 'Moved from investment banking to climate tech venture capital. Navigated the full F-1 to Green Card journey.',
  },
  {
    name: 'David Kim',
    graduationYear: 2019,
    school: 'Harvard University',
    major: 'Data Science',
    currentRole: 'Senior Product Manager',
    currentCompany: 'Stripe',
    industry: 'Technology',
    careerTimeline: [
      { title: 'Data Scientist', company: 'Amazon', startYear: 2014, endYear: 2017 },
      { title: 'Graduate Student', company: 'Harvard University', startYear: 2017, endYear: 2019 },
      { title: 'Product Manager', company: 'Stripe', startYear: 2019, endYear: 2021 },
      { title: 'Senior Product Manager', company: 'Stripe', startYear: 2021, endYear: null },
    ],
    pivotType: 'data scientist → product manager',
    skills: ['Product Management', 'Machine Learning', 'Fintech', 'A/B Testing'],
    visaHistory: ['F-1', 'H-1B'],
    geographicHistory: ['Seattle', 'Boston', 'San Francisco'],
    openness: 'one_time_chat',
    topicsWilling: ['Data Science to PM', 'Fintech', 'Product Strategy', 'H-1B Process'],
    responseRate: 0.8,
    bio: 'Data scientist turned product manager at Stripe. Passionate about fintech and helping international students navigate tech careers.',
  },
  {
    name: 'Emily Washington',
    graduationYear: 2023,
    school: 'MIT - Massachusetts Institute of Technology',
    major: 'Mechanical Engineering',
    currentRole: 'Operations Manager',
    currentCompany: 'Tesla',
    industry: 'Climate Tech',
    careerTimeline: [
      { title: 'Industrial Engineer', company: 'Boeing', startYear: 2018, endYear: 2021 },
      { title: 'Graduate Student', company: 'MIT', startYear: 2021, endYear: 2023 },
      { title: 'Operations Manager', company: 'Tesla', startYear: 2023, endYear: null },
    ],
    pivotType: 'industrial engineer → operations manager',
    skills: ['Operations', 'Supply Chain', 'Manufacturing', 'Six Sigma'],
    visaHistory: ['citizen'],
    geographicHistory: ['Seattle', 'Boston', 'Austin'],
    openness: 'ongoing_mentorship',
    topicsWilling: ['Operations', 'Manufacturing', 'Career Transition', 'Women in Tech'],
    responseRate: 0.95,
    bio: 'Engineer turned operations leader at Tesla. Committed to mentoring the next generation of leaders.',
  },
  {
    name: 'James Liu',
    graduationYear: 2020,
    school: 'Stanford University',
    major: 'Computer Science',
    currentRole: 'Co-founder & CEO',
    currentCompany: 'GreenGrid AI',
    industry: 'Climate Tech',
    careerTimeline: [
      { title: 'Machine Learning Engineer', company: 'Meta', startYear: 2016, endYear: 2018 },
      { title: 'Graduate Student', company: 'Stanford University', startYear: 2018, endYear: 2020 },
      { title: 'Co-founder & CEO', company: 'GreenGrid AI', startYear: 2020, endYear: null },
    ],
    pivotType: 'machine learning engineer → startup founder',
    skills: ['Entrepreneurship', 'AI/ML', 'Fundraising', 'Team Building'],
    visaHistory: ['F-1', 'H-1B', 'Green Card'],
    geographicHistory: ['San Francisco', 'Palo Alto'],
    openness: 'one_time_chat',
    topicsWilling: ['Startups', 'AI', 'Entrepreneurship', 'Fundraising'],
    responseRate: 0.6,
    bio: 'Left Meta to build a climate tech AI startup. Stanford alum passionate about applying AI to sustainability.',
  },
  {
    name: 'Aisha Patel',
    graduationYear: 2021,
    school: 'MIT - Massachusetts Institute of Technology',
    major: 'Data Science',
    currentRole: 'Data Science Manager',
    currentCompany: 'Spotify',
    industry: 'Technology',
    careerTimeline: [
      { title: 'Research Analyst', company: 'IBM Research', startYear: 2017, endYear: 2019 },
      { title: 'Graduate Student', company: 'MIT', startYear: 2019, endYear: 2021 },
      { title: 'Data Scientist', company: 'Spotify', startYear: 2021, endYear: 2023 },
      { title: 'Data Science Manager', company: 'Spotify', startYear: 2023, endYear: null },
    ],
    pivotType: 'research analyst → data science manager',
    skills: ['Machine Learning', 'Python', 'R', 'Statistics', 'Team Leadership'],
    visaHistory: ['F-1', 'H-1B'],
    geographicHistory: ['Boston', 'New York'],
    openness: 'short_term_advising',
    topicsWilling: ['Data Science', 'Research to Industry', 'Management', 'H-1B Sponsorship'],
    responseRate: 0.85,
    bio: 'Transitioned from academic research to industry data science. Now managing a team at Spotify.',
  },
  {
    name: 'Carlos Martinez',
    graduationYear: 2022,
    school: 'University of Pennsylvania',
    major: 'Economics',
    currentRole: 'Investment Banking Associate',
    currentCompany: 'Morgan Stanley',
    industry: 'Finance',
    careerTimeline: [
      { title: 'Accountant', company: 'Deloitte', startYear: 2017, endYear: 2020 },
      { title: 'Graduate Student', company: 'UPenn', startYear: 2020, endYear: 2022 },
      { title: 'IB Associate', company: 'Morgan Stanley', startYear: 2022, endYear: null },
    ],
    pivotType: 'accountant → investment banker',
    skills: ['Financial Modeling', 'M&A', 'Valuation', 'Accounting'],
    visaHistory: ['citizen'],
    geographicHistory: ['Philadelphia', 'New York'],
    openness: 'one_time_chat',
    topicsWilling: ['Finance', 'Accounting to IB', 'MBA Applications', 'Wall Street'],
    responseRate: 0.7,
    bio: 'Made the leap from Big 4 accounting to investment banking. Happy to share insights on the transition.',
  },
  {
    name: 'Jennifer Wu',
    graduationYear: 2023,
    school: 'MIT - Massachusetts Institute of Technology',
    major: 'Business Administration',
    currentRole: 'Product Manager',
    currentCompany: 'Google',
    industry: 'Technology',
    careerTimeline: [
      { title: 'UX Designer', company: 'Adobe', startYear: 2018, endYear: 2021 },
      { title: 'Graduate Student', company: 'MIT', startYear: 2021, endYear: 2023 },
      { title: 'Product Manager', company: 'Google', startYear: 2023, endYear: null },
    ],
    pivotType: 'UX designer → product manager',
    skills: ['Product Management', 'UX Design', 'User Research', 'Prototyping'],
    visaHistory: ['F-1', 'H-1B'],
    geographicHistory: ['San Francisco', 'Boston', 'Seattle'],
    openness: 'short_term_advising',
    topicsWilling: ['Design to PM', 'Big Tech', 'International Students', 'UX Research'],
    responseRate: 0.88,
    bio: 'UX designer turned product manager at Google. Navigated the F-1 to H-1B transition during MBA.',
  },
  {
    name: 'Robert Thompson',
    graduationYear: 2018,
    school: 'Harvard University',
    major: 'Business Administration',
    currentRole: 'VP of Strategy',
    currentCompany: 'Salesforce',
    industry: 'Technology',
    careerTimeline: [
      { title: 'Management Consultant', company: 'Bain & Company', startYear: 2013, endYear: 2016 },
      { title: 'Graduate Student', company: 'Harvard University', startYear: 2016, endYear: 2018 },
      { title: 'Strategy Manager', company: 'Salesforce', startYear: 2018, endYear: 2021 },
      { title: 'VP of Strategy', company: 'Salesforce', startYear: 2021, endYear: null },
    ],
    pivotType: 'management consultant → tech strategy',
    skills: ['Corporate Strategy', 'Go-to-Market', 'SaaS', 'Leadership'],
    visaHistory: ['citizen'],
    geographicHistory: ['Boston', 'San Francisco'],
    openness: 'ongoing_mentorship',
    topicsWilling: ['Consulting to Tech', 'Strategy Roles', 'Leadership', 'Career Growth'],
    responseRate: 0.92,
    bio: 'Former Bain consultant now leading strategy at Salesforce. Enjoy helping MBA students navigate post-consulting careers.',
  },
  {
    name: 'Yuki Tanaka',
    graduationYear: 2022,
    school: 'MIT - Massachusetts Institute of Technology',
    major: 'Biomedical Engineering',
    currentRole: 'Sustainability Consultant',
    currentCompany: 'Boston Consulting Group',
    industry: 'Consulting',
    careerTimeline: [
      { title: 'Environmental Engineer', company: 'AECOM', startYear: 2017, endYear: 2020 },
      { title: 'Graduate Student', company: 'MIT', startYear: 2020, endYear: 2022 },
      { title: 'Sustainability Consultant', company: 'BCG', startYear: 2022, endYear: null },
    ],
    pivotType: 'environmental engineer → sustainability consultant',
    skills: ['Sustainability', 'Environmental Science', 'Strategy', 'ESG'],
    visaHistory: ['F-1', 'H-1B'],
    geographicHistory: ['Boston', 'New York', 'Tokyo'],
    openness: 'short_term_advising',
    topicsWilling: ['Sustainability', 'Engineering to Consulting', 'ESG', 'International Career'],
    responseRate: 0.8,
    bio: 'Environmental engineer turned sustainability consultant at BCG. Bridging technical and business perspectives.',
  },
  {
    name: 'Maria Garcia',
    graduationYear: 2021,
    school: 'Stanford University',
    major: 'Applied Mathematics',
    currentRole: 'Head of Social Impact',
    currentCompany: 'Patagonia',
    industry: 'Social Impact',
    careerTimeline: [
      { title: 'Program Manager', company: 'UNICEF', startYear: 2015, endYear: 2019 },
      { title: 'Graduate Student', company: 'Stanford University', startYear: 2019, endYear: 2021 },
      { title: 'Head of Social Impact', company: 'Patagonia', startYear: 2021, endYear: null },
    ],
    pivotType: 'nonprofit → corporate social impact',
    skills: ['Social Impact', 'Program Management', 'Stakeholder Engagement', 'Sustainability'],
    visaHistory: ['citizen'],
    geographicHistory: ['New York', 'San Francisco', 'Ventura'],
    openness: 'ongoing_mentorship',
    topicsWilling: ['Social Impact', 'Nonprofit to Corporate', 'Purpose-Driven Career', 'Sustainability'],
    responseRate: 0.93,
    bio: 'Transitioned from international development at UNICEF to corporate social impact at Patagonia.',
  },
  {
    name: 'Wei Zhang',
    graduationYear: 2020,
    school: 'MIT - Massachusetts Institute of Technology',
    major: 'Business Administration',
    currentRole: 'AI Product Lead',
    currentCompany: 'Microsoft',
    industry: 'Technology',
    careerTimeline: [
      { title: 'Data Analyst', company: 'ByteDance', startYear: 2015, endYear: 2018 },
      { title: 'Graduate Student', company: 'MIT', startYear: 2018, endYear: 2020 },
      { title: 'Product Manager', company: 'Microsoft', startYear: 2020, endYear: 2022 },
      { title: 'AI Product Lead', company: 'Microsoft', startYear: 2022, endYear: null },
    ],
    pivotType: 'data analyst → product manager',
    skills: ['AI/ML Products', 'Data Analytics', 'Product Strategy', 'Cross-functional Leadership'],
    visaHistory: ['F-1', 'H-1B'],
    geographicHistory: ['Beijing', 'Boston', 'Seattle'],
    openness: 'one_time_chat',
    topicsWilling: ['Data to PM', 'AI Products', 'International Students', 'H-1B Process'],
    responseRate: 0.78,
    bio: 'Data analyst from ByteDance who pivoted to AI product management at Microsoft. Fellow F-1 visa holder who understands the journey.',
  },
  {
    name: 'Olivia Brown',
    graduationYear: 2023,
    school: 'Harvard University',
    major: 'Biomedical Engineering',
    currentRole: 'Healthcare Strategy Manager',
    currentCompany: 'Optum',
    industry: 'Healthcare',
    careerTimeline: [
      { title: 'Registered Nurse', company: 'Mass General Hospital', startYear: 2016, endYear: 2021 },
      { title: 'Graduate Student', company: 'Harvard University', startYear: 2021, endYear: 2023 },
      { title: 'Healthcare Strategy Manager', company: 'Optum', startYear: 2023, endYear: null },
    ],
    pivotType: 'nurse → healthcare strategy',
    skills: ['Healthcare Operations', 'Clinical Knowledge', 'Strategy', 'Change Management'],
    visaHistory: ['citizen'],
    geographicHistory: ['Boston', 'Minneapolis'],
    openness: 'ongoing_mentorship',
    topicsWilling: ['Healthcare', 'Clinical to Business', 'Career Pivot', 'MBA for Non-Business Backgrounds'],
    responseRate: 0.95,
    bio: 'Nurse turned healthcare strategist. Proving that clinical experience is a superpower in business.',
  },
  {
    name: 'Ahmed Hassan',
    graduationYear: 2021,
    school: 'University of Pennsylvania',
    major: 'Business Administration',
    currentRole: 'Private Equity Associate',
    currentCompany: 'KKR',
    industry: 'Finance',
    careerTimeline: [
      { title: 'Management Consultant', company: 'Bain & Company', startYear: 2016, endYear: 2019 },
      { title: 'Graduate Student', company: 'UPenn', startYear: 2019, endYear: 2021 },
      { title: 'PE Associate', company: 'KKR', startYear: 2021, endYear: null },
    ],
    pivotType: 'management consultant → private equity',
    skills: ['Private Equity', 'LBO Modeling', 'Due Diligence', 'Strategy'],
    visaHistory: ['F-1', 'Green Card'],
    geographicHistory: ['Philadelphia', 'New York'],
    openness: 'one_time_chat',
    topicsWilling: ['Consulting to PE', 'Finance', 'International Students', 'Career Planning'],
    responseRate: 0.65,
    bio: 'Bain consultant turned PE investor at KKR. Understanding both the operational and financial sides.',
  },
  {
    name: 'Lisa Park',
    graduationYear: 2022,
    school: 'MIT - Massachusetts Institute of Technology',
    major: 'Business Administration',
    currentRole: 'Marketing Director',
    currentCompany: 'HubSpot',
    industry: 'Technology',
    careerTimeline: [
      { title: 'Brand Manager', company: 'Procter & Gamble', startYear: 2017, endYear: 2020 },
      { title: 'Graduate Student', company: 'MIT', startYear: 2020, endYear: 2022 },
      { title: 'Marketing Director', company: 'HubSpot', startYear: 2022, endYear: null },
    ],
    pivotType: 'brand manager → tech marketing',
    skills: ['Brand Strategy', 'Digital Marketing', 'Go-to-Market', 'Content Strategy'],
    visaHistory: ['citizen'],
    geographicHistory: ['Cincinnati', 'Boston'],
    openness: 'short_term_advising',
    topicsWilling: ['CPG to Tech', 'Marketing', 'Brand Strategy', 'Career Transitions'],
    responseRate: 0.82,
    bio: 'Moved from CPG brand management at P&G to tech marketing at HubSpot. Different worlds, transferable skills.',
  },
  {
    name: 'Raj Krishnamurthy',
    graduationYear: 2019,
    school: 'MIT - Massachusetts Institute of Technology',
    major: 'Computer Science',
    currentRole: 'Engineering Manager',
    currentCompany: 'Airbnb',
    industry: 'Technology',
    careerTimeline: [
      { title: 'Software Engineer', company: 'Infosys', startYear: 2014, endYear: 2017 },
      { title: 'Graduate Student', company: 'MIT', startYear: 2017, endYear: 2019 },
      { title: 'Senior Engineer', company: 'Airbnb', startYear: 2019, endYear: 2022 },
      { title: 'Engineering Manager', company: 'Airbnb', startYear: 2022, endYear: null },
    ],
    pivotType: 'software engineer → engineering manager',
    skills: ['Engineering Leadership', 'System Design', 'Python', 'Distributed Systems'],
    visaHistory: ['F-1', 'H-1B'],
    geographicHistory: ['Bangalore', 'Boston', 'San Francisco'],
    openness: 'ongoing_mentorship',
    topicsWilling: ['IC to Manager', 'H-1B', 'Tech Career Growth', 'International Students'],
    responseRate: 0.88,
    bio: 'Grew from engineer to engineering manager at Airbnb. Navigated the F-1 to H-1B path and happy to help others.',
  },
  {
    name: 'Sophie Laurent',
    graduationYear: 2023,
    school: 'Stanford University',
    major: 'Computer Science',
    currentRole: 'Product Strategy Lead',
    currentCompany: 'OpenAI',
    industry: 'Technology',
    careerTimeline: [
      { title: 'Research Scientist', company: 'DeepMind', startYear: 2018, endYear: 2021 },
      { title: 'Graduate Student', company: 'Stanford University', startYear: 2021, endYear: 2023 },
      { title: 'Product Strategy Lead', company: 'OpenAI', startYear: 2023, endYear: null },
    ],
    pivotType: 'research scientist → product strategy',
    skills: ['AI Strategy', 'Research', 'Product Strategy', 'Go-to-Market'],
    visaHistory: ['F-1', 'H-1B'],
    geographicHistory: ['London', 'Palo Alto', 'San Francisco'],
    openness: 'one_time_chat',
    topicsWilling: ['AI Industry', 'Research to Business', 'Product Strategy', 'Tech Career'],
    responseRate: 0.72,
    bio: 'Research scientist from DeepMind turned product strategist at OpenAI. Bridging cutting-edge research and business.',
  },
  {
    name: 'Daniel Okafor',
    graduationYear: 2021,
    school: 'Harvard University',
    major: 'Economics',
    currentRole: 'Impact Investing Director',
    currentCompany: 'Acumen',
    industry: 'Social Impact',
    careerTimeline: [
      { title: 'Civil Engineer', company: 'ARUP', startYear: 2015, endYear: 2019 },
      { title: 'Graduate Student', company: 'Harvard University', startYear: 2019, endYear: 2021 },
      { title: 'Impact Investing Director', company: 'Acumen', startYear: 2021, endYear: null },
    ],
    pivotType: 'civil engineer → impact investing',
    skills: ['Impact Investing', 'Infrastructure', 'Social Enterprise', 'Due Diligence'],
    visaHistory: ['F-1', 'Green Card'],
    geographicHistory: ['Lagos', 'Boston', 'New York'],
    openness: 'short_term_advising',
    topicsWilling: ['Impact Investing', 'Engineering to Finance', 'Social Enterprise', 'International Career'],
    responseRate: 0.85,
    bio: 'From building physical infrastructure to investing in social infrastructure. Passionate about connecting profit with purpose.',
  },
  {
    name: 'Hannah Lee',
    graduationYear: 2024,
    school: 'MIT - Massachusetts Institute of Technology',
    major: 'Business Administration',
    currentRole: 'Nonprofit Director',
    currentCompany: 'Teach For America',
    industry: 'Nonprofit',
    careerTimeline: [
      { title: 'Teacher', company: 'NYC Public Schools', startYear: 2018, endYear: 2022 },
      { title: 'Graduate Student', company: 'MIT', startYear: 2022, endYear: 2024 },
      { title: 'Regional Director', company: 'Teach For America', startYear: 2024, endYear: null },
    ],
    pivotType: 'teacher → nonprofit leadership',
    skills: ['Education', 'Leadership', 'Program Management', 'Community Building'],
    visaHistory: ['citizen'],
    geographicHistory: ['New York', 'Boston', 'Chicago'],
    openness: 'ongoing_mentorship',
    topicsWilling: ['Education', 'Nonprofit', 'Social Sector MBA', 'Career Pivot'],
    responseRate: 0.96,
    bio: 'Former NYC teacher now leading at Teach For America. Believe in the power of education and mentorship.',
  },
];

// ── Generated alumni profiles (50) ──

const firstNames = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery',
  'Cameron', 'Dakota', 'Reese', 'Finley', 'Hayden', 'Sage', 'Rowan',
  'Phoenix', 'Eden', 'Harper', 'Kendall', 'Emery', 'Skyler', 'Drew',
  'Blair', 'Jamie', 'Pat', 'Noor', 'Avi', 'Yael', 'Remy', 'Jules',
  'Ariel', 'Shay', 'Tatum', 'Lane', 'Brooks', 'Ellis', 'Kai', 'Wren',
  'Sage', 'Blake', 'Ashton', 'Logan', 'Peyton', 'Jesse', 'Robin', 'Charlie',
  'Sam', 'Frankie', 'Hayley', 'Sasha',
];

const lastNames = [
  'Anderson', 'Baker', 'Clark', 'Davis', 'Evans', 'Foster', 'Grant', 'Hayes',
  'Irving', 'Jackson', 'Keller', 'Lambert', 'Mitchell', 'Nelson', 'Owen',
  'Palmer', 'Quinn', 'Reed', 'Stone', 'Turner', 'Underwood', 'Vaughn',
  'Wallace', 'Xu', 'Young', 'Zhou', 'Nguyen', 'Singh', 'Ali', 'Costa',
  'Müller', 'Suzuki', 'Petrov', 'Johansson', 'Schmidt', 'Russo', 'Kowalski',
  'Chen', 'Wang', 'Park', 'Sato', 'Kumar', 'Das', 'Ahmed', 'Lam',
  'Tran', 'Pham', 'Yoo', 'Choi', 'Nakamura',
];

const schools = [
  'MIT - Massachusetts Institute of Technology', 'MIT - Massachusetts Institute of Technology', 'MIT - Massachusetts Institute of Technology',
  'Harvard University', 'Harvard University',
  'Stanford University', 'Stanford University',
  'New York University',
  'University of Pennsylvania',
];
const majors = [
  'Computer Science', 'Computer Science',
  'Business Administration', 'Business Administration',
  'Data Science',
  'Electrical Engineering',
  'Economics',
  'Mechanical Engineering',
  'Applied Mathematics',
  'Biomedical Engineering',
];
const industries = ['Technology', 'Consulting', 'Finance', 'Climate Tech', 'Healthcare', 'Nonprofit', 'Social Impact'];
const companies: Record<string, string[]> = {
  'Technology': ['Google', 'Apple', 'Microsoft', 'Meta', 'Amazon', 'Netflix', 'Uber', 'Lyft', 'Snap', 'Pinterest'],
  'Consulting': ['McKinsey', 'BCG', 'Bain', 'Deloitte', 'Accenture', 'EY-Parthenon', 'Kearney', 'Oliver Wyman'],
  'Finance': ['Goldman Sachs', 'JPMorgan', 'Morgan Stanley', 'Citadel', 'Blackstone', 'Bridgewater'],
  'Climate Tech': ['Tesla', 'Rivian', 'Sunrun', 'ChargePoint', 'Bloom Energy', 'Carbon Clean'],
  'Healthcare': ['Optum', 'CVS Health', 'Pfizer', 'Johnson & Johnson', 'Medtronic', 'Genentech'],
  'Nonprofit': ['Gates Foundation', 'Red Cross', 'Teach For America', 'World Wildlife Fund'],
  'Social Impact': ['Patagonia', 'TOMS', 'Warby Parker', 'Acumen', 'Kiva'],
};
const roles: Record<string, string[]> = {
  'Technology': ['Product Manager', 'Software Engineer', 'Data Scientist', 'Engineering Manager', 'UX Lead'],
  'Consulting': ['Consultant', 'Senior Consultant', 'Manager', 'Principal', 'Strategy Analyst'],
  'Finance': ['Analyst', 'Associate', 'VP', 'Portfolio Manager', 'Trader'],
  'Climate Tech': ['Sustainability Manager', 'Product Manager', 'Operations Lead', 'Research Scientist'],
  'Healthcare': ['Strategy Manager', 'Product Manager', 'Clinical Operations Lead', 'Data Analyst'],
  'Nonprofit': ['Program Director', 'Development Manager', 'Policy Analyst', 'Operations Lead'],
  'Social Impact': ['Impact Manager', 'Program Lead', 'Strategy Director', 'Community Manager'],
};
const pivotTypes = [
  'data analyst → product manager', 'software engineer → product manager',
  'consultant → product manager', 'engineer → strategy consultant',
  'analyst → venture capital', 'researcher → data scientist',
  'finance → tech', 'academia → industry', 'military → tech',
  'teacher → product manager', 'nurse → healthcare strategy',
  'journalist → marketing', 'lawyer → tech policy',
];
const opennesses = ['one_time_chat', 'short_term_advising', 'ongoing_mentorship'];
const visaPaths = [
  ['F-1', 'H-1B'], ['F-1', 'H-1B', 'Green Card'], ['citizen'],
  ['H-1B'], ['F-1', 'OPT'], ['Green Card'], ['citizen'],
];
const geos = ['Boston', 'San Francisco', 'New York', 'Seattle', 'Austin', 'Chicago', 'Los Angeles', 'Washington DC'];
const skillSets = [
  ['Product Strategy', 'Data Analytics', 'SQL', 'Python'],
  ['Strategy', 'Problem Solving', 'Leadership', 'Communication'],
  ['Financial Modeling', 'Excel', 'Valuation', 'Due Diligence'],
  ['Machine Learning', 'Python', 'TensorFlow', 'Statistics'],
  ['Marketing', 'Brand Strategy', 'Digital Marketing', 'Content'],
  ['Operations', 'Supply Chain', 'Process Improvement', 'Six Sigma'],
  ['Sustainability', 'ESG', 'Climate Policy', 'Stakeholder Engagement'],
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateAlumni(index: number) {
  const rand = seededRandom(index + 42);
  const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const pickN = <T>(arr: T[], n: number): T[] => {
    const shuffled = [...arr].sort(() => rand() - 0.5);
    return shuffled.slice(0, n);
  };

  const industry = pick(industries);
  const companyList = companies[industry] || companies['Technology'];
  const roleList = roles[industry] || roles['Technology'];
  const gradYear = 2016 + Math.floor(rand() * 9); // 2016-2024
  const geoHistory = pickN(geos, 1 + Math.floor(rand() * 3));

  return {
    name: `${firstNames[index % firstNames.length]} ${lastNames[index % lastNames.length]}`,
    graduationYear: gradYear,
    school: pick(schools),
    major: pick(majors),
    currentRole: pick(roleList),
    currentCompany: pick(companyList),
    industry,
    careerTimeline: [
      { title: pick(['Analyst', 'Engineer', 'Associate', 'Researcher', 'Coordinator']), company: pick(companyList), startYear: gradYear - 4, endYear: gradYear - 2 },
      { title: 'Graduate Student', company: pick(schools), startYear: gradYear - 2, endYear: gradYear },
      { title: pick(roleList), company: pick(companyList), startYear: gradYear, endYear: null },
    ],
    pivotType: pick(pivotTypes),
    skills: pick(skillSets),
    visaHistory: pick(visaPaths),
    geographicHistory: geoHistory,
    openness: pick(opennesses),
    topicsWilling: pickN(['Career Pivot', 'Networking', 'Leadership', 'Industry Insights', 'Visa Process', 'MBA Advice', 'Technical Skills', 'Startups'], 3),
    responseRate: 0.5 + rand() * 0.5,
    lastActive: new Date(Date.now() - Math.floor(rand() * 90 * 24 * 60 * 60 * 1000)),
    bio: `Experienced professional in ${industry.toLowerCase()} with a passion for mentoring the next generation.`,
  };
}

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.connection.deleteMany();
  await prisma.matchResult.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.alumniProfile.deleteMany();

  // Seed core alumni
  await prisma.alumniProfile.createMany({ data: coreAlumni });
  console.log(`Created ${coreAlumni.length} core alumni profiles`);

  // Seed generated alumni
  const generatedAlumni = Array.from({ length: 50 }, (_, i) => generateAlumni(i));
  await prisma.alumniProfile.createMany({ data: generatedAlumni });
  console.log('Created 50 generated alumni profiles');

  // Seed default student (Liang Chen persona)
  await prisma.studentProfile.create({
    data: {
      id: 'demo-student',
      name: 'Liang Chen',
      school: 'MIT - Massachusetts Institute of Technology',
      major: 'Computer Science',
      graduationYear: 2026,
      priorRoles: [
        { title: 'Data Analyst', company: 'TechCorp', industry: 'Technology', years: 4 },
      ],
      visaStatus: 'F-1',
      industries: ['Climate Tech', 'Technology'],
      roleInterests: ['Product Manager', 'Strategy'],
      pivotDirection: 'Transition from data analytics to product management in climate tech',
      geographicPrefs: ['San Francisco', 'New York', 'Boston'],
      mentorPreferences: 'Someone who has navigated a similar career pivot and visa process',
    },
  });
  console.log('Created default student profile (Liang Chen)');

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
