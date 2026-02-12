<?php
// Paramètres de connexion
$host = "localhost";         // Serveur MySQL
$dbname = "projet_e_commerce";  // Nom de la base de données
$username = "root";          // Identifiant par défaut (si WAMP/XAMPP)
$password = "";              // Mot de passe (vide par défaut)

// Connexion à MySQL avec PDO
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "✅ Connexion réussie à la base de données";
} catch (PDOException $e) {
    die("❌ Erreur de connexion : " . $e->getMessage());
}
?>