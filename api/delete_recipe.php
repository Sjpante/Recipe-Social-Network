<?php
session_start();
require 'db_connect.php';
$input = json_decode(file_get_contents('php://input'), true);
$recipe_id = (int)$input['recipe_id'];
$user_id = $_SESSION['user_id'];

// Διαγραφή μόνο αν ο χρήστης είναι ο δημιουργός
$sql = "DELETE FROM recipes WHERE id = '$recipe_id' AND user_id = '$user_id'";
if (mysqli_query($conn, $sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Δεν μπορείτε να διαγράψετε αυτή τη συνταγή.']);
}
?>