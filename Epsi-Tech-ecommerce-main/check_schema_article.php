<?php
require_once 'bdd.php';
try {
    $stmt = $bdd->query("SHOW COLUMNS FROM article");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($columns);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
