<?php
require_once __DIR__ . '/../db_connection.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $title = $input['title'] ?? '';
    
    try {
        $stmt = $pdo->prepare("INSERT INTO genres (title) VALUES (:title)");
        $stmt->execute(['title' => $title]);
        
        echo json_encode(['success' => true, 'message' => 'Жанр добавлен']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка при добавлении жанра: ' . $e->getMessage()]);
    }
}