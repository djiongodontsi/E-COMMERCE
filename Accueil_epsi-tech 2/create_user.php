<?php
require_once "config.php";

$email = "test@example.com";
$motdepasse = "abcd1234";

$hash = password_hash($motdepasse, PASSWORD_DEFAULT);

$sql = "INSERT INTO client (nom, prenom, email, mot_de_passe) VALUES ('User', 'Test', :email, :mot_de_passe)";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':email' => $email,
    ':mot_de_passe' => $hash
]);

echo "Utilisateur créé : $email<br>";
echo "Mot de passe en clair : $motdepasse<br>";
echo "Hash : $hash";
