<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once 'bdd.php';

try {
    $id_user = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 0; 

    // Delete only items that are 'en attente' (in the cart, not paid)
    $stmt = $bdd->prepare("DELETE FROM commandes WHERE id_user = :id_user AND statut = 'en attente'");
    $stmt->execute([':id_user' => $id_user]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
