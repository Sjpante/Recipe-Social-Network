<?php
// ============================================
// 1. ΦΟΡΤΩΣΗ ΣΥΝΔΕΣΗΣ ΚΑΙ ΡΥΘΜΙΣΗ JSON
// ============================================

// require: Φορτώνει το αρχείο db_connect.php για τη σύνδεση με τη MySQL.
require 'db_connect.php';
// header(): Ορίζει τον τύπο περιεχομένου σε JSON για σωστή επικοινωνία με το front-end.
header('Content-Type: application/json; charset=utf-8');

// ============================================
// 2. ΠΡΟΕΤΟΙΜΑΣΙΑ ΠΙΝΑΚΑ ΓΙΑ ΤΙΣ ΑΝΑΡΤΗΣΕΙΣ
// ============================================

// Δημιουργούμε έναν κενό πίνακα για να αποθηκεύσουμε τα αποτελέσματα.
$posts = [];

// ============================================
// 3. SQL ΕΡΩΤΗΜΑ: ΑΝΑΚΤΗΣΗ ΑΝΑΡΤΗΣΕΩΝ ΚΑΙ ΔΗΜΙΟΥΡΓΩΝ
// ============================================

// JOIN: Συνδέει τον πίνακα posts με τον πίνακα users για να πάρουμε το όνομα του δημιουργού.
$sql = "SELECT posts.*, users.username 
        FROM posts 
        JOIN users ON posts.user_id = users.id 
        ORDER BY posts.id DESC";

$result = mysqli_query($conn, $sql);

// ============================================
// 4. ΒΡΟΧΟΣ: ΕΠΕΞΕΡΓΑΣΙΑ ΑΝΑΡΤΗΣΕΩΝ, ΣΧΟΛΙΩΝ ΚΑΙ LIKES
// ============================================

while ($row = mysqli_fetch_assoc($result)) {
    
    $post_id = $row['id'];
    $row['comments'] = [];
    
    // SQL: Ανάκτηση σχολίων για τη συγκεκριμένη ανάρτηση.
    $sql_comments = "SELECT comments.comment_text, users.username 
                     FROM comments 
                     JOIN users ON comments.user_id = users.id 
                     WHERE comments.post_id = '$post_id' 
                     ORDER BY comments.created_at ASC";
    
    $res_comments = mysqli_query($conn, $sql_comments);
    
    // Προσθήκη κάθε σχολίου στον πίνακα της ανάρτησης.
    while ($comment = mysqli_fetch_assoc($res_comments)) {
        $row['comments'][] = $comment;
    }
    
    // SQL: Καταμέτρηση των likes για την ανάρτηση.
    $sql_likes = "SELECT COUNT(*) AS total_likes 
                  FROM likes 
                  WHERE post_id = '$post_id'";
    
    $res_likes = mysqli_query($conn, $sql_likes);
    $likes_row = mysqli_fetch_assoc($res_likes);
    // Μετατροπή σε integer για καθαρότερη μορφή στο JSON.
    $row['likes'] = (int) $likes_row['total_likes'];
    
    // Προσθήκη της πλήρους ανάρτησης στον κεντρικό πίνακα.
    $posts[] = $row;
}

// ============================================
// 5. ΜΕΤΑΤΡΟΠΗ ΣΕ JSON ΚΑΙ ΑΠΟΣΤΟΛΗ
// ============================================

// json_encode: Μετατρέπει τον πίνακα της PHP σε JSON string για το front-end.
echo json_encode($posts);

// ============================================
// 6. ΚΛΕΙΣΙΜΟ ΣΥΝΔΕΣΗΣ
// ============================================

// Κλείνουμε τη σύνδεση για απελευθέρωση πόρων του server.
mysqli_close($conn);
?>