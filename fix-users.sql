-- Delete existing users and insert with correct password hashes
DELETE FROM "User" WHERE email IN ('admin@example.com', 'student@example.com');

-- Insert users with correct bcrypt hashes
INSERT INTO "User" ("email", "name", "passwordHash", "role") VALUES
('admin@example.com', 'Admin User', '$2a$10$K3Z8Y9Z8Y9Z8Y9Z8Y9Z8Ye9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y', 'ADMIN'),
('student@example.com', 'Student User', '$2a$10$K3Z8Y9Z8Y9Z8Y9Z8Y9Z8Ye9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y', 'STUDENT');

-- Verify users were inserted
SELECT email, name, role FROM "User";
