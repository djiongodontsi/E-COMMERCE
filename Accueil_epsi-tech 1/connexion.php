<?php
require 'bdd.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: connexion.html');
    exit;
}

$email = strtolower(trim($_POST['email'] ?? ''));
$mdp = $_POST['mot_de_passe'] ?? '';

if (empty($email) || empty($mdp)) {
    header('Location: connexion.html?error=empty');
    exit;
}

$stmt = $bdd->prepare('SELECT * FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($mdp, $user['mot_de_passe'])) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_nom'] = $user['nom'];
    $_SESSION['user_prenom'] = $user['prenom'];
    $_SESSION['role'] = $user['role'];
    header('Location: catégories.html');
    exit;
} else {
    header('Location: connexion.html?error=invalid');
    exit;
}
?>
