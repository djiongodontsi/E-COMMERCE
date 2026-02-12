<?php
require_once "../config.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST['email'];
    $motdepasse = $_POST['motdepasse'];

    // Vérification dans la table "client"
    $sql = "SELECT * FROM client WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":email" => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($motdepasse, $user['motdepasse'])) {
        $_SESSION['client_id'] = $user['id_client']; // ou le nom exact de ta colonne
        $_SESSION['nom'] = $user['nom'];
        header("Location: accueil.php");
        exit;
    } else {
        echo "<p style='color:red;'>Email ou mot de passe incorrect</p>";
    }
}
?>

<form method="POST">
    <label>Email :</label>
    <input type="email" name="email" required>
    <label>Mot de passe :</label>
    <input type="password" name="motdepasse" required>
    <button type="submit">Se connecter</button>
</form>