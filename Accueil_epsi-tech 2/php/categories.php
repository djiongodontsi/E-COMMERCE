<?php
require_once "config.php";

header('Content-Type: application/json');

try {
    // Récupérer toutes les catégories
    $sql = "SELECT * FROM categories ORDER BY nom";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($categories);

} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur : " . $e->getMessage()]);
}
?>