<?php


$host = 'localhost';
$dbname = 'projet_e_commerce';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p style='color:green;'>✅ Connexion réussie à la base de données <strong>$dbname</strong></p>";



} catch (PDOException $e) {
    echo "<p style='color:red;'>❌ Erreur de connexion : " . $e->getMessage() . "</p>";
}
?>