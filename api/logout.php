<?php
// Ενεργοποίηση της συνεδρίας για να μπορέσουμε να την διαχειριστούμε
session_start();

// Καθαρισμός όλων των μεταβλητών της συνεδρίας από τη μνήμη
session_unset();

// Διαγραφή του αρχείου συνεδρίας από τον διακομιστή
session_destroy();

// Ορισμός τύπου απάντησης σε JSON
header('Content-Type: application/json; charset=utf-8');

// Ενημέρωση του front-end για την επιτυχή ολοκλήρωση της αποσύνδεσης
echo json_encode(['success' => true]);
?>