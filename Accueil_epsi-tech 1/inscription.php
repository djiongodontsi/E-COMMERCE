<?php
include('bdd.php');

if (isset($_POST['nom'])) {
    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $email = $_POST['email'];
    $mdp = password_hash($_POST['mot_de_passe'], PASSWORD_DEFAULT); // hachage du mot de passe

    try {
        $insert = $bdd->prepare("INSERT INTO users(nom, prenom, email, mot_de_passe) VALUES(?, ?, ?, ?)");
        $insert->execute([$nom, $prenom, $email, $mdp]);
        header("Location: catégories.html");
        exit;
    } catch (Exception $e) {
        echo "Erreur SQL : " . $e->getMessage();
    }
} else {
    echo "Erreur lors de l'inscription.";
}
?>
