<?php
session_start();
require 'db_connect.php';
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

// ====================================================
// ΠΕΡΙΠΤΩΣΗ Α: GET REQUEST (Η JavaScript ζητάει τις συνταγές)
// ====================================================
if ($method === 'GET') {
    $recipes = [];

    // Φέρνουμε τις συνταγές μαζί με το όνομα του δημιουργού τους
    $sql = "SELECT recipes.*, users.username 
            FROM recipes 
            JOIN users ON recipes.user_id = users.id 
            ORDER BY recipes.id DESC";

    $result = mysqli_query($conn, $sql);

    while ($row = mysqli_fetch_assoc($result)) {
        $recipe_id = $row['id'];
        $row['comments'] = [];
        
        // Φέρνουμε τα σχόλια για τη συγκεκριμένη συνταγή
        $sql_comments = "SELECT comments.comment_text, users.username 
                         FROM comments 
                         JOIN users ON comments.user_id = users.id 
                         WHERE comments.recipe_id = '$recipe_id' 
                         ORDER BY comments.created_at ASC";
        
        $res_comments = mysqli_query($conn, $sql_comments);
        while ($comment = mysqli_fetch_assoc($res_comments)) {
            $row['comments'][] = $comment;
        }
        
        // Μετράμε τα likes της συνταγής
        $sql_likes = "SELECT COUNT(*) AS total_likes FROM likes WHERE recipe_id = '$recipe_id'";
        $res_likes = mysqli_query($conn, $sql_likes);
        $likes_row = mysqli_fetch_assoc($res_likes);
        $row['likes'] = (int) $likes_row['total_likes'];
        
        $recipes[] = $row;
    }

    echo json_encode($recipes);
    mysqli_close($conn);
    exit;
}

// ====================================================
// ΠΕΡΙΠΤΩΣΗ Β: POST REQUEST (Η JavaScript στέλνει νέα συνταγή)
// ====================================================
if ($method === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Πρέπει να συνδεθείτε.']);
        exit;
    }

    // Καθαρισμός και λήψη δεδομένων από το FormData της JS
    $title        = mysqli_real_escape_string($conn, $_POST['title']); 
    $desc         = mysqli_real_escape_string($conn, $_POST['description']);
    $category     = mysqli_real_escape_string($conn, $_POST['category']);
    $ingredients  = mysqli_real_escape_string($conn, $_POST['ingredients']);
    $instructions = mysqli_real_escape_string($conn, $_POST['instructions']);
    $user_id      = $_SESSION['user_id'];

    // Διαχείριση ανεβάσματος εικόνας
    $imageName = "";
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $imageName = time() . '_' . basename($_FILES['image']['name']);
        $destPath  = '../uploads/' . $imageName;
        move_uploaded_file($_FILES['image']['tmp_name'], $destPath);
    }

    // Εισαγωγή στη βάση με τα νέα ονόματα στηλών
    $sql = "INSERT INTO recipes (user_id, title, description, ingredients, instructions, category, image_path) 
        VALUES ('$user_id', '$title', '$desc', '$ingredients', '$instructions', '$category', '$imageName')";

    if (mysqli_query($conn, $sql)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Σφάλμα βάσης: ' . mysqli_error($conn)]);
    }

    mysqli_close($conn);
    exit;
}
?>