<?php
session_start();
require 'db_connect.php';
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Πρέπει να συνδεθείτε για να σχολιάσετε.']);
    exit;
}

// Διαβάζουμε το JSON input από το fetch της JS
$input     = json_decode(file_get_contents('php://input'), true);
$recipe_id = mysqli_real_escape_string($conn, $input['recipe_id']);
$text      = mysqli_real_escape_string($conn, $input['comment_text']);
$user_id   = $_SESSION['user_id'];

// Εισαγωγή σχολίου με βάση το σωστό recipe_id
$sql = "INSERT INTO comments (user_id, recipe_id, comment_text) 
        VALUES ('$user_id', '$recipe_id', '$text')";

if (mysqli_query($conn, $sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Σφάλμα κατά την αποθήκευση του σχολίου: ' . mysqli_error($conn)]);
}

mysqli_close($conn);
?>