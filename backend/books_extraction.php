<?php
require_once __DIR__ . '/db_connection.php'; 

header('Content-Type: application/json; charset=utf-8');

try {
    $stmt = $pdo->query("SELECT * FROM books");
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($books as &$book) {
        if (isset($book['genres'])) {
            $book['genres'] = array_map('trim', explode(',', trim($book['genres'], '{}')));
        } else {
            $book['genres'] = [];
        }
    }

    echo json_encode($books, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при получении данных: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
