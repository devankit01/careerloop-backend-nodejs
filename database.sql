-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS careerflow;

-- Use the careerflow database
USE careerflow;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL CHECK (role IN ('student', 'recruiter', 'admin')),
  password VARCHAR(255) NULL,
  provider VARCHAR(255) NULL,
  provider_id VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT FALSE
);

-- Create the students table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  phone VARCHAR(255) UNIQUE,
  gender VARCHAR(255),
  dob VARCHAR(255),
  bio VARCHAR(255),
  location VARCHAR(255),
  social_media_links VARCHAR(255),
  degree VARCHAR(255),
  graduation_year INT,
  skills VARCHAR(255),
  eresume_url VARCHAR(255),
  profile_picture VARCHAR(255),
  professional_summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the education table
CREATE TABLE IF NOT EXISTS education (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255),
  start_date DATE,
  end_date DATE,
  grade VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Create the work_experiences table
CREATE TABLE IF NOT EXISTS work_experiences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Create the project_experiences table
CREATE TABLE IF NOT EXISTS project_experiences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  technologies VARCHAR(255),
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  project_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Create the certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  issuing_organization VARCHAR(255) NOT NULL,
  issue_date DATE,
  expiration_date DATE,
  credential_id VARCHAR(255),
  credential_url VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Create an admin user (password is 'admin123' - this would be hashed in production)
-- This is just for initial setup, in real app the password would be properly hashed
INSERT INTO users (email, first_name, last_name, role, password, is_active)
VALUES ('admin@careerflow.com', 'Admin', 'User', 'admin', 'admin123', TRUE);

-- Create a sample student user
INSERT INTO users (email, first_name, last_name, role, password, is_active)
VALUES ('student@example.com', 'John', 'Doe', 'student', 'password123', TRUE);

-- Create a sample recruiter user
INSERT INTO users (email, first_name, last_name, role, password, is_active)
VALUES ('recruiter@company.com', 'Jane', 'Smith', 'recruiter', 'password123', TRUE);

-- Create sample student profile for the student user
INSERT INTO students (user_id, phone, gender, location, skills, professional_summary)
VALUES (
  2, -- Assuming the student user has ID 2
  '1234567890',
  'Male',
  'New York, NY',
  'JavaScript,React,Node.js',
  'Passionate software developer with experience in web development.'
); 