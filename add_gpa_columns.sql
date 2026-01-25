-- Add GPA column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS gpa FLOAT;

-- Add minimum GPA requirement to profile table
ALTER TABLE profile ADD COLUMN IF NOT EXISTS min_gpa FLOAT DEFAULT 0.0;

-- Optional: Update existing users with sample GPA values for testing
-- UPDATE users SET gpa = 3.5 WHERE role = 'student';
