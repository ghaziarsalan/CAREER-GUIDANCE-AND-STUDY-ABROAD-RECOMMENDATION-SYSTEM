/* =====================================================
   CareerGuide — models/logic.js
   RIASEC scoring + career/country rules
   + Career detail data for modal
   ===================================================== */

/* ─────────────────────────────────────────────────────
   1. QUESTION DEFINITIONS
───────────────────────────────────────────────────── */
const questions = {
  interest: [
    { id: 'i0', cats: { R: 1 } },
    { id: 'i1', cats: { I: 1 } },
    { id: 'i2', cats: { A: 1 } },
    { id: 'i3', cats: { S: 1 } },
    { id: 'i4', cats: { E: 1 } },
    { id: 'i5', cats: { C: 1 } },
  ],
  skills: [
    { id: 's0', cats: { R: 0.5, I: 0.5 } },
    { id: 's1', cats: { E: 0.5, S: 0.5 } },
    { id: 's2', cats: { A: 1 } },
    { id: 's3', cats: { C: 1 } },
    { id: 's4', cats: { I: 0.5, R: 0.5 } },
  ]
};

/* ─────────────────────────────────────────────────────
   2. RIASEC NAMES
───────────────────────────────────────────────────── */
const riasecNames = {
  R: 'Realistic', I: 'Investigative', A: 'Artistic',
  S: 'Social',    E: 'Enterprising',  C: 'Conventional'
};

/* ─────────────────────────────────────────────────────
   3. COMPUTE RIASEC SCORES
───────────────────────────────────────────────────── */
function computeScores(answers) {
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const process = (arr, prefix) => {
    arr.forEach((q, idx) => {
      const val = parseInt(answers[`${prefix}_${idx}`]) || 0;
      Object.entries(q.cats).forEach(([cat, w]) => { scores[cat] += val * w; });
    });
  };
  process(questions.interest, 'interest');
  process(questions.skills,   'skills');
  return scores;
}

/* ─────────────────────────────────────────────────────
   4. CAREER RECOMMENDATION MAP
───────────────────────────────────────────────────── */
const careerMap = {
  'R+I': [
    { title: 'Software Engineering',       emoji: '💻' },
    { title: 'Data Science',               emoji: '📊' },
    { title: 'Electronics Engineering',    emoji: '⚡' },
    { title: 'Mechanical Engineering',     emoji: '⚙️' },
    { title: 'Civil Engineering',          emoji: '🏗️' },
  ],
  'R+A': [
    { title: 'Architecture',              emoji: '🏛️' },
    { title: 'Industrial Design',         emoji: '🎨' },
    { title: 'Product Design',            emoji: '✏️' },
    { title: 'Game Development',          emoji: '🎮' },
    { title: 'UX/UI Design',              emoji: '🖥️' },
  ],
  'R+C': [
    { title: 'Accounting & Finance',      emoji: '💰' },
    { title: 'Operations Management',     emoji: '📋' },
    { title: 'Supply Chain',              emoji: '🔗' },
    { title: 'Logistics',                 emoji: '🚚' },
  ],
  'I+A': [
    { title: 'Biomedical Research',       emoji: '🔬' },
    { title: 'Data Visualisation',        emoji: '📈' },
    { title: 'AI/ML Research',            emoji: '🤖' },
    { title: 'Scientific Writing',        emoji: '📝' },
  ],
  'I+S': [
    { title: 'Medicine & Healthcare',     emoji: '🩺' },
    { title: 'Psychology',                emoji: '🧠' },
    { title: 'Research & Academia',       emoji: '🎓' },
    { title: 'Public Health',             emoji: '🏥' },
  ],
  'I+E': [
    { title: 'Tech Entrepreneurship',     emoji: '🚀' },
    { title: 'Product Management',        emoji: '📱' },
    { title: 'Business Analytics',        emoji: '📉' },
    { title: 'Consulting',                emoji: '💼' },
  ],
  'A+S': [
    { title: 'Teaching & Education',      emoji: '👩‍🏫' },
    { title: 'Social Work',               emoji: '🤝' },
    { title: 'Graphic Design',            emoji: '🖌️' },
    { title: 'Media & Communication',     emoji: '📡' },
  ],
  'A+E': [
    { title: 'Marketing & Advertising',   emoji: '📢' },
    { title: 'Brand Management',          emoji: '🏷️' },
    { title: 'Creative Direction',        emoji: '🎬' },
    { title: 'Journalism',                emoji: '📰' },
    { title: 'Fashion Design',            emoji: '👗' },
  ],
  'S+E': [
    { title: 'Healthcare Management',     emoji: '🏨' },
    { title: 'HR Management',             emoji: '👥' },
    { title: 'Non-profit Leadership',     emoji: '🌍' },
    { title: 'Political Science',         emoji: '🏛' },
  ],
  'S+C': [
    { title: 'Teaching',                  emoji: '📚' },
    { title: 'Administration',            emoji: '🗂️' },
    { title: 'Social Services',           emoji: '❤️' },
    { title: 'Library Sciences',          emoji: '📖' },
  ],
  'E+C': [
    { title: 'Business Management',       emoji: '🏢' },
    { title: 'Finance & Banking',         emoji: '🏦' },
    { title: 'Law',                       emoji: '⚖️' },
    { title: 'Accounting',                emoji: '📋' },
    { title: 'Real Estate',               emoji: '🏠' },
  ],
  'E+R': [
    { title: 'Construction Management',   emoji: '🏚️' },
    { title: 'Environmental Engineering', emoji: '🌱' },
    { title: 'Civil Engineering',         emoji: '🏗️' },
  ],
};

const defaultCareers = [
  { title: 'Business Management',  emoji: '🏢' },
  { title: 'Data Analytics',       emoji: '📊' },
  { title: 'Project Management',   emoji: '📋' },
  { title: 'Consulting',           emoji: '💼' },
  { title: 'Education',            emoji: '🎓' },
];

function getCareerRecommendations(type1, type2) {
  const key1 = `${type1}+${type2}`;
  const key2 = `${type2}+${type1}`;
  return careerMap[key1] || careerMap[key2] || defaultCareers;
}

/* ─────────────────────────────────────────────────────
   5. CAREER DETAIL DATA  (for modal on result page)
───────────────────────────────────────────────────── */
const careerDetails = {
  'Software Engineering': {
    about: 'Software Engineers design, develop, test, and maintain software systems. They work across web, mobile, cloud, embedded systems, and AI/ML platforms. It is one of the most in-demand and highest-paying fields globally.',
    subjects: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'Operating Systems', 'Database Management Systems', 'Computer Networks', 'Software Engineering Principles', 'Web Technologies', 'Cloud Computing'],
    topUniversities: ['MIT (USA)', 'Stanford University (USA)', 'ETH Zurich (Switzerland)', 'IIT Bombay (India)', 'University of Cambridge (UK)', 'National University of Singapore'],
    salaryIndia: '₹4L – ₹40L+ per year',
    salaryAbroad: '$70,000 – $180,000 per year (USA)',
    skills: ['Programming (Python, Java, C++)', 'Problem Solving', 'System Design', 'Version Control (Git)', 'Agile/Scrum', 'Cloud Platforms (AWS/GCP/Azure)'],
  },
  'Data Science': {
    about: 'Data Scientists extract insights from large datasets using statistical analysis, machine learning, and data visualisation. They work in tech, finance, healthcare, e-commerce, and government sectors.',
    subjects: ['Statistics & Probability', 'Machine Learning', 'Python / R Programming', 'Data Visualisation', 'Big Data Technologies', 'Linear Algebra', 'Database & SQL', 'Deep Learning'],
    topUniversities: ['Carnegie Mellon University (USA)', 'UC Berkeley (USA)', 'IIT Madras (India)', 'University of Toronto (Canada)', 'ETH Zurich (Switzerland)', 'Oxford (UK)'],
    salaryIndia: '₹5L – ₹35L+ per year',
    salaryAbroad: '$80,000 – $160,000 per year (USA)',
    skills: ['Python / R', 'Machine Learning', 'SQL', 'Data Wrangling', 'Statistical Modelling', 'Communication of Insights'],
  },
  'AI/ML Research': {
    about: 'AI/ML Researchers push the boundaries of artificial intelligence. They develop new algorithms, neural network architectures, and apply AI to solve complex real-world problems across all industries.',
    subjects: ['Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning', 'Mathematical Optimisation', 'Probability & Statistics', 'Linear Algebra', 'High-Performance Computing'],
    topUniversities: ['MIT (USA)', 'Stanford (USA)', 'DeepMind / Google Brain (industry)', 'IIT Delhi (India)', 'University of Montreal (Canada)', 'TU Munich (Germany)'],
    salaryIndia: '₹8L – ₹60L+ per year',
    salaryAbroad: '$100,000 – $300,000 per year (USA)',
    skills: ['Python', 'TensorFlow / PyTorch', 'Research & Publication', 'Mathematics', 'Experiment Design', 'GPU Programming'],
  },
  'Electronics Engineering': {
    about: 'Electronics Engineers design circuits, microchips, communication systems, and embedded devices. They work in semiconductor, telecom, consumer electronics, defence, and IoT industries.',
    subjects: ['Circuit Theory', 'Digital Electronics', 'Signals & Systems', 'Microprocessors & Microcontrollers', 'VLSI Design', 'Communication Systems', 'Embedded Systems', 'Electromagnetics'],
    topUniversities: ['IIT Bombay (India)', 'Caltech (USA)', 'TU Delft (Netherlands)', 'Seoul National University (South Korea)', 'Imperial College London (UK)'],
    salaryIndia: '₹3.5L – ₹20L per year',
    salaryAbroad: '$65,000 – $130,000 per year (USA)',
    skills: ['Circuit Design (CAD)', 'MATLAB', 'Embedded C', 'PCB Design', 'FPGA Programming', 'Signal Processing'],
  },
  'Mechanical Engineering': {
    about: 'Mechanical Engineers design and analyse physical systems — from jet engines and robots to HVAC systems and renewable energy turbines. It is one of the broadest engineering disciplines.',
    subjects: ['Engineering Mechanics', 'Thermodynamics', 'Fluid Mechanics', 'Manufacturing Processes', 'Machine Design', 'Heat Transfer', 'CAD/CAM', 'Material Science'],
    topUniversities: ['IIT Kharagpur (India)', 'MIT (USA)', 'TU Munich (Germany)', 'University of Michigan (USA)', 'Imperial College London (UK)'],
    salaryIndia: '₹3L – ₹18L per year',
    salaryAbroad: '$60,000 – $120,000 per year (USA)',
    skills: ['AutoCAD / SolidWorks', 'FEM Analysis', 'MATLAB / ANSYS', 'Project Management', 'Thermodynamics', 'Manufacturing Knowledge'],
  },
  'Civil Engineering': {
    about: 'Civil Engineers plan, design, and supervise infrastructure — roads, bridges, dams, airports, water supply systems, and urban development. They play a key role in sustainable development.',
    subjects: ['Structural Analysis', 'Soil Mechanics', 'Fluid Mechanics', 'Surveying', 'Construction Management', 'Environmental Engineering', 'Transportation Engineering', 'Geotechnical Engineering'],
    topUniversities: ['IIT Roorkee (India)', 'Delft University of Technology (Netherlands)', 'ETH Zurich (Switzerland)', 'University of California Berkeley (USA)'],
    salaryIndia: '₹3L – ₹15L per year',
    salaryAbroad: '$55,000 – $110,000 per year (USA)',
    skills: ['AutoCAD / Revit', 'Structural Design', 'Site Management', 'Project Planning', 'GIS', 'Contract Management'],
  },
  'Architecture': {
    about: 'Architects design buildings and spaces that are functional, safe, sustainable, and aesthetically meaningful. They work on residential, commercial, civic, and landscape projects worldwide.',
    subjects: ['Architectural Design Studio', 'History of Architecture', 'Structural Systems', 'Environmental Systems', 'Urban Design', 'Building Materials', 'BIM (Revit / AutoCAD)', 'Interior Architecture'],
    topUniversities: ['Bartlett School (UCL, UK)', 'ETH Zurich (Switzerland)', 'Harvard GSD (USA)', 'CEPT University (India)', 'Politecnico di Milano (Italy)'],
    salaryIndia: '₹3L – ₹20L per year',
    salaryAbroad: '$55,000 – $120,000 per year (USA)',
    skills: ['AutoCAD / Revit / Rhino', 'Sketching', 'Spatial Thinking', '3D Rendering', 'Project Management', 'Building Codes & Regulations'],
  },
  'UX/UI Design': {
    about: 'UX/UI Designers create digital experiences that are intuitive, accessible, and delightful. UX focuses on user research and information architecture; UI focuses on visual design and interaction.',
    subjects: ['User Research Methods', 'Information Architecture', 'Interaction Design', 'Visual Design Principles', 'Prototyping', 'Usability Testing', 'Typography', 'Accessibility Standards'],
    topUniversities: ['Carnegie Mellon HCI (USA)', 'Royal College of Art (UK)', 'NID Ahmedabad (India)', 'Aalto University (Finland)', 'Parsons School of Design (USA)'],
    salaryIndia: '₹4L – ₹25L per year',
    salaryAbroad: '$65,000 – $140,000 per year (USA)',
    skills: ['Figma / Sketch / Adobe XD', 'User Research', 'Wireframing', 'Prototyping', 'CSS Basics', 'Design Systems'],
  },
  'Medicine & Healthcare': {
    about: 'Medicine is the science and practice of diagnosing, treating, and preventing disease. Doctors work in hospitals, clinics, research, and public health. It is one of the most respected and impactful careers globally.',
    subjects: ['Anatomy', 'Physiology', 'Biochemistry', 'Pharmacology', 'Pathology', 'Microbiology', 'Community Medicine', 'Surgery & Clinical Rotations'],
    topUniversities: ['AIIMS New Delhi (India)', 'Harvard Medical School (USA)', 'Johns Hopkins (USA)', 'University of Oxford (UK)', 'Karolinska Institutet (Sweden)'],
    salaryIndia: '₹6L – ₹60L+ per year (specialists)',
    salaryAbroad: '$150,000 – $400,000 per year (USA)',
    skills: ['Clinical Diagnosis', 'Patient Communication', 'Medical Ethics', 'Research Interpretation', 'Anatomy Knowledge', 'Emergency Response'],
  },
  'Psychology': {
    about: 'Psychologists study human behaviour, emotion, and mental processes. They work in clinical settings, schools, corporations, research labs, and sports organisations.',
    subjects: ['General Psychology', 'Cognitive Psychology', 'Developmental Psychology', 'Abnormal Psychology', 'Social Psychology', 'Research Methods & Statistics', 'Neuropsychology', 'Counselling Theories'],
    topUniversities: ['Harvard University (USA)', 'Stanford University (USA)', 'University of Amsterdam (Netherlands)', 'NIMHANS Bangalore (India)', 'University College London (UK)'],
    salaryIndia: '₹2.5L – ₹15L per year',
    salaryAbroad: '$50,000 – $120,000 per year (USA)',
    skills: ['Active Listening', 'Empathy', 'Research & Statistical Analysis', 'Report Writing', 'Crisis Intervention', 'Psychometric Testing'],
  },
  'Business Management': {
    about: 'Business Management covers strategy, operations, finance, marketing, and HR. Managers lead teams, make decisions, and drive growth across every industry sector worldwide.',
    subjects: ['Principles of Management', 'Organisational Behaviour', 'Business Economics', 'Marketing Management', 'Financial Management', 'Operations Management', 'Business Strategy', 'Business Communication'],
    topUniversities: ['IIM Ahmedabad (India)', 'Harvard Business School (USA)', 'London Business School (UK)', 'INSEAD (France)', 'Wharton School (USA)'],
    salaryIndia: '₹4L – ₹30L+ per year',
    salaryAbroad: '$60,000 – $150,000 per year (USA)',
    skills: ['Leadership', 'Strategic Thinking', 'Financial Analysis', 'Communication', 'Problem Solving', 'Negotiation'],
  },
  'Finance & Banking': {
    about: 'Finance professionals manage money, investments, risk, and capital markets. Banking covers retail, investment, and central banking. Finance powers every business and government globally.',
    subjects: ['Financial Accounting', 'Corporate Finance', 'Investment Analysis', 'Banking & Financial Institutions', 'Risk Management', 'Derivatives & Capital Markets', 'Taxation', 'Financial Modelling'],
    topUniversities: ['IIM Calcutta (India)', 'London School of Economics (UK)', 'NYU Stern (USA)', 'University of Chicago Booth (USA)', 'NUS Business School (Singapore)'],
    salaryIndia: '₹4L – ₹40L+ per year',
    salaryAbroad: '$70,000 – $200,000+ per year (USA)',
    skills: ['Financial Modelling (Excel)', 'Valuation', 'Risk Analysis', 'Bloomberg Terminal', 'CFA Knowledge', 'Presentation Skills'],
  },
  'Law': {
    about: 'Lawyers advise clients, draft legal documents, and represent them in disputes. Law spans corporate, criminal, constitutional, IP, international, and family domains across all countries.',
    subjects: ['Constitutional Law', 'Contract Law', 'Tort Law', 'Criminal Law', 'Property Law', 'International Law', 'Legal Research & Writing', 'Moot Court / Advocacy'],
    topUniversities: ['NLU Delhi (India)', 'Harvard Law School (USA)', 'Oxford Faculty of Law (UK)', 'Yale Law School (USA)', 'University of Melbourne Law (Australia)'],
    salaryIndia: '₹3L – ₹30L+ per year',
    salaryAbroad: '$80,000 – $200,000 per year (USA)',
    skills: ['Legal Research', 'Drafting & Writing', 'Critical Analysis', 'Oral Advocacy', 'Client Management', 'Attention to Detail'],
  },
  'Marketing & Advertising': {
    about: 'Marketing professionals research markets, develop brand strategies, create campaigns, and manage customer relationships. Digital marketing — SEO, social media, paid ads — has massively expanded the field.',
    subjects: ['Principles of Marketing', 'Consumer Behaviour', 'Brand Management', 'Digital Marketing', 'Market Research', 'Advertising & Media Planning', 'Public Relations', 'Content Strategy'],
    topUniversities: ['IIM Bangalore (India)', 'Kellogg School of Management (USA)', 'London Business School (UK)', 'Copenhagen Business School (Denmark)', 'ESADE (Spain)'],
    salaryIndia: '₹3L – ₹20L per year',
    salaryAbroad: '$55,000 – $130,000 per year (USA)',
    skills: ['Digital Marketing (Google Ads, Meta)', 'Copywriting', 'Data Analytics', 'Brand Strategy', 'SEO/SEM', 'Social Media Management'],
  },
  'Graphic Design': {
    about: 'Graphic Designers communicate visually through typography, imagery, colour, and layout. They work in branding, publishing, advertising, UI design, motion graphics, and social media.',
    subjects: ['Design Fundamentals', 'Typography', 'Colour Theory', 'Illustration', 'Print & Digital Production', 'Branding & Identity', 'Motion Graphics', 'Design History'],
    topUniversities: ['NID Ahmedabad (India)', 'Royal College of Art (UK)', 'Parsons School of Design (USA)', 'Rhode Island School of Design (USA)', 'Aalto University (Finland)'],
    salaryIndia: '₹2.5L – ₹15L per year',
    salaryAbroad: '$45,000 – $100,000 per year (USA)',
    skills: ['Adobe Illustrator / Photoshop / InDesign', 'Figma', 'Typography', 'Visual Communication', 'Brand Identity', 'Motion Design (After Effects)'],
  },
  'Product Management': {
    about: 'Product Managers own the vision, strategy, and roadmap for a product. They bridge engineering, design, and business — deciding what to build, why, and when. It is one of the most sought-after roles in tech.',
    subjects: ['Product Strategy', 'Agile & Scrum', 'User Research', 'Data Analysis & Metrics', 'Roadmap Planning', 'Stakeholder Management', 'A/B Testing', 'Go-to-Market Strategy'],
    topUniversities: ['IIT + MBA (India)', 'Stanford (USA)', 'MIT Sloan (USA)', 'London Business School (UK)', 'Carnegie Mellon (USA)'],
    salaryIndia: '₹8L – ₹50L+ per year',
    salaryAbroad: '$100,000 – $200,000 per year (USA)',
    skills: ['Strategic Thinking', 'Data-driven Decision Making', 'Wireframing (Figma)', 'SQL', 'Communication', 'Prioritisation Frameworks'],
  },
  'Consulting': {
    about: 'Consultants solve complex business problems for clients across industries — strategy, operations, digital transformation, and organisational change. Top consultancies include McKinsey, BCG, Bain, and Deloitte.',
    subjects: ['Business Strategy', 'Problem Solving Frameworks', 'Financial Analysis', 'Data Analysis', 'Industry Research', 'Project Management', 'Communication & Presentations', 'Change Management'],
    topUniversities: ['IIM Ahmedabad / Bangalore (India)', 'Harvard Business School (USA)', 'INSEAD (France/Singapore)', 'London Business School (UK)', 'Wharton (USA)'],
    salaryIndia: '₹8L – ₹35L+ per year',
    salaryAbroad: '$80,000 – $200,000+ per year (USA)',
    skills: ['Structured Problem Solving', 'Excel & PowerPoint', 'Communication', 'Data Analysis', 'Stakeholder Management', 'Case Interview Skills'],
  },
  'Teaching & Education': {
    about: 'Educators shape the next generation. Teachers work in schools, colleges, online platforms, and corporate training. Education technology (EdTech) is a rapidly growing global sector.',
    subjects: ['Pedagogy & Teaching Methods', 'Educational Psychology', 'Curriculum Design', 'Assessment & Evaluation', 'Classroom Management', 'Inclusive Education', 'Educational Technology', 'Subject Specialisation'],
    topUniversities: ['TISS Mumbai (India)', 'Harvard Graduate School of Education (USA)', 'Institute of Education UCL (UK)', 'University of Helsinki (Finland)', 'University of Melbourne (Australia)'],
    salaryIndia: '₹2.5L – ₹15L per year',
    salaryAbroad: '$40,000 – $80,000 per year (USA)',
    skills: ['Communication', 'Empathy', 'Curriculum Planning', 'Digital Tools (LMS)', 'Assessment Design', 'Subject Expertise'],
  },
  'Journalism': {
    about: 'Journalists investigate, report, and communicate news and stories to the public through print, broadcast, and digital media. Investigative journalism, data journalism, and multimedia storytelling are growing domains.',
    subjects: ['News Writing & Reporting', 'Investigative Journalism', 'Media Law & Ethics', 'Broadcast Journalism', 'Digital Media & Social Journalism', 'Data Journalism', 'Photojournalism', 'International Affairs'],
    topUniversities: ['IIMC New Delhi (India)', 'Columbia Journalism School (USA)', 'Reuters Institute Oxford (UK)', 'Northwestern Medill (USA)', 'Sciences Po Paris (France)'],
    salaryIndia: '₹2.5L – ₹15L per year',
    salaryAbroad: '$40,000 – $90,000 per year (USA)',
    skills: ['Writing & Storytelling', 'Research', 'Interviewing', 'Video/Audio Production', 'Social Media', 'Fact-Checking'],
  },
  'Public Health': {
    about: 'Public Health professionals protect and improve the health of communities through policy, research, education, and disease prevention. It includes epidemiology, health policy, biostatistics, and global health.',
    subjects: ['Epidemiology', 'Biostatistics', 'Health Policy & Management', 'Environmental Health', 'Global Health', 'Community Health', 'Health Promotion', 'Disease Surveillance'],
    topUniversities: ['AIPH New Delhi (India)', 'Johns Hopkins Bloomberg (USA)', 'Harvard T.H. Chan (USA)', 'London School of Hygiene & Tropical Medicine (UK)', 'University of Melbourne (Australia)'],
    salaryIndia: '₹3L – ₹18L per year',
    salaryAbroad: '$55,000 – $120,000 per year (USA)',
    skills: ['Epidemiological Analysis', 'Policy Writing', 'Data Analysis (SPSS/R)', 'Community Engagement', 'Grant Writing', 'Health Communication'],
  },
  'Tech Entrepreneurship': {
    about: 'Tech Entrepreneurs build technology-driven companies. They identify problems, develop products, raise funding, and scale businesses. The startup ecosystem spans SaaS, fintech, healthtech, edtech, and more.',
    subjects: ['Entrepreneurship & Venture Creation', 'Product Development', 'Business Model Design', 'Startup Finance & Fundraising', 'Growth Hacking', 'Legal for Startups', 'Technology Management', 'Leadership'],
    topUniversities: ['IIT Bombay (India)', 'Stanford University (USA)', 'MIT (USA)', 'IIM Ahmedabad (India)', 'INSEAD (France/Singapore)'],
    salaryIndia: 'Variable — equity-based',
    salaryAbroad: 'Variable — equity + salary ($80K–$500K+)',
    skills: ['Product Thinking', 'Pitching & Fundraising', 'Networking', 'Technical Literacy', 'Resilience', 'Team Building'],
  },
  'HR Management': {
    about: 'HR Managers recruit talent, manage employee relations, develop policies, and build company culture. Modern HR spans talent analytics, DEI (Diversity, Equity, Inclusion), and organisational development.',
    subjects: ['Human Resource Management', 'Organisational Behaviour', 'Labour Laws', 'Talent Acquisition', 'Performance Management', 'Training & Development', 'Compensation & Benefits', 'HR Analytics'],
    topUniversities: ['XLRI Jamshedpur (India)', 'Cornell ILR School (USA)', 'London Business School (UK)', 'University of Michigan Ross (USA)', 'Singapore Management University'],
    salaryIndia: '₹3.5L – ₹20L per year',
    salaryAbroad: '$55,000 – $120,000 per year (USA)',
    skills: ['Communication', 'Empathy', 'Labour Law Knowledge', 'HRIS Tools (SAP/Workday)', 'Conflict Resolution', 'Data Analytics'],
  },
  'Fashion Design': {
    about: 'Fashion Designers create clothing, accessories, and footwear. They research trends, sketch designs, select fabrics, and oversee production. The industry spans luxury, fast fashion, sustainable fashion, and costume design.',
    subjects: ['Fashion Design Studio', 'Pattern Making & Draping', 'Textiles & Fabric Technology', 'Fashion Illustration', 'Fashion History & Theory', 'Garment Construction', 'Fashion Marketing', 'Sustainable Fashion'],
    topUniversities: ['NIFT Delhi (India)', 'Central Saint Martins (UK)', 'Parsons School of Design (USA)', 'Institut Français de la Mode (France)', 'Istituto Marangoni (Italy)'],
    salaryIndia: '₹2.5L – ₹15L per year',
    salaryAbroad: '$40,000 – $100,000 per year (USA)',
    skills: ['Sketching & Illustration', 'CAD (CLO 3D)', 'Pattern Making', 'Trend Forecasting', 'Fabric Knowledge', 'Merchandising'],
  },
  'Business Analytics': {
    about: 'Business Analysts use data to drive strategic decisions. They analyse market trends, operational data, and financial metrics to recommend improvements. It combines data science with business expertise.',
    subjects: ['Statistics & Probability', 'Data Analysis (Excel/SQL)', 'Business Intelligence Tools (Tableau/Power BI)', 'Predictive Modelling', 'Business Strategy', 'Operations Research', 'Python/R for Analytics', 'Case Study Methods'],
    topUniversities: ['IIM Calcutta (India)', 'MIT Sloan (USA)', 'London Business School (UK)', 'Carnegie Mellon Tepper (USA)', 'University of Texas McCombs (USA)'],
    salaryIndia: '₹5L – ₹30L per year',
    salaryAbroad: '$70,000 – $150,000 per year (USA)',
    skills: ['SQL', 'Tableau / Power BI', 'Statistical Analysis', 'Excel', 'Communication', 'Problem Framing'],
  },
  'Research & Academia': {
    about: 'Researchers and academics generate new knowledge through investigation and publish in peer-reviewed journals. They teach at universities and advise governments and industry. PhDs are the gateway.',
    subjects: ['Research Methodology', 'Academic Writing', 'Statistics & Data Analysis', 'Literature Review', 'Specialised Domain Knowledge', 'Grant Writing', 'Teaching Methods', 'Ethics in Research'],
    topUniversities: ['IISc Bangalore (India)', 'MIT (USA)', 'University of Cambridge (UK)', 'ETH Zurich (Switzerland)', 'University of Tokyo (Japan)'],
    salaryIndia: '₹4L – ₹20L per year (faculty)',
    salaryAbroad: '$50,000 – $120,000 per year (USA)',
    skills: ['Critical Thinking', 'Academic Writing', 'Statistical Software (R/STATA)', 'Peer Review', 'Presentation', 'Grant Proposal Writing'],
  },
  'Social Work': {
    about: 'Social Workers support vulnerable individuals, families, and communities facing poverty, abuse, mental health challenges, and discrimination. They work in NGOs, government agencies, hospitals, and schools.',
    subjects: ['Social Work Theory & Practice', 'Community Development', 'Social Policy', 'Human Rights & Social Justice', 'Child & Family Welfare', 'Mental Health Social Work', 'Research Methods', 'Field Practicum'],
    topUniversities: ['TISS Mumbai (India)', 'Columbia School of Social Work (USA)', 'King\'s College London (UK)', 'University of Melbourne (Australia)', 'McGill University (Canada)'],
    salaryIndia: '₹2.5L – ₹10L per year',
    salaryAbroad: '$40,000 – $75,000 per year (USA)',
    skills: ['Empathy & Active Listening', 'Advocacy', 'Case Management', 'Crisis Intervention', 'Cultural Sensitivity', 'Report Writing'],
  },
  'Media & Communication': {
    about: 'Media and Communication professionals create, manage, and distribute content across television, film, digital platforms, PR, and corporate communications. The digital revolution has created massive new opportunities.',
    subjects: ['Media Studies', 'Communication Theory', 'Digital Media Production', 'Public Relations', 'Advertising', 'Broadcast Journalism', 'Social Media Strategy', 'Media Law & Ethics'],
    topUniversities: ['IIMC New Delhi (India)', 'USC Annenberg (USA)', 'London College of Communication (UK)', 'University of Amsterdam (Netherlands)', 'Queensland University of Technology (Australia)'],
    salaryIndia: '₹2.5L – ₹18L per year',
    salaryAbroad: '$45,000 – $100,000 per year (USA)',
    skills: ['Content Creation', 'Video Production', 'Social Media Analytics', 'Copywriting', 'Public Speaking', 'Brand Communication'],
  },
};

function getCareerDetail(title) {
  return careerDetails[title] || null;
}

/* ─────────────────────────────────────────────────────
   6. COUNTRY RECOMMENDATIONS
───────────────────────────────────────────────────── */
const countryData = {
  low: [
    { name: 'Germany',     flag: '🇩🇪', why: 'Free tuition at public universities',      desc: 'Excellent engineering & science programs. Many English-taught courses.' },
    { name: 'Sweden',      flag: '🇸🇪', why: 'Strong scholarship support',               desc: 'World-class innovation ecosystem. Work-friendly student visa.' },
    { name: 'India',       flag: '🇮🇳', why: 'Affordable IITs, NITs, IIMs',              desc: 'Globally recognized degrees at a fraction of international costs.' },
    { name: 'China',       flag: '🇨🇳', why: 'Government scholarships cover full costs', desc: 'Rapidly growing research output. Many English-taught programs.' },
  ],
  medium: [
    { name: 'Canada',      flag: '🇨🇦', why: 'Post-study work visa & PR pathway',        desc: 'Multicultural, safe, and research-forward. Strong tech industry.' },
    { name: 'Japan',       flag: '🇯🇵', why: 'MEXT Scholarship available',               desc: 'Top-tier universities, advanced tech, rich culture.' },
    { name: 'Netherlands', flag: '🇳🇱', why: 'Holland Scholarship for intl. students',   desc: 'High English proficiency, strong business & design programs.' },
    { name: 'South Korea', flag: '🇰🇷', why: 'KGSP government scholarship',              desc: 'Fast-growing economy, strong STEM programs.' },
  ],
  high: [
    { name: 'USA',         flag: '🇺🇸', why: 'Fulbright & university scholarships',      desc: 'World-leading universities, strongest industry connections.' },
    { name: 'UK',          flag: '🇬🇧', why: 'Chevening & Commonwealth Scholarships',    desc: 'Shorter 1-yr Masters, globally prestigious credentials.' },
    { name: 'Australia',   flag: '🇦🇺', why: 'Australia Awards & Endeavour',             desc: 'High quality of life, strong research environment.' },
    { name: 'Singapore',   flag: '🇸🇬', why: 'NUS/NTU merit scholarships',              desc: "Asia's top-ranked universities, global finance hub." },
  ],
};

function getCountryRecommendations(budget, destination) {
  if (destination === 'india') return countryData.low.slice(2, 4);
  return countryData[budget] || countryData.medium;
}

/* ─────────────────────────────────────────────────────
   7. AFTER-12th CAREER DATABASE  (abbreviated here —
      full version already in your models/logic.js)
───────────────────────────────────────────────────── */
const after12thCareers = {
  science_pcm: {
    engineering: [
      { title: 'Computer Science & Engineering (B.Tech CSE)',  emoji: '💻', exam: 'JEE Main / JEE Advanced', duration: '4 years',  scope: 'Software developer, data scientist, AI engineer, system architect' },
      { title: 'Information Technology (B.Tech IT)',           emoji: '🌐', exam: 'JEE Main / State CETs',   duration: '4 years',  scope: 'Web developer, cybersecurity analyst, cloud engineer' },
      { title: 'Electronics & Communication Engineering',      emoji: '📡', exam: 'JEE Main / JEE Advanced', duration: '4 years',  scope: 'VLSI designer, telecom engineer, embedded systems, IoT' },
      { title: 'Mechanical Engineering',                       emoji: '⚙️', exam: 'JEE Main / JEE Advanced', duration: '4 years',  scope: 'Automotive, aerospace, manufacturing, robotics engineer' },
      { title: 'Civil Engineering',                            emoji: '🏗️', exam: 'JEE Main / JEE Advanced', duration: '4 years',  scope: 'Structural engineer, urban planner, construction manager' },
      { title: 'Chemical Engineering',                         emoji: '⚗️', exam: 'JEE Main / JEE Advanced', duration: '4 years',  scope: 'Petroleum, pharmaceutical, polymer, materials engineer' },
      { title: 'Aerospace / Aeronautical Engineering',         emoji: '✈️', exam: 'JEE Advanced / IIST',     duration: '4 years',  scope: 'ISRO, HAL, aircraft design, defence research' },
      { title: 'Electrical Engineering',                       emoji: '⚡', exam: 'JEE Main / JEE Advanced', duration: '4 years',  scope: 'Power systems, renewable energy, smart grids' },
    ],
    pure_science: [
      { title: 'B.Sc Physics (Hons)',     emoji: '🔭', exam: 'CUET / University entrance', duration: '3 years', scope: 'Research scientist, BARC, ISRO, teaching, M.Sc → PhD' },
      { title: 'B.Sc Mathematics (Hons)', emoji: '📐', exam: 'CUET / University entrance', duration: '3 years', scope: 'Actuary, data scientist, cryptographer, teaching' },
      { title: 'B.Sc Chemistry (Hons)',   emoji: '🧪', exam: 'CUET / University entrance', duration: '3 years', scope: 'R&D labs, pharma, forensics, UPSC with chemistry optional' },
      { title: 'B.Sc Data Science',       emoji: '🤖', exam: 'Online qualifier / Direct',  duration: '3 years', scope: 'Data scientist, ML engineer, business analyst' },
    ],
    design_architecture: [
      { title: 'Architecture (B.Arch)',       emoji: '🏛️', exam: 'NATA / JEE Paper 2', duration: '5 years', scope: 'Architect, urban designer, interior designer' },
      { title: 'B.Des (Industrial Design)',   emoji: '🎨', exam: 'UCEED / NID DAT',    duration: '4 years', scope: 'Product designer, UX designer, automobile design' },
    ],
    defence_merchant: [
      { title: 'NDA (Army / Navy / Air Force)',          emoji: '🪖', exam: 'UPSC NDA',   duration: '3 years', scope: 'Officer in Indian Army, Navy, or Air Force' },
      { title: 'Merchant Navy (B.Sc Nautical Science)', emoji: '⚓', exam: 'IMU CET',     duration: '3 years', scope: 'Navigation officer, marine engineer, port management' },
    ],
    other_pcm: [
      { title: 'B.Sc Aviation',          emoji: '🛫', exam: 'University / DGCA', duration: '3 years', scope: 'Commercial pilot, flight dispatcher, airline operations' },
      { title: 'B.Sc Forensic Science',  emoji: '🔍', exam: 'CUET / University', duration: '3 years', scope: 'Crime investigation, DNA analyst, fingerprint expert' },
    ],
  },
  science_pcb: {
    medical: [
      { title: 'MBBS',  emoji: '🩺', exam: 'NEET-UG', duration: '5.5 years', scope: 'Doctor (GP / Specialist), hospital, research' },
      { title: 'BDS',   emoji: '🦷', exam: 'NEET-UG', duration: '5 years',   scope: 'Dentist, orthodontist, dental surgeon' },
      { title: 'BAMS',  emoji: '🌿', exam: 'NEET-UG', duration: '5.5 years', scope: 'Ayurvedic practitioner, researcher, wellness' },
    ],
    paramedical_allied: [
      { title: 'B.Pharm',         emoji: '💊', exam: 'State Pharmacy CET', duration: '4 years',   scope: 'Pharmacist, drug inspector, pharma R&D' },
      { title: 'B.Sc Nursing',    emoji: '👩‍⚕️', exam: 'NEET-UG / Direct', duration: '4 years',  scope: 'Staff nurse, ICU nurse, nurse practitioner abroad' },
      { title: 'B.Sc Physiotherapy', emoji: '🦴', exam: 'Direct / CUET',   duration: '4.5 years', scope: 'Physiotherapist, sports rehabilitation' },
    ],
    life_science: [
      { title: 'B.Sc Biotechnology', emoji: '🧬', exam: 'CUET / University', duration: '3 years', scope: 'Biotech R&D, pharmaceutical, genetic engineering' },
      { title: 'B.Sc Microbiology',  emoji: '🦠', exam: 'CUET / University', duration: '3 years', scope: 'Clinical microbiologist, food safety, pharma QC' },
      { title: 'B.Sc Agriculture',   emoji: '🌾', exam: 'ICAR AIEEA',        duration: '4 years', scope: 'Agronomist, soil scientist, agri officer' },
    ],
    nutrition_food: [
      { title: 'B.Sc Nutrition & Dietetics', emoji: '🥗', exam: 'Direct / CUET', duration: '3 years', scope: 'Dietitian, nutritionist, sports nutrition' },
    ],
  },
  commerce: {
    professional_finance: [
      { title: 'CA — Chartered Accountancy',  emoji: '📑', exam: 'ICAI Foundation',  duration: '4–5 years', scope: 'Auditor, tax consultant, CFO, Big 4 firms' },
      { title: 'CS — Company Secretary',      emoji: '📜', exam: 'ICSI Foundation',  duration: '3 years',   scope: 'Company secretary, corporate governance' },
      { title: 'B.Com (Honours)',             emoji: '💼', exam: 'CUET / DU',        duration: '3 years',   scope: 'Accounts, finance, banking, MBA gateway' },
      { title: 'BBA',                         emoji: '🏢', exam: 'IPMAT / Direct',   duration: '3 years',   scope: 'Manager, entrepreneur, MBA pathway' },
    ],
    banking_finance: [
      { title: 'BA Economics (Hons)',  emoji: '📉', exam: 'CUET / University', duration: '3 years', scope: 'Economist, RBI, UPSC, research, MBA' },
      { title: 'BBA Finance',         emoji: '🏦', exam: 'Direct / University', duration: '3 years', scope: 'Banking, NBFC, mutual funds, stock broking' },
    ],
    management_hr: [
      { title: 'BBA Human Resource Management', emoji: '👥', exam: 'Direct', duration: '3 years', scope: 'HR executive, recruiter, talent acquisition' },
      { title: 'BBA Marketing',                 emoji: '📢', exam: 'Direct', duration: '3 years', scope: 'Marketing manager, digital marketer, brand exec' },
    ],
    hotel_travel: [
      { title: 'BHM — Hotel Management', emoji: '🏨', exam: 'NCHMCT JEE', duration: '4 years', scope: 'Hotel manager, F&B manager, chef, resort management' },
    ],
    law_commerce: [
      { title: 'BA LLB / BBA LLB', emoji: '⚖️', exam: 'CLAT / AILET', duration: '5 years', scope: 'Corporate lawyer, civil litigator, legal advisor' },
    ],
  },
  arts_humanities: {
    social_science: [
      { title: 'BA Political Science (Hons)', emoji: '🏛️', exam: 'CUET', duration: '3 years', scope: 'IAS/IPS, diplomat, political analyst, journalist' },
      { title: 'BA Psychology (Hons)',        emoji: '🧠', exam: 'CUET', duration: '3 years', scope: 'Counsellor, HR professional, researcher' },
      { title: 'BA Economics (Hons)',         emoji: '📈', exam: 'CUET', duration: '3 years', scope: 'Economist, policy analyst, civil services, MBA' },
    ],
    language_literature: [
      { title: 'BA English (Hons)',      emoji: '📖', exam: 'CUET', duration: '3 years', scope: 'Writer, editor, content strategist, journalist' },
      { title: 'BA Foreign Language',   emoji: '🌐', exam: 'JNU / CUET', duration: '3 years', scope: 'Translator, diplomat, MNC liaison' },
    ],
    media_communication: [
      { title: 'BJMC — Journalism & Mass Communication', emoji: '📰', exam: 'CUET / IIMC', duration: '3 years', scope: 'Reporter, anchor, editor, digital content creator' },
      { title: 'BA Film & Television Production',        emoji: '🎬', exam: 'FTII / Direct', duration: '3 years', scope: 'Filmmaker, video editor, OTT content creator' },
    ],
    fine_arts_design: [
      { title: 'BFA — Bachelor of Fine Arts',        emoji: '🎨', exam: 'NID / NATA',   duration: '4 years', scope: 'Fine artist, art director, gallery curator' },
      { title: 'B.Des — Fashion Design',             emoji: '👗', exam: 'NIFT / NID',   duration: '4 years', scope: 'Fashion designer, stylist, textile designer' },
      { title: 'B.Des — Graphic Design',             emoji: '🖌️', exam: 'UCEED / NID', duration: '4 years', scope: 'Graphic designer, UI/UX designer, art director' },
    ],
    education_social: [
      { title: 'BSW — Bachelor of Social Work', emoji: '🤝', exam: 'CUET', duration: '3 years', scope: 'Social worker, NGO manager, UNICEF, WHO' },
      { title: 'BA LLB',                        emoji: '⚖️', exam: 'CLAT', duration: '5 years', scope: 'Lawyer, judge, legal advisor, public prosecutor' },
    ],
    library_heritage: [
      { title: 'BA Archaeology & Museology', emoji: '🏺', exam: 'CUET', duration: '3 years', scope: 'Archaeologist, museum curator, heritage officer' },
    ],
    music_performing: [
      { title: 'B.Mus — Bachelor of Music', emoji: '🎵', exam: 'University / Conservatory', duration: '3 years', scope: 'Musician, music producer, sound designer' },
      { title: 'BA Theatre & Drama',        emoji: '🎭', exam: 'NSD / University',          duration: '3 years', scope: 'Actor, theatre director, drama therapist' },
    ],
  },
};

const vocationalCareers = [
  { title: 'Diploma in Computer Applications (DCA)',     emoji: '💻', duration: '1 year',         scope: 'Data entry operator, office assistant, junior programmer' },
  { title: 'Diploma in Digital Marketing',               emoji: '📱', duration: '6 months–1 year', scope: 'SEO analyst, social media manager, performance marketer' },
  { title: 'Diploma in Graphic Design',                  emoji: '🖌️', duration: '1 year',         scope: 'Graphic designer, logo designer, freelancer' },
  { title: 'Diploma in Web Development',                 emoji: '🌐', duration: '6 months–1 year', scope: 'Front-end developer, full-stack developer, freelancer' },
  { title: 'Diploma in Event Management',                emoji: '🎉', duration: '1 year',          scope: 'Event planner, wedding planner, corporate events coordinator' },
  { title: 'Diploma in Hotel & Hospitality Management',  emoji: '🏨', duration: '1–2 years',       scope: 'Front office, F&B, housekeeping, event coordination' },
  { title: 'ITI (Industrial Training Institute)',         emoji: '🔧', duration: '1–2 years',       scope: 'Electrician, fitter, welder, mechanic — government jobs via Railway, Defence' },
  { title: 'Short-term NPTEL / SWAYAM Online Courses',  emoji: '🎓', duration: 'Self-paced',       scope: 'Supplement any degree with MOOCs — AI, coding, finance, humanities' },
];

const streamMeta = {
  science_pcm:     { label: 'Science — PCM', color: '#4a90d9' },
  science_pcb:     { label: 'Science — PCB', color: '#27ae60' },
  commerce:        { label: 'Commerce',       color: '#e8c547' },
  arts_humanities: { label: 'Arts / Humanities', color: '#e8674a' },
};

const riasecStreamMap = {
  R: { science_pcm: ['engineering','other_pcm'],        science_pcb: ['paramedical_allied'], commerce: ['management_hr'],           arts_humanities: ['fine_arts_design'] },
  I: { science_pcm: ['pure_science','engineering'],     science_pcb: ['life_science','medical'], commerce: ['professional_finance','banking_finance'], arts_humanities: ['social_science'] },
  A: { science_pcm: ['design_architecture'],            science_pcb: ['nutrition_food'],     commerce: ['hotel_travel'],            arts_humanities: ['fine_arts_design','media_communication','music_performing'] },
  S: { science_pcm: ['other_pcm'],                      science_pcb: ['medical','paramedical_allied','life_science'], commerce: ['management_hr','hotel_travel'], arts_humanities: ['education_social','social_science'] },
  E: { science_pcm: ['engineering','defence_merchant'], science_pcb: ['medical'],            commerce: ['professional_finance','management_hr'], arts_humanities: ['media_communication','social_science'] },
  C: { science_pcm: ['pure_science'],                   science_pcb: ['paramedical_allied'], commerce: ['professional_finance','banking_finance'], arts_humanities: ['library_heritage','language_literature'] },
};

function getAfter12thRecommended(stream, type1, type2) {
  if (!stream || !after12thCareers[stream]) return [];
  const streamData = after12thCareers[stream];
  const s1 = (riasecStreamMap[type1] && riasecStreamMap[type1][stream]) || [];
  const s2 = (riasecStreamMap[type2] && riasecStreamMap[type2][stream]) || [];
  const allSections = [...new Set([...s1, ...s2])];
  let picks = [];
  allSections.forEach(sec => { if (streamData[sec]) picks = picks.concat(streamData[sec].slice(0, 3)); });
  const seen = new Set();
  return picks.filter(c => { if (seen.has(c.title)) return false; seen.add(c.title); return true; }).slice(0, 8);
}

module.exports = {
  computeScores,
  getCareerRecommendations,
  getCountryRecommendations,
  getAfter12thRecommended,
  getCareerDetail,
  after12thCareers,
  vocationalCareers,
  streamMeta,
  riasecNames,
  careerDetails,
  questions,
};
