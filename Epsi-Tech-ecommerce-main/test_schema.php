<?php
require_once 'bdd.php';
try {
    $stmt = $bdd->query("DESCRIBE commandes");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($columns);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
