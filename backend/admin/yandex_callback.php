<?php
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

function sendTokenRequest($code) {
    $postData = http_build_query([
        'grant_type'    => 'authorization_code',
        'code'          => $code,
        'client_id'     => $_ENV['YANDEX_CLIENT_ID'],
        'client_secret' => $_ENV['YANDEX_CLIENT_SECRET'],
        'redirect_uri'  => $_ENV['YANDEX_REDIRECT_URI']
    ]);

    $context = stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $postData,
        ]
    ]);

    $response = file_get_contents($_ENV['YANDEX_TOKEN_URL'], false, $context);
    if ($response === false) {
        return null;
    }

    return json_decode($response, true);
}

function getUserInfo($accessToken) {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "Authorization: OAuth {$accessToken}\r\n",
        ]
    ]);

    $url = $_ENV['YANDEX_USERINFO_URL'] . '?format=json';
    $response = file_get_contents($url, false, $context);
    if ($response === false) {
        return null;
    }

    return json_decode($response, true);
}

if (!isset($_GET['code']) || !isset($_GET['state'])) {
    http_response_code(400);
    echo 'Missing code or state';
    exit;
}

$code  = $_GET['code'];
$state = $_GET['state']; // pending_token

// 1. Обмен кода на access_token
$tokenData = sendTokenRequest($code);
if (!$tokenData || !isset($tokenData['access_token'])) {
    http_response_code(400);
    echo 'Failed to get access token';
    exit;
}

$accessToken = $tokenData['access_token'];

// 2. Получаем профиль пользователя
$userInfo = getUserInfo($accessToken);
if (!$userInfo) {
    http_response_code(400);
    echo 'Failed to get user info';
    exit;
}

// Yandex ID может быть в полях id или uid
$yandexId = $userInfo['id'] ?? ($userInfo['uid'] ?? null);
if (!$yandexId) {
    http_response_code(400);
    echo 'Yandex ID not found';
    exit;
}

// 3. Находим pending запись по state
$stmt = $pdo->prepare("SELECT user_id FROM pending_yandex_link WHERE token = :token");
$stmt->execute(['token' => $state]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    http_response_code(400);
    echo 'Invalid state';
    exit;
}

$userId = $row['user_id'];

// 4. Обновляем users.yandex_id
$stmt = $pdo->prepare("UPDATE users SET yandex_id = :yid WHERE id = :id");
$stmt->execute([
    'yid' => $yandexId,
    'id'  => $userId
]);

// 5. Удаляем временную запись
$stmt = $pdo->prepare("DELETE FROM pending_yandex_link WHERE token = :token");
$stmt->execute(['token' => $state]);

// 6. *** НОВОЕ: Передаём yandex_id на фронт через URL ***
$redirectFront = 'http://localhost/admin-yandex-complete?yandex_linked=1&yandex_id=' . urlencode($yandexId);
header('Location: ' . $redirectFront);
exit;
?>
