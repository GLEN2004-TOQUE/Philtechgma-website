-- PHILTECH Database Setup for MySQL
-- Run this entire script in phpMyAdmin or MySQL Workbench

-- Create database
CREATE DATABASE IF NOT EXISTS philtech_db;
USE philtech_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'parent', 'admin') NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    course VARCHAR(100),
    year_level INT CHECK (year_level >= 1 AND year_level <= 4),
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create parents table
CREATE TABLE IF NOT EXISTS parents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    guardian_id VARCHAR(50) UNIQUE NOT NULL,
    student_dependent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_parents_user_id ON parents(user_id);

-- Insert sample data for testing
-- Note: Passwords are hashed using password_hash() in PHP
-- Password hash for 'password': $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

-- Sample Admin User
INSERT IGNORE INTO users (email, password_hash, role, full_name) VALUES
('admin@philtech.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Dr. Carlos Lim');

-- Sample Teacher
INSERT IGNORE INTO users (email, password_hash, role, full_name) VALUES
('teacher@philtech.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'Prof. Maria Santos');

INSERT IGNORE INTO teachers (user_id, employee_id, department, position) VALUES
((SELECT id FROM users WHERE email = 'teacher@philtech.edu'), 'T001', 'Computer Science', 'Associate Professor');

-- Sample Student
INSERT IGNORE INTO users (email, password_hash, role, full_name) VALUES
('student@philtech.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'Juan Dela Cruz');

INSERT IGNORE INTO students (user_id, student_id, course, year_level, department) VALUES
((SELECT id FROM users WHERE email = 'student@philtech.edu'), '2023-00123', 'Bachelor of Science in Computer Science', 3, 'College of Computer Studies');

-- Sample Parent
INSERT IGNORE INTO users (email, password_hash, role, full_name) VALUES
('parent@philtech.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'parent', 'Mr. Rodrigo Reyes');

INSERT IGNORE INTO parents (user_id, guardian_id, student_dependent) VALUES
((SELECT id FROM users WHERE email = 'parent@philtech.edu'), 'P001', 'Ana Reyes');
