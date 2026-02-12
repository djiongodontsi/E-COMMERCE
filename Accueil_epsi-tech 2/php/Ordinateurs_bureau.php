<?php
$host = 'localhost:3308';
$db = 'ecommerce';
$user = 'root';
$pass = '';

$categorie_cible = 'ordinateur bureau';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT titre, image, nombre_exemplaire, prix 
            FROM article 
            WHERE categorie = :categorie_cible 
            ORDER BY nombre_exemplaire DESC, titre ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':categorie_cible', $categorie_cible);
    $stmt->execute();

    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ordinateurs de Bureau</title>
    <link rel="stylesheet" href="Ordinateur_bureau.css">
</head>

<body>

    <header>
        <a href="accueil.html">
            <img src="/images/logo_epsi.png" alt="Logo" />
        </a>

        <nav>
            <ul class="un_list">
                <li><a href="/html/accueil.html">Accueil</a></li>
                <li><a href="/html/A propos.html">A propos</a></li>
                <li><a href="/html/Nous contacter.html">Nous contacter</a></li>
            </ul>
        </nav>
    </header>

    <main class="container">
        <h1>🖥️ Ordinateurs de Bureau</h1>
        <p class="intro-text">Découvrez notre sélection des meilleurs ordinateurs de bureau pour le travail, le jeu et
            l'art. Trouvez la puissance dont vous avez besoin.</p>

        <div class="produits-grille">

            <?php
            if (count($articles) > 0) {
                foreach ($articles as $article) {
                    $stock = (int) $article['nombre_exemplaire'];

                    if ($stock > 10) {
                        $stock_class = 'stock-vert';
                        $stock_message = '✅ En stock (plus de 10)';
                    } elseif ($stock > 0) {
                        $stock_class = 'stock-orange';
                        $stock_message = '⚠️ Seulement ' . $stock . ' exemplaires restants !';
                    } else {
                        $stock_class = 'stock-rouge';
                        $stock_message = '❌ Rupture de stock';
                    }

                    ?>

                    <div class="carte-produit">
                        <img src="<?php echo htmlspecialchars($article['image']); ?>"
                            alt="<?php echo htmlspecialchars($article['titre']); ?>">
                        <h3><?php echo htmlspecialchars($article['titre']); ?></h3>

                        <p class="prix"><strong><?php echo number_format($article['prix'], 2, ',', ' '); ?> €</strong></p>

                        <p class="stock-info <?php echo $stock_class; ?>">
                            <?php echo $stock_message; ?>
                        </p>

                        <?php if ($stock > 0): ?>
                            <button class="bouton-ajouter">Ajouter au panier</button>
                        <?php else: ?>
                            <button class="bouton-ajouter disabled" disabled>Précommander</button>
                        <?php endif; ?>
                    </div>

                    <?php
                }
            } else {
                echo '<p class="no-products">Désolé, aucun ordinateur de bureau n\'est disponible pour le moment.</p>';
            }
            ?>

        </div>
    </main>
    <footer>
        <p>&copy; 2025 Djiongo Dontsi Dany Brel. Tous droits réservés.</p>
    </footer>

</body>

</html>