<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once 'bdd.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['titre'])) {
        echo json_encode(['success' => false, 'message' => 'Titre du produit manquant']);
        exit;
    }

    $titre = $data['titre'];
    $quantite = isset($data['quantite']) ? (int)$data['quantite'] : 1;

    // Retrieve product ID and price from the 'article' table
    $stmt_prix = $bdd->prepare("SELECT id_article, prix FROM article WHERE titre = :titre LIMIT 1");
    $stmt_prix->execute([':titre' => $titre]);
    $article = $stmt_prix->fetch(PDO::FETCH_ASSOC);

    if (!$article) {
        echo json_encode(['success' => false, 'message' => 'Produit introuvable dans la base de données']);
        exit;
    }

    $id_produit = $article['id_article'];
    $prix_unitaire = (float)$article['prix'];
    $total = $prix_unitaire * $quantite;

    // Use a guest user ID (e.g., 0) if no user is logged in
    $id_user = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 0; 

    // Check if the item is already in the cart for this user (status 'en attente')
    $stmt_check = $bdd->prepare("SELECT id_commande, quantite FROM commandes WHERE id_user = :id_user AND id_produit = :id_produit AND statut = 'en attente' LIMIT 1");
    $stmt_check->execute([':id_user' => $id_user, ':id_produit' => $id_produit]);
    $row = $stmt_check->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        // Update quantity and total
        $new_quantite = (int)$row['quantite'] + $quantite;
        $new_total = $prix_unitaire * $new_quantite;
        
        $stmt_update = $bdd->prepare("UPDATE commandes SET quantite = :q, total = :t WHERE id_commande = :id");
        $stmt_update->execute([':q' => $new_quantite, ':t' => $new_total, ':id' => $row['id_commande']]);
    } else {
        // Insert new order row
        $stmt_insert = $bdd->prepare("INSERT INTO commandes (id_user, id_produit, quantite, prix_unitaire, total, statut) VALUES (:id_user, :id_produit, :quantite, :prix, :total, 'en attente')");
        $stmt_insert->execute([
            ':id_user' => $id_user,
            ':id_produit' => $id_produit,
            ':quantite' => $quantite,
            ':prix' => $prix_unitaire,
            ':total' => $total
        ]);
    }

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
