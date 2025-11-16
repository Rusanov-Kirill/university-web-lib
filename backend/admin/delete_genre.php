<?php
require_once __DIR__ . '/../db_connection.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? '';
    
    try {
        $stmt = $pdo->prepare("DELETE FROM genres WHERE id = :id");
        $stmt->execute(['id' => $id]);
        
        echo json_encode(['success' => true, 'message' => 'Жанр удален']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка при удалении жанра: ' . $e->getMessage()]);
    }
}