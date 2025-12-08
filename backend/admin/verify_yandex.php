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

$input = json_decode(file_get_contents('php://input'), true);
$yandexId = $input['yandex_id'] ?? '';

if (empty($yandexId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Yandex ID required']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, login, is_admin FROM users WHERE yandex_id = :yid AND is_admin = true");
    $stmt->execute(['yid' => $yandexId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode([
            'success' => true,
            'is_admin' => true,
            'user' => [
                'id' => $user['id'],
                'login' => $user['login']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Admin not found',
            'clear_localstorage' => true
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
?>
