<?php
require_once __DIR__ . '/db_connection.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $stmt = $pdo->query("
        SELECT 
            g.id,
            g.title,
            COUNT(b.id) as book_count
        FROM genres g
        LEFT JOIN books b ON g.title = ANY(b.genres)
        GROUP BY g.id, g.title
        ORDER BY book_count DESC
    ");
    
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    
} catch (PDOException $e) {
    try {
        $stmt = $pdo->query("
            WITH book_genres AS (
                SELECT id, UNNEST(genres) as genre_name
                FROM books
            )
            SELECT 
                g.id,
                g.title,
                COUNT(bg.id) as book_count
            FROM genres g
            LEFT JOIN book_genres bg ON g.title = bg.genre_name
            GROUP BY g.id, g.title
            ORDER BY COUNT(bg.id) DESC
        ");
        
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        
    } catch (PDOException $e2) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Ошибка при подсчете книг',
            'details' => $e2->getMessage()
        ]);
    }
}