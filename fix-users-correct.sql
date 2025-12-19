-- Delete existing users and insert with correct password hashes
DELETE FROM "User" WHERE email IN ('admin@example.com', 'student@example.com');

-- Insert users with correct bcrypt hashes
INSERT INTO "User" ("email", "name", "passwordHash", "role") VALUES
('admin@example.com', 'Admin User', '$2b$10$DjAcf5gN1bR6mJF0Fepm9emuKlA//deQiJwveWu1/dtH1T76CgV2G', 'ADMIN'),
('student@example.com', 'Student User', '$2b$10$g6ejY87fN/Wq/h629oBGCebSj3u3NGL6SPZ1HK8CmiXt901/7VxD2', 'STUDENT');

-- Verify users were inserted
SELECT email, name, role FROM "User";
