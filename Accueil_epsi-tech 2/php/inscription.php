<?php
// Inclusion de la connexion
require_once "../config.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nom = $_POST['nom'];
    $email = $_POST['email'];
    $motdepasse = password_hash($_POST['motdepasse'], PASSWORD_DEFAULT); // mot de passe sécurisé

    // Insertion dans la table "client"
    $sql = "INSERT INTO client (nom, email, motdepasse) VALUES (:nom, :email, :motdepasse)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":nom" => $nom,
        ":email" => $email,
        ":motdepasse" => $motdepasse
    ]);

    echo "<p>Inscription réussie ! Vous pouvez maintenant vous connecter.</p>";
}
?>

<form method="POST">
    <label>Nom :</label>
    <input type="text" name="nom" required>
    <label>Email :</label>
    <input type="email" name="email" required>
    <label>Mot de passe :</label>
    <input type="password" name="motdepasse" required>
    <button type="submit">S’inscrire</button>
</form>
$sql = "INSERT INTO client (nom, email, motdepasse) VALUES (:nom, :email, :motdepasse)";