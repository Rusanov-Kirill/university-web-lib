<?php
require_once __DIR__ . '/../db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $login = $input['login'] ?? '';
    $password = $input['password'] ?? '';
    
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['error' => 'DB connection failed']);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT id, login, password, is_admin FROM users WHERE login = :login");
        $stmt->execute(['login' => $login]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && $password === $user['password']) {
            if ($user['is_admin']) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Admin login successful',
                    'is_admin' => true,
                    'user' => [
                        'id' => $user['id'],
                        'login' => $user['login']
                    ]
                ]);
            } else {
                http_response_code(403);
                echo json_encode([
                    'error' => 'Access denied',
                    'is_admin' => false
                ]);
            }
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid login or password']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>