<?php
// Script pour vérifier et créer la base de données si nécessaire
$host = 'localhost';
$username = 'root';
$password = '';

try {
    // Connexion sans spécifier de base
    $pdo_temp = new PDO("mysql:host=$host", $username, $password);
    $pdo_temp->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Vérifier si la base existe
    $result = $pdo_temp->query("SHOW DATABASES LIKE 'projet_e_commerce'");

    if ($result->rowCount() == 0) {
        echo "🔧 Création de la base de données...<br>";

        // Créer la base
        $pdo_temp->exec("CREATE DATABASE projet_e_commerce CHARACTER SET utf8 COLLATE utf8_general_ci");
        $pdo_temp->exec("USE projet_e_commerce");

        // Créer les tables
        include 'create_tables.php';

        echo "✅ Base de données créée avec succès !";
    } else {
        echo "✅ Base de données existe déjà.";
    }

} catch (PDOException $e) {
    echo "❌ Erreur : " . $e->getMessage();
}
?>