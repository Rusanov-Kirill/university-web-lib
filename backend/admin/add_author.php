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
        $name = $_POST['name'] ?? '';
        $description = $_POST['description'] ?? '';
        
        if (empty($name) || empty($description)) {
            throw new Exception('Имя и описание автора обязательны для заполнения');
        }

        $image_path = '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = __DIR__ . '/../../frontend/public/assets/';
            $dist_dir = __DIR__ . '/../../frontend/dist/assets/';
            
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }
            if (!is_dir($dist_dir)) {
                mkdir($dist_dir, 0755, true);
            }
            
            if (!is_writable($upload_dir) || !is_writable($dist_dir)) {
                throw new Exception('Папки для загрузки недоступны для записи');
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
            $file_name = 'author_' . time() . '_' . uniqid() . '.' . $file_extension;
            $public_file_path = $upload_dir . $file_name;
            $dist_file_path = $dist_dir . $file_name;
            
            if (move_uploaded_file($_FILES['image']['tmp_name'], $public_file_path)) {
                if (copy($public_file_path, $dist_file_path)) {
                    $image_path = '/assets/' . $file_name;
                    error_log("Image uploaded to both public and dist folders: $image_path");
                } else {
                    unlink($public_file_path);
                    throw new Exception('Ошибка при копировании изображения в dist папку');
                }
            } else {
                throw new Exception('Ошибка при загрузке изображения');
            }
        } else {
            $upload_error = $_FILES['image']['error'] ?? 'No file';
            throw new Exception('Изображение обязательно для загрузки. Ошибка: ' . $upload_error);
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO authors (name, description, image) 
            VALUES (:name, :description, :image)
        ");
        
        $result = $stmt->execute([
            'name' => $name,
            'description' => $description,
            'image' => $image_path
        ]);
        
        if ($result) {
            $response = [
                'success' => true, 
                'message' => 'Автор добавлен',
                'image_path' => $image_path
            ];
            echo json_encode($response);
        } else {
            throw new Exception('Ошибка при добавлении в базу данных');
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка при добавлении автора: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не разрешен']);
}
?>