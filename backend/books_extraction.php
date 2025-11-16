<?php
require_once __DIR__ . '/db_connection.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

try {
    $stmt = $pdo->query("SELECT * FROM books");
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($books as &$book) {
        if (isset($book['genres'])) {
            error_log("Original genres: " . $book['genres']);
            
            if (is_string($book['genres'])) {
                $cleaned = trim($book['genres'], '{}');
                $book['genres'] = array_map('trim', explode(',', $cleaned));
            }
        } else {
            $book['genres'] = [];
        }
        
        error_log("Processed genres: " . json_encode($book['genres']));
    }

    echo json_encode($books, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при получении данных: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}