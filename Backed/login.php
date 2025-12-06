<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Read JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$role = trim($input['role'] ?? '');

if (empty($email) || empty($password) || empty($role)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email, password, and role are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

$validRoles = ['student', 'teacher', 'parent', 'admin'];
if (!in_array($role, $validRoles)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid role']);
    exit;
}

try {
    // Fetch user
    $stmt = $pdo->prepare("
        SELECT u.id, u.email, u.password_hash, u.role, u.full_name, u.is_active
        FROM users u
        WHERE u.email = ? AND u.role = ? AND u.is_active = TRUE
    ");
    $stmt->execute([$email, $role]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        exit;
    }

    // Password verification
    if (!password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        exit;
    }

    // Fetch additional role-based data
    $roleData = [];

    switch ($role) {
        case 'student':
            $stmt = $pdo->prepare("
                SELECT s.student_id, s.course, s.year_level, s.department
                FROM students s
                WHERE s.user_id = ?
            ");
            $stmt->execute([$user['id']]);
            $roleData = $stmt->fetch() ?: [];
            break;

        case 'teacher':
            $stmt = $pdo->prepare("
                SELECT t.employee_id, t.department, t.position
                FROM teachers t
                WHERE t.user_id = ?
            ");
            $stmt->execute([$user['id']]);
            $roleData = $stmt->fetch() ?: [];
            break;

        case 'parent':
            $stmt = $pdo->prepare("
                SELECT p.guardian_id, p.student_dependent
                FROM parents p
                WHERE p.user_id = ?
            ");
            $stmt->execute([$user['id']]);
            $roleData = $stmt->fetch() ?: [];
            break;

        case 'admin':
            $roleData = ['position' => 'System Administrator'];
            break;
    }

    // Create session token
    $sessionToken = bin2hex(random_bytes(32));

    // Assemble user response
    $userData = array_merge([
        'id' => $user['id'],
        'email' => $user['email'],
        'role' => $user['role'],
        'fullName' => $user['full_name'],
        'sessionToken' => $sessionToken,
        'loggedInAt' => date('c')
    ], $roleData);

    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => $userData
    ]);

} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
} catch (Exception $e) {
    error_log('General error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>
