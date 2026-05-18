-- ─────────────────────────────────────────────────────
-- CareerGuide — schema.sql  (full + migration)
-- Run once on a fresh DB:  mysql -u root -p < schema.sql
-- To add links to existing DB run only the ALTER + UPDATE
-- ─────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS career_db;
USE career_db;

CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name  VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scholarships (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255),
  country     VARCHAR(100),
  level       VARCHAR(50),
  category    VARCHAR(100),
  description TEXT,
  amount      VARCHAR(100),
  link        VARCHAR(500) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS results (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT,
  edu_level   VARCHAR(50),
  marks       VARCHAR(50),
  budget      VARCHAR(50),
  destination VARCHAR(50),
  stream      VARCHAR(50),
  top_type1   VARCHAR(5),
  top_type2   VARCHAR(5),
  scores_json TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────
-- ADD link COLUMN if upgrading existing database
-- ─────────────────────────────────────────────────────
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS link VARCHAR(500) DEFAULT NULL;
ALTER TABLE results      ADD COLUMN IF NOT EXISTS stream VARCHAR(50) DEFAULT NULL;
ALTER TABLE results ADD COLUMN IF NOT EXISTS stream VARCHAR(50) DEFAULT NULL;

-- ─────────────────────────────────────────────────────
-- SCHOLARSHIP DATA WITH OFFICIAL LINKS
-- ─────────────────────────────────────────────────────
INSERT INTO scholarships (name, country, level, category, description, amount, link) VALUES
('Fulbright Foreign Student Program',        'USA',         'Masters/PhD',       'Government', 'Fully funded program for international students (except medicine)',       'Fully Funded',  'https://foreign.fulbrightonline.org'),
('Hubert Humphrey Fellowship',               'USA',         'Non-degree',        'Government', '10-month academic program for professionals',                            'Fully Funded',  'https://www.humphreyfellowship.org'),
('Civil Society Leadership Awards',          'USA',         'Masters',           'Private',    'Fully funded scholarships for eligible countries',                       'Fully Funded',  'https://www.opensocietyfoundations.org/grants/civil-society-leadership-awards'),
('Rotary Peace Fellowships',                 'USA',         'Masters',           'NGO',        'Peace and development focused scholarships',                             'Fully Funded',  'https://www.rotary.org/en/our-programs/peace-fellowships'),
('Clark University Global Scholars Program', 'USA',         'Undergraduate',     'University', 'Scholarship + internship stipend',                                       'Partial',       'https://www.clarku.edu/offices/financial-aid/scholarships'),
('Harvard University Scholarships',          'USA',         'All Levels',        'University', 'Highly competitive scholarships for international students',             'Varies',        'https://college.harvard.edu/financial-aid'),
('Vanier Canada Graduate Scholarships',      'Canada',      'PhD',               'Government', 'Scholarship for doctoral students',                                      'High Funding',  'https://vanier.gc.ca'),
('Banting Postdoctoral Fellowships',         'Canada',      'Postdoc',           'Government', 'Research-based fellowships',                                             'High Funding',  'https://banting.fellowships-bourses.gc.ca'),
('UBC International Leader of Tomorrow Award','Canada',     'Undergraduate',     'University', 'Merit-based scholarship for leadership students',                        'Partial/Full',  'https://you.ubc.ca/financial-planning/scholarships-awards/trek-excellence-scholarship'),
('University of Calgary Scholarships',       'Canada',      'All Levels',        'University', 'Scholarships ranging from CA$500 to CA$60,000',                         'Varies',        'https://www.ucalgary.ca/registrar/finances/scholarships-awards'),
('York University International Program',    'Canada',      'Undergraduate',     'University', 'Scholarships for international students',                                'Varies',        'https://futurestudents.yorku.ca/requirements/scholarships'),
('Australia Awards Scholarships',            'Australia',   'All Levels',        'Government', 'Government-funded scholarships',                                         'Fully Funded',  'https://www.australiaawards.gov.au'),
('Endeavour Postgraduate Scholarship',       'Australia',   'Masters/PhD',       'Government', 'Merit-based scholarship',                                                'Fully Funded',  'https://www.dese.gov.au/endeavour-leadership-program'),
('Melbourne Research Scholarship',           'Australia',   'Masters',           'University', 'For high-achieving students',                                            'Fully Funded',  'https://scholarships.unimelb.edu.au'),
('Monash International Merit Scholarship',   'Australia',   'All Levels',        'University', 'Merit-based funding',                                                    'Partial',       'https://www.monash.edu/study/fees-scholarships/scholarships/find-a-scholarship/international-merit-scholarship'),
('Chevening Scholarships',                   'UK',          'Masters',           'Government', 'Fully funded UK government scholarship',                                 'Fully Funded',  'https://www.chevening.org'),
('Commonwealth Scholarships',                'UK',          'Masters/PhD',       'Government', 'For developing countries',                                               'Fully Funded',  'https://cscuk.fcdo.gov.uk/scholarships'),
('Gates Cambridge Scholarship',              'UK',          'Postgraduate',      'University', 'Full scholarship at Cambridge',                                          'Fully Funded',  'https://www.gatescambridge.org'),
('Rhodes Scholarship',                       'UK',          'Masters/PhD',       'University', 'Prestigious Oxford scholarship',                                         'Fully Funded',  'https://www.rhodeshouse.ox.ac.uk'),
('University of Westminster Scholarship',    'UK',          'Masters',           'University', 'Based on merit and financial need',                                      'Partial',       'https://www.westminster.ac.uk/study/fees-and-funding/scholarships'),
('Erasmus Mundus Scholarship',               'Europe',      'Masters/PhD',       'Government', 'Study in multiple European countries',                                   'Fully Funded',  'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus_en'),
('DAAD Scholarship',                         'Germany',     'Masters/PhD',       'Government', 'German government scholarship',                                          'Fully Funded',  'https://www.daad.de/en/study-and-research-in-germany/scholarships'),
('Swedish Institute Scholarship',            'Sweden',      'Masters',           'Government', 'Covers tuition, living, travel',                                         'Fully Funded',  'https://si.se/en/apply/scholarships'),
('Holland Scholarship',                      'Netherlands', 'Bachelors/Masters', 'Government', 'For non-EEA students',                                                   'Partial',       'https://www.studyinholland.nl/finances/holland-scholarship'),
('Chinese Government Scholarship',           'China',       'All Levels',        'Government', 'Covers tuition, accommodation, stipend',                                 'Fully Funded',  'https://www.csc.edu.cn/studyinchina'),
('MEXT Scholarship',                         'Japan',       'All Levels',        'Government', 'Japanese government scholarship',                                        'Fully Funded',  'https://www.mext.go.jp/en/policy/education/highered/title02/detail02/sdetail02/1373897.htm'),
('Singapore International Graduate Award',  'Singapore',   'PhD',               'Government', 'Science and engineering research',                                       'Fully Funded',  'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa'),
('Korean Government Scholarship (KGSP)',     'South Korea', 'Masters/PhD',       'Government', 'Fully funded Korean scholarship',                                        'Fully Funded',  'https://www.studyinkorea.go.kr/en/sub/gks/allnew_gks_s.do'),
('Inlaks Shivdasani Foundation Scholarship', 'India',       'Masters',           'Private',    'For study in US/Europe',                                                 'Partial/Full',  'https://www.inlaksfoundation.org/scholarships'),
('ICCR Scholarship',                        'India',       'All Levels',        'Government', 'Scholarships for international students in India',                       'Fully Funded',  'https://www.iccr.gov.in/scholarship');
