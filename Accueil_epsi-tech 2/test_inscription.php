<?php
require_once "config.php";

$email_test = "testuser_" . time() . "@example.com";
$password = "1234";
$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $pdo->prepare("INSERT INTO client (nom, prenom, email, mot_de_passe, id_role) VALUES (?, ?, ?, ?, 1)");
$stmt->execute(["Test", "User", $email_test, $hash]);

echo "Utilisateur de test créé : <br>Email : $email_test <br>Mot de passe : $password<br>";
?>