<?php
require_once "config.php";

header('Content-Type: application/json');

try {
    // Récupérer tous les produits avec leurs catégories
    $sql = "SELECT a.*, c.nom as categorie_nom 
            FROM article a 
            LEFT JOIN categories c ON a.id_categorie = c.id_categorie 
            ORDER BY c.nom, a.titre";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $produits = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($produits);

} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur : " . $e->getMessage()]);
}
?>