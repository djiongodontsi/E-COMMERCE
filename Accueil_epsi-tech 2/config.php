<?php
$host = 'localhost';
$dbname = 'projet_e_commerce';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "✅ Connexion à la base réussie.";
} catch (PDOException $e) {
    die("❌ Erreur de connexion : " . $e->getMessage());
}
?>