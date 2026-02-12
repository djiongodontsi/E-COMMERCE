<?php
// Script de création de la base de données
$host = 'localhost';
$username = 'root';
$password = '';

try {
    // Connexion sans spécifier de base de données
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Création de la base de données
    $pdo->exec("CREATE DATABASE IF NOT EXISTS project_e_commerce CHARACTER SET utf8 COLLATE utf8_general_ci");
    $pdo->exec("USE project_e_commerce");

    echo "✅ Base de données créée avec succès !";

} catch (PDOException $e) {
    die("❌ Erreur : " . $e->getMessage());
}
?>