<?php
session_start();
require 'db_connect.php';
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Πρέπει να είστε μέλος για να κάνετε like!']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

// ΠΡΟΣΟΧΗ: Χρησιμοποιούμε 'recipe_id' αντί για 'post_id'
$recipe_id = (int) $input['recipe_id']; 
$user_id   = $_SESSION['user_id'];

// Εισαγωγή στη στήλη recipe_id
$sql = "INSERT INTO likes (user_id, recipe_id) VALUES ('$user_id', '$recipe_id')";

if (mysqli_query($conn, $sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Έχετε ήδη κάνει like σε αυτή τη συνταγή.']);
}
?>