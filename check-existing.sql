-- Check what tables already exist
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check what types exist
SELECT typname 
FROM pg_type 
WHERE typname IN ('Role', 'QuestionType');

-- Check if users exist
SELECT COUNT(*) as user_count FROM "User";

-- Show sample data if it exists
SELECT email, name, role FROM "User" LIMIT 5;
