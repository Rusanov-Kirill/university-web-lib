<?php
require_once __DIR__ . '/../db_connection.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $id = $_POST['id'] ?? '';
        $title = $_POST['title'] ?? '';
        $author = $_POST['author'] ?? '';
        $genres_json = $_POST['genres'] ?? '[]';
        $genres = json_decode($genres_json, true) ?? [];
        
        if (empty($id)) {
            throw new Exception('ID книги обязателен');
        }

        $stmt = $pdo->prepare("SELECT image FROM books WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $current_book = $stmt->fetch();
        
        $image_path = $current_book['image'] ?? '';
        
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = __DIR__ . '/../../frontend/public/assets/';
            $dist_dir = __DIR__ . '/../../frontend/dist/assets/';
            
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }
            if (!is_dir($dist_dir)) {
                mkdir($dist_dir, 0755, true);
            }

            if ($image_path) {
                $old_public_path = __DIR__ . '/../../frontend/public' . $image_path;
                $old_dist_path = __DIR__ . '/../../frontend/dist' . $image_path;
                
                if (file_exists($old_public_path)) {
                    unlink($old_public_path);
                }
                if (file_exists($old_dist_path)) {
                    unlink($old_dist_path);
                }
            }

            $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            $file_type = $_FILES['image']['type'];
            if (!in_array($file_type, $allowed_types)) {
                throw new Exception('Недопустимый тип файла. Разрешены: JPEG, PNG, GIF, WebP');
            }

            if ($_FILES['image']['size'] > 5 * 1024 * 1024) {
                throw new Exception('Размер файла не должен превышать 5MB');
            }

            $file_extension = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
            $file_name = 'book_' . time() . '_' . uniqid() . '.' . $file_extension;
            $public_file_path = $upload_dir . $file_name;
            $dist_file_path = $dist_dir . $file_name;
            
            if (move_uploaded_file($_FILES['image']['tmp_name'], $public_file_path)) {
                if (copy($public_file_path, $dist_file_path)) {
                    $image_path = '/assets/' . $file_name;
                    error_log("Book image updated in both public and dist folders: $image_path");
                } else {
                    unlink($public_file_path);
                    throw new Exception('Ошибка при копировании изображения в dist папку');
                }
            } else {
                throw new Exception('Ошибка при загрузке изображения');
            }
        }
        
        $genres_string = '{' . implode(',', $genres) . '}';
        
        $stmt = $pdo->prepare("
            UPDATE books 
            SET title = :title, author = :author, image = :image, genres = :genres 
            WHERE id = :id
        ");
        
        $result = $stmt->execute([
            'id' => $id,
            'title' => $title,
            'author' => $author,
            'image' => $image_path,
            'genres' => $genres_string
        ]);
        
        if ($result) {
            $response = [
                'success' => true, 
                'message' => 'Книга обновлена',
                'image_path' => $image_path
            ];
            echo json_encode($response);
        } else {
            throw new Exception('Ошибка при обновлении базы данных');
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка при обновлении книги: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не разрешен']);
}
?>