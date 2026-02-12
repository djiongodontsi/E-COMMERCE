<?php
// Endpoint simple pour enregistrer un article de panier dans la BDD
// Reçoit JSON {titre, prix, image, quantite}
header('Content-Type: application/json; charset=utf-8');
try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['titre'])) {
        echo json_encode(['success' => false, 'message' => 'Données invalides']);
        exit;
    }

    require_once 'bdd.php'; // crée $bdd (PDO)

    // Création de la table si nécessaire
    $bdd->exec("CREATE TABLE IF NOT EXISTS panier_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(128) DEFAULT '',
        titre VARCHAR(255) NOT NULL,
        prix DECIMAL(10,2) NOT NULL DEFAULT 0,
        image VARCHAR(255) DEFAULT '',
        quantite INT NOT NULL DEFAULT 1,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    session_start();
    $session_id = session_id();

    $titre = substr($data['titre'], 0, 255);
    $prix = isset($data['prix']) ? (float)$data['prix'] : 0.0;
    $image = isset($data['image']) ? substr($data['image'], 0, 255) : '';
    $quantite = isset($data['quantite']) ? (int)$data['quantite'] : 1;

    // Insert simple — si le même titre existe pour la session, on incrémente
    $stmt = $bdd->prepare('SELECT id, quantite FROM panier_items WHERE session_id = :sid AND titre = :titre LIMIT 1');
    $stmt->execute([':sid' => $session_id, ':titre' => $titre]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        $newQ = (int)$row['quantite'] + $quantite;
        $u = $bdd->prepare('UPDATE panier_items SET quantite = :q WHERE id = :id');
        $u->execute([':q' => $newQ, ':id' => $row['id']]);
    } else {
        $ins = $bdd->prepare('INSERT INTO panier_items (session_id, titre, prix, image, quantite) VALUES (:sid, :titre, :prix, :image, :quantite)');
        $ins->execute([':sid' => $session_id, ':titre' => $titre, ':prix' => $prix, ':image' => $image, ':quantite' => $quantite]);
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
