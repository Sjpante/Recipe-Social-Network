<?php
session_start();
require 'db_connect.php';
header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true);

$recipe_id    = (int)$input['recipe_id'];
$title        = mysqli_real_escape_string($conn, $input['title']);
$desc         = mysqli_real_escape_string($conn, $input['description']);
$category     = mysqli_real_escape_string($conn, $input['category']);
$ingredients  = mysqli_real_escape_string($conn, $input['ingredients']);
$instructions = mysqli_real_escape_string($conn, $input['instructions']);
$user_id      = $_SESSION['user_id'];

$sql = "UPDATE recipes SET title='$title', description='$desc', category='$category', 
        ingredients='$ingredients', instructions='$instructions' 
        WHERE id='$recipe_id' AND user_id='$user_id'";

if (mysqli_query($conn, $sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Αποτυχία ενημέρωσης: ' . mysqli_error($conn)]);
}
?>