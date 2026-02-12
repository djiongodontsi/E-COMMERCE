<?php
require_once "config.php";

try {
    $sql = "SELECT * FROM categories";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "<h1>Test des catégories</h1>";
    echo "<pre>";
    print_r($categories);
    echo "</pre>";

} catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage();
}
?>