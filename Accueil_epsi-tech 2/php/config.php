<?php
session_start();

// Configuration de la base de données
$host = 'localhost';
$dbname = 'projet_e_commerce';
$username = 'root';
$password = '';

try {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("<div style='background: #f8d7da; color: #721c24; padding: 20px; margin: 20px; border-radius: 5px; border: 1px solid #f5c6cb;'>
        <h3>❌ Erreur Base de Données</h3>
        <p>Erreur : " . $e->getMessage() . "</p>
        <p>Vérifiez que la base 'projet_e_commerce' existe dans phpMyAdmin.</p>
    </div>");
}
?>