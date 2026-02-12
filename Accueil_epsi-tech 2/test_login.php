<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once "config.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $mot_de_passe = $_POST['mot_de_passe'];

    $sql = "SELECT * FROM client WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo "<p>Utilisateur trouvé : <strong>{$user['email']}</strong></p>";
        echo "<p>Hash enregistré : <code>{$user['mot_de_passe']}</code></p>";

        if (password_verify($mot_de_passe, $user['mot_de_passe'])) {
            echo "<p style='color:green;'>✅ Connexion réussie ! Mot de passe correct.</p>";
        } else {
            echo "<p style='color:red;'>❌ Mot de passe incorrect.</p>";
        }
    } else {
        echo "<p style='color:red;'>❌ Aucun utilisateur trouvé avec cet email.</p>";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Test connexion</title>
</head>

<body>
    <h2>Test de connexion</h2>
    <form method="POST">
        <input type="email" name="email" placeholder="Votre email" required><br><br>
        <input type="password" name="mot_de_passe" placeholder="Votre mot de passe" required><br><br>
        <button type="submit">Se connecter</button>
    </form>
</body>

</html>