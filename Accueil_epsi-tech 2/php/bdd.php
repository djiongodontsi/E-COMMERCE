<?php

try {
    $bdd = new PDO('mysql:host=localhost;port=3306;dbname=news', 'root', '');
    // echo "Connexion réussie";
} catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}

?>