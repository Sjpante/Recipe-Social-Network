<?php
session_start();
require 'db_connect.php';
header('Content-Type: application/json; charset=utf-8');

// Λήψη δεδομένων από το front-end
$input = json_decode(file_get_contents('php://input'), true);

// Καθαρισμός για αποφυγή SQL Injection
$username = mysqli_real_escape_string($conn, $input['username']);
$pass     = $input['password'];

// Αναζήτηση χρήστη στη βάση
$sql    = "SELECT * FROM users WHERE username = '$username'";
$result = mysqli_query($conn, $sql);

if ($row = mysqli_fetch_assoc($result)) {

    // Επαλήθευση του hash κωδικού με το password_verify
    if (password_verify($pass, $row['password'])) {
        // Αποθήκευση στοιχείων στο session για διατήρηση σύνδεσης
        $_SESSION['user_id']  = $row['id'];
        $_SESSION['username'] = $row['username'];

        echo json_encode(['success' => true, 'username' => $row['username']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Λάθος κωδικός πρόσβασης.']);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Ο χρήστης δεν βρέθηκε.']);
}
?>