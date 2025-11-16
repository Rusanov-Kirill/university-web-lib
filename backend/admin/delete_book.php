<?php
require_once __DIR__ . '/../db_connection.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? '';
    
    try {
        $stmt = $pdo->prepare("SELECT image FROM books WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $book = $stmt->fetch();

        if ($book && $book['image']) {
            $public_image_path = __DIR__ . '/../../frontend/public' . $book['image'];
            $dist_image_path = __DIR__ . '/../../frontend/dist' . $book['image'];
            
            if (file_exists($public_image_path)) {
                unlink($public_image_path);
            }
            if (file_exists($dist_image_path)) {
                unlink($dist_image_path);
            }
        }

        $stmt = $pdo->prepare("DELETE FROM books WHERE id = :id");
        $stmt->execute(['id' => $id]);
        
        echo json_encode(['success' => true, 'message' => 'Книга удалена']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка при удалении книги: ' . $e->getMessage()]);
    }
}
?>