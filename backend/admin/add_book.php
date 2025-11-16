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

error_log("=== ADD BOOK START ===");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        error_log("POST data: " . print_r($_POST, true));
        error_log("FILES data: " . print_r($_FILES, true));
        
        $title = $_POST['title'] ?? '';
        $author = $_POST['author'] ?? '';
        $genres_json = $_POST['genres'] ?? '[]';
        $genres = json_decode($genres_json, true) ?? [];
        
        error_log("Title: $title, Author: $author");
        error_log("Genres: " . print_r($genres, true));

        if (empty($title) || empty($author)) {
            throw new Exception('Название и автор обязательны для заполнения');
        }
        $image_path = '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            error_log("Image upload started");
            
            $upload_dir = __DIR__ . '/../../frontend/public/assets/';
            error_log("Upload dir: $upload_dir");
            
            if (!is_dir($upload_dir)) {
                error_log("Creating directory: $upload_dir");
                if (!mkdir($upload_dir, 0755, true)) {
                    throw new Exception('Не удалось создать папку для загрузки');
                }
            }
            
            if (!is_writable($upload_dir)) {
                throw new Exception('Папка для загрузки недоступна для записи');
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
            $file_path = $upload_dir . $file_name;
            
            error_log("File path: $file_path");

            if (move_uploaded_file($_FILES['image']['tmp_name'], $file_path)) {
                $image_path = '/assets/' . $file_name;
                $dist_path = __DIR__ . '/../../frontend/dist/assets/' . $file_name;
                copy($file_path, $dist_path);
                error_log("Image uploaded successfully: $image_path");
            } else {
                $error = error_get_last();
                throw new Exception('Ошибка при загрузке изображения: ' . ($error['message'] ?? 'Unknown error'));
            }
        } else {
            $upload_error = $_FILES['image']['error'] ?? 'No file';
            throw new Exception('Ошибка загрузки изображения: ' . $upload_error);
        }
        
        $genres_string = '{' . implode(',', $genres) . '}';
        error_log("Genres string for DB: $genres_string");
        
        $stmt = $pdo->prepare("
            INSERT INTO books (title, author, image, genres) 
            VALUES (:title, :author, :image, :genres)
        ");
        
        $result = $stmt->execute([
            'title' => $title,
            'author' => $author,
            'image' => $image_path,
            'genres' => $genres_string
        ]);
        
        if ($result) {
            $response = [
                'success' => true, 
                'message' => 'Книга добавлена',
                'image_path' => $image_path
            ];
            error_log("Book added successfully: " . json_encode($response));
            echo json_encode($response);
        } else {
            throw new Exception('Ошибка при добавлении в базу данных');
        }
        
    } catch (Exception $e) {
        $error_message = 'Ошибка при добавлении книги: ' . $e->getMessage();
        error_log($error_message);
        http_response_code(500);
        echo json_encode(['error' => $error_message]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не разрешен']);
}

error_log("=== ADD BOOK END ===");
?>