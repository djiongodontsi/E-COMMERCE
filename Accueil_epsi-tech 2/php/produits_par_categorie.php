<?php
require_once "config.php";

header('Content-Type: application/json');

$categorie_id = $_GET['categorie_id'] ?? '';
$categorie_nom = $_GET['categorie_nom'] ?? '';

try {
    if ($categorie_id) {
        // Produits par ID de catégorie
        $sql = "SELECT a.*, c.nom as categorie_nom 
                FROM article a 
                JOIN categories c ON a.id_categorie = c.id_categorie 
                WHERE c.id_categorie = :categorie_id 
                ORDER BY a.titre";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([':categorie_id' => $categorie_id]);
    } elseif ($categorie_nom) {
        // Produits par nom de catégorie
        $sql = "SELECT a.*, c.nom as categorie_nom 
                FROM article a 
                JOIN categories c ON a.id_categorie = c.id_categorie 
                WHERE c.nom = :categorie_nom 
                ORDER BY a.titre";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([':categorie_nom' => $categorie_nom]);
    } else {
        // Tous les produits groupés par catégorie
        $sql = "SELECT a.*, c.nom as categorie_nom, c.id_categorie
                FROM article a 
                JOIN categories c ON a.id_categorie = c.id_categorie 
                ORDER BY c.nom, a.titre";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    }

    $produits = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($produits);

} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur : " . $e->getMessage()]);
}
?>