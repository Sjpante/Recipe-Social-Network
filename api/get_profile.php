<?php
session_start();

include 'db_connect.php'; 

header('Content-Type: application/json');

// Έλεγχος αν ο χρήστης είναι συνδεδεμένος
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Μη εξουσιοδοτημένη πρόσβαση. Παρακαλώ συνδεθείτε.']);
    exit;
}

$user_id = $_SESSION['user_id'];

// SQL ερώτημα για τη λήψη των στοιχείων
$sql = "SELECT username, email, bio FROM users WHERE id = '$user_id'";
$result = mysqli_query($conn, $sql);

if ($result && mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);
    
    echo json_encode([
        'success' => true,
        'username' => $row['username'],
        'email' => $row['email'],
        'bio' => $row['bio']
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Ο χρήστης δεν βρέθηκε στη βάση δεδομένων.']);
}

mysqli_close($conn);
?>