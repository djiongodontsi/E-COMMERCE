<?php
require_once 'bdd.php';

try {
    $stmt = $bdd->query("SELECT titre FROM article LIMIT 5");
    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($articles);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
