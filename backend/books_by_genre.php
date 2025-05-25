<?php
require_once __DIR__ . '/db_connection.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_GET['genre']) || trim($_GET['genre']) === '') {
    echo json_encode([]);
    exit;
}

$genre = trim($_GET['genre']);

try {
    $stmt = $pdo->prepare("SELECT * FROM books WHERE :genre = ANY(genres)");
    $stmt->execute(['genre' => $genre]);
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($books as &$book) {
        $book['genres'] = array_map('trim', explode(',', trim($book['genres'], '{}')));
    }

    echo json_encode($books, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при получении данных: ' . $e->getMessage()]);
}
