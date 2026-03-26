<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once 'bdd.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['titre'])) {
        echo json_encode(['success' => false, 'message' => 'Produit non spécifié']);
        exit;
    }

    $id_user = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 0; 
    $titre = $data['titre'];

    // First, find the id_produit based on the title
    $stmt_article = $bdd->prepare("SELECT id_article FROM article WHERE titre = :titre LIMIT 1");
    $stmt_article->execute([':titre' => $titre]);
    $article = $stmt_article->fetch(PDO::FETCH_ASSOC);

    if ($article) {
        $id_produit = $article['id_article'];
        
        // Delete only items 'en attente' (in cart)
        $stmt = $bdd->prepare("DELETE FROM commandes WHERE id_user = :id_user AND id_produit = :id_produit AND statut = 'en attente'");
        $stmt->execute([':id_user' => $id_user, ':id_produit' => $id_produit]);
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
