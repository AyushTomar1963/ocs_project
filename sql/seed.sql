-- Insert users (admin, students, recruiters)
-- Note: password_hash values are MD5 hashes of the raw passwords
INSERT INTO users (userid, password_hash, role) VALUES
('admin', '5f4dcc3b5aa765d61d8327deb882cf99', 'admin'),
('student1', 'aeddf07d1ab10bd6d8dde8b778368511', 'student'),
('student2', '269afc90dec9f5bb8da8dfce984a2232', 'student'),
('student3', '3a1a4b50a02aa4312cb674d4dae587ce', 'student'),
('recruiter1@techcorp.com', 'ca290bcb62ce43c5b34c2005ec4a91ed', 'recruiter'),
('recruiter2@dataworks.com', '3e943c50ba499e8b11995c7d76cc7f1f', 'recruiter');

-- Insert profiles (job postings)
INSERT INTO profile (profile_code, recruiter_email, company_name, designation) VALUES
(1001, 'recruiter1@techcorp.com', 'TechCorp', 'Backend Intern'),
(1002, 'recruiter1@techcorp.com', 'TechCorp', 'Frontend Intern'),
(1003, 'recruiter2@dataworks.com', 'DataWorks', 'ML Intern'),
(1004, 'recruiter2@dataworks.com', 'DataWorks', 'Software Engineer');

-- Reset sequence for profile_code to continue from 1005
SELECT setval('profile_profile_code_seq', 1004, true);
