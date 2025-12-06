-- Note: Passwords are hashed using password_hash() in PHP

-- Sample Admin User
INSERT INTO users (email, password_hash, role, full_name) VALUES
('admin@philtech.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Dr. Carlos Lim')
ON CONFLICT (email) DO NOTHING;

-- Sample Teacher
INSERT INTO users (email, password_hash, role, full_name) VALUES
('teacher@philtech.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'Prof. Maria Santos')
ON CONFLICT (email) DO NOTHING;

INSERT INTO teachers (user_id, employee_id, department, position) VALUES
((SELECT id FROM users WHERE email = 'teacher@philtech.edu'), 'T001', 'Computer Science', 'Associate Professor')
ON CONFLICT (user_id) DO NOTHING;

-- Sample Student
INSERT INTO users (email, password_hash, role, full_name) VALUES
('student@philtech.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'Juan Dela Cruz')
ON CONFLICT (email) DO NOTHING;

INSERT INTO students (user_id, student_id, course, year_level, department) VALUES
((SELECT id FROM users WHERE email = 'student@philtech.edu'), '2023-00123', 'Bachelor of Science in Computer Science', 3, 'College of Computer Studies')
ON CONFLICT (user_id) DO NOTHING;

-- Sample Parent
INSERT INTO users (email, password_hash, role, full_name) VALUES
('parent@philtech.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'parent', 'Mr. Rodrigo Reyes')
ON CONFLICT (email) DO NOTHING;

INSERT INTO parents (user_id, guardian_id, student_dependent) VALUES
((SELECT id FROM users WHERE email = 'parent@philtech.edu'), 'P001', 'Ana Reyes')
ON CONFLICT (user_id) DO NOTHING;

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
=======
-- Insert sample data for testing
-- Note: Passwords are hashed using password_hash() in PHP
-- Run the setup.php script instead of these manual inserts for proper setup

-- Sample data will be inserted by setup.php script
-- Password hash for 'password': $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
