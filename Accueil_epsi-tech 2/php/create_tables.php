<?php
// Script de création des tables pour projet_e_commerce

$tables_sql = [
    "role" => "CREATE TABLE IF NOT EXISTS role (
        id_role INT(11) PRIMARY KEY AUTO_INCREMENT,
        role VARCHAR(50) NOT NULL
    )",

    "client" => "CREATE TABLE IF NOT EXISTS client (
        id_client INT(11) PRIMARY KEY AUTO_INCREMENT,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        mot_de_passe VARCHAR(255) NOT NULL,
        id_role INT(11) DEFAULT 2,
        FOREIGN KEY (id_role) REFERENCES role(id_role)
    )",

    "categories" => "CREATE TABLE IF NOT EXISTS categories (
        id_categorie INT(11) PRIMARY KEY AUTO_INCREMENT,
        nom VARCHAR(100) NOT NULL
    )",

    "article" => "CREATE TABLE IF NOT EXISTS article (
        id_article INT(11) PRIMARY KEY AUTO_INCREMENT,
        titre VARCHAR(150) NOT NULL,
        image VARCHAR(255),
        nombre_exemplaire INT(11),
        nom VARCHAR(150),
        id_categorie INT(11),
        prix INT(11),
        FOREIGN KEY (id_categorie) REFERENCES categories(id_categorie)
    )",

    "panier" => "CREATE TABLE IF NOT EXISTS panier (
        id_panier INT(11) PRIMARY KEY AUTO_INCREMENT,
        id_client INT(11),
        nombre_article INT(11) DEFAULT 0,
        FOREIGN KEY (id_client) REFERENCES client(id_client)
    )",

    "commande" => "CREATE TABLE IF NOT EXISTS commande (
        id_commande INT(11) PRIMARY KEY AUTO_INCREMENT,
        id_client INT(11),
        date_commande DATE,
        statut VARCHAR(50),
        date_livraison DATE,
        prix_total INT(11),
        FOREIGN KEY (id_client) REFERENCES client(id_client)
    )",

    "platform" => "CREATE TABLE IF NOT EXISTS platform (
        id_panier INT(11),
        id_article INT(11),
        quantite INT(11),
        PRIMARY KEY (id_panier, id_article),
        FOREIGN KEY (id_panier) REFERENCES panier(id_panier),
        FOREIGN KEY (id_article) REFERENCES article(id_article)
    )",

    "page" => "CREATE TABLE IF NOT EXISTS page (
        id_payement INT(11) PRIMARY KEY AUTO_INCREMENT,
        id_commande INT(11),
        mode VARCHAR(50),
        date_payement DATE,
        heure_payement TIME,
        montant_payement INT(11),
        FOREIGN KEY (id_commande) REFERENCES commande(id_commande)
    )"
];

// Insertion des données de base
$insert_data = [
    "role" => "INSERT IGNORE INTO role (id_role, role) VALUES 
        (1, 'admin'),
        (2, 'utilisateur')",

    "categories" => "INSERT IGNORE INTO categories (id_categorie, nom) VALUES 
        (1, 'Ordinateurs Portables'),
        (2, 'Smartphones'),
        (3, 'Accessoires')"
];

try {
    $host = 'localhost';
    $dbname = 'projet_e_commerce';
    $username = 'root';
    $password = '';

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Créer les tables
    foreach ($tables_sql as $table_name => $sql) {
        $pdo->exec($sql);
        echo "✅ Table '$table_name' créée<br>";
    }

    // Insérer les données de base
    foreach ($insert_data as $table_name => $sql) {
        $pdo->exec($sql);
        echo "✅ Données de base insérées dans '$table_name'<br>";
    }

} catch (PDOException $e) {
    echo "❌ Erreur création tables : " . $e->getMessage();
}
?>