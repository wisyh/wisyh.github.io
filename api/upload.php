<?php
// upload.php - DANGEROUS: No validation, no limits, no security
// DO NOT USE IN PRODUCTION

header('Content-Type: application/json');

// Disable PHP upload limits (if server config allows)
ini_set('upload_max_filesize', '0');
ini_set('post_max_size', '0');
ini_set('max_file_uploads', '0');
ini_set('memory_limit', '-1');
set_time_limit(0);

// CORS headers (adjust for your domain)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Create upload directory
$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Handle multipart/form-data uploads
if (!empty($_FILES)) {
    $results = [];
    
    foreach ($_FILES as $key => $file) {
        // Handle array of files
        if (is_array($file['name'])) {
            for ($i = 0; $i < count($file['name']); $i++) {
                if ($file['error'][$i] === UPLOAD_ERR_OK) {
                    $filename = basename($file['name'][$i]);
                    $targetPath = $uploadDir . uniqid() . '_' . $filename;
                    
                    if (move_uploaded_file($file['tmp_name'][$i], $targetPath)) {
                        $results[] = [
                            'success' => true,
                            'original_name' => $filename,
                            'saved_as' => basename($targetPath),
                            'size' => filesize($targetPath),
                            'path' => $targetPath
                        ];
                    } else {
                        $results[] = ['success' => false, 'error' => 'Move failed', 'file' => $filename];
                    }
                } else {
                    $results[] = ['success' => false, 'error' => uploadErrorMessage($file['error'][$i]), 'file' => $file['name'][$i]];
                }
            }
        } else {
            // Single file
            if ($file['error'] === UPLOAD_ERR_OK) {
                $filename = basename($file['name']);
                $targetPath = $uploadDir . uniqid() . '_' . $filename;
                
                if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                    $results[] = [
                        'success' => true,
                        'original_name' => $filename,
                        'saved_as' => basename($targetPath),
                        'size' => filesize($targetPath),
                        'path' => $targetPath
                    ];
                } else {
                    $results[] = ['success' => false, 'error' => 'Move failed', 'file' => $filename];
                }
            } else {
                $results[] = ['success' => false, 'error' => uploadErrorMessage($file['error'])];
            }
        }
    }
    
    echo json_encode(['files' => $results]);
    exit;
}

// Handle raw binary upload (PUT/POST with raw body)
$input = fopen('php://input', 'r');
$targetPath = $uploadDir . uniqid() . '_raw_upload';
$target = fopen($targetPath, 'w');

// Stream large files without memory limits
while (!feof($input)) {
    fwrite($target, fread($input, 8192));
}

fclose($input);
fclose($target);

echo json_encode([
    'success' => true,
    'saved_as' => basename($targetPath),
    'size' => filesize($targetPath),
    'path' => $targetPath
]);

function uploadErrorMessage($code) {
    return match($code) {
        UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize',
        UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE',
        UPLOAD_ERR_PARTIAL => 'Partial upload',
        UPLOAD_ERR_NO_FILE => 'No file uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temp folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write',
        UPLOAD_ERR_EXTENSION => 'Upload stopped by extension',
        default => 'Unknown error'
    };
}
?>