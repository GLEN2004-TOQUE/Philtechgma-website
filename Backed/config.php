<?php
// Database configuration for MySQL
define('DB_HOST', 'localhost');
define('DB_NAME', 'philtech_db');
define('DB_USER', 'root'); // Default MySQL username
define('DB_PASS', ''); // Default MySQL password (empty for XAMPP)
define('DB_PORT', '3306');

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
