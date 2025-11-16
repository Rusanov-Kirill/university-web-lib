<?php
require_once __DIR__ . '/db_connection.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

try {
    $stmt = $pdo->query("
        SELECT 
            g.id,
            g.title,
            (
                SELECT COUNT(*) 
                FROM books 
                WHERE genres @> ARRAY[g.title]::text[]
            ) as pages
        FROM genres g
        ORDER BY g.title
    ");
    
    $genres = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($genres, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при получении жанров: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}