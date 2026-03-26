<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once 'bdd.php';

try {
    $id_user = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 0; 
    
    // Fetch cart items by joining 'commandes' with 'article' to get title and image
    $sql = "SELECT a.titre, a.image, c.prix_unitaire as prix, c.quantite 
            FROM commandes c 
            INNER JOIN article a ON c.id_produit = a.id_article 
            WHERE c.id_user = :id_user AND c.statut = 'en attente'";
            
    $stmt = $bdd->prepare($sql);
    $stmt->execute([':id_user' => $id_user]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'items' => $items]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
