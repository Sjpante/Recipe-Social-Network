<?php
require 'db_connect.php';
header('Content-Type: application/json; charset=utf-8');

// Λήψη δεδομένων από το front-end
$input = json_decode(file_get_contents('php://input'), true);

// Καθαρισμός δεδομένων για αποφυγή SQL Injection
$username = mysqli_real_escape_string($conn, $input['username']);
$email    = mysqli_real_escape_string($conn, $input['email']);
$bio      = mysqli_real_escape_string($conn, $input['bio'] ?? '');
$pass     = $input['password'];

// Κρυπτογράφηση κωδικού με χρήση του αλγόριθμου Bcrypt (PASSWORD_DEFAULT)
$hashed_password = password_hash($pass, PASSWORD_DEFAULT);

// Προετοιμασία εντολής εισαγωγής νέου χρήστη
$sql = "INSERT INTO users (username, email, password, bio)
        VALUES ('$username', '$email', '$hashed_password', '$bio')";

// Εκτέλεση και έλεγχος επιτυχίας της εγγραφής
if (mysqli_query($conn, $sql)) {
    echo json_encode(['success' => true]);
} else {
    // Αποτυχία λόγω περιορισμών βάσης (π.χ. διπλότυπο email ή username)
    echo json_encode(['success' => false, 'message' => 'Το όνομα χρήστη ή το email χρησιμοποιείται ήδη.']);
}
?>