<?php
require_once __DIR__ . '/db_connection.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $stmt = $pdo->query("SELECT id, title FROM genres");
    $genres = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($genres, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при получении жанров: ' . $e->getMessage()]);
}
