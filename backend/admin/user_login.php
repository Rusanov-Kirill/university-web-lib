<?php
require_once __DIR__ . '/../db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$login = $input['login'] ?? '';
$password = $input['password'] ?? '';

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, login, password, is_admin, yandex_id FROM users WHERE login = :login");
    $stmt->execute(['login' => $login]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && $password === $user['password']) {
        if ($user['is_admin']) {

            if (!empty($user['yandex_id'])) {
                echo json_encode([
                    'success' => true,
                    'is_admin' => true,
                    'yandex_linked' => true,
                    'user' => [
                        'id' => $user['id'],
                        'login' => $user['login']
                    ]
                ]);
                exit;
            }

            $tempToken = bin2hex(random_bytes(16));

            $stmt = $pdo->prepare("INSERT INTO pending_yandex_link (token, user_id, created_at) VALUES (:token, :user_id, NOW())");
            $stmt->execute([
                'token' => $tempToken,
                'user_id' => $user['id']
            ]);

            echo json_encode([
                'success' => true,
                'is_admin' => true,
                'yandex_linked' => false,
                'pending_token' => $tempToken,
                'user' => [
                    'id' => $user['id'],
                    'login' => $user['login']
                ]
            ]);
            exit;

        } else {
            http_response_code(403);
            echo json_encode([
                'error' => 'Access denied',
                'is_admin' => false
            ]);
            exit;
        }
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid login or password']);
        exit;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
    exit;
}
