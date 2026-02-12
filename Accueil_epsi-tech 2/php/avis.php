<?php
session_start();
header('Content-Type: application/json');

// Configuration de la base de données
$config = [
    'host' => 'localhost',
    'dbname' => 'techsphere',
    'username' => 'root',
    'password' => ''
];

// Fonction pour se connecter à la BDD
function getPDO()
{
    global $config;
    try {
        $pdo = new PDO(
            "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8",
            $config['username'],
            $config['password']
        );
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Erreur connexion BDD: " . $e->getMessage());
        return null;
    }
}

// Fonction pour envoyer une réponse JSON
function sendResponse($success, $message, $data = [])
{
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Fonction pour valider les données
function validateAvisData($data)
{
    $errors = [];

    // Validation ID client
    if (empty($data['id_client']) || !filter_var($data['id_client'], FILTER_VALIDATE_INT)) {
        $errors[] = "ID client invalide";
    }

    // Validation ID article
    if (empty($data['id_article']) || !filter_var($data['id_article'], FILTER_VALIDATE_INT)) {
        $errors[] = "Veuillez sélectionner un produit";
    }

    // Validation note
    if (empty($data['note']) || !filter_var($data['note'], FILTER_VALIDATE_INT)) {
        $errors[] = "Veuillez donner une note";
    } elseif ($data['note'] < 1 || $data['note'] > 5) {
        $errors[] = "La note doit être entre 1 et 5 étoiles";
    }

    // Validation commentaire
    if (!empty($data['commentaire']) && strlen($data['commentaire']) > 500) {
        $errors[] = "Le commentaire ne peut pas dépasser 500 caractères";
    }

    return $errors;
}

// Traitement des différentes actions
$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'add':
        addAvis();
        break;
    case 'get':
        getAvis();
        break;
    case 'get_user_avis':
        getUserAvis();
        break;
    default:
        // Si pas d'action spécifiée, on suppose l'ajout d'avis (pour compatibilité)
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            addAvis();
        } else {
            getAvis();
        }
}

// Fonction pour ajouter un avis
function addAvis()
{
    // Vérifier la méthode
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse(false, 'Méthode non autorisée');
    }

    // Récupération et nettoyage des données
    $id_client = filter_input(INPUT_POST, 'id_client', FILTER_VALIDATE_INT);
    $id_article = filter_input(INPUT_POST, 'id_article', FILTER_VALIDATE_INT);
    $note = filter_input(INPUT_POST, 'note', FILTER_VALIDATE_INT);
    $commentaire = filter_input(INPUT_POST, 'commentaire', FILTER_SANITIZE_SPECIAL_CHARS);

    $data = [
        'id_client' => $id_client,
        'id_article' => $id_article,
        'note' => $note,
        'commentaire' => $commentaire
    ];

    // Validation des données
    $errors = validateAvisData($data);
    if (!empty($errors)) {
        sendResponse(false, $errors[0]);
    }

    $pdo = getPDO();
    if (!$pdo) {
        sendResponse(false, 'Erreur de connexion à la base de données');
    }

    try {
        // Vérifier si l'utilisateur a déjà donné un avis pour ce produit
        $checkStmt = $pdo->prepare("
            SELECT id_avis 
            FROM avis 
            WHERE id_client = ? AND id_article = ?
        ");
        $checkStmt->execute([$data['id_client'], $data['id_article']]);

        if ($checkStmt->fetch()) {
            sendResponse(false, 'Vous avez déjà donné votre avis pour ce produit');
        }

        // Vérifier que l'article existe
        $articleStmt = $pdo->prepare("SELECT id_article FROM article WHERE id_article = ?");
        $articleStmt->execute([$data['id_article']]);
        if (!$articleStmt->fetch()) {
            sendResponse(false, 'Produit non trouvé');
        }

        // Insertion de l'avis
        $insertStmt = $pdo->prepare("
            INSERT INTO avis (id_client, id_article, note, commentaire, statut, date_avis) 
            VALUES (?, ?, ?, ?, 'en_attente', NOW())
        ");

        $insertStmt->execute([
            $data['id_client'],
            $data['id_article'],
            $data['note'],
            $data['commentaire']
        ]);

        // Récupérer les infos pour la réponse
        $avisId = $pdo->lastInsertId();

        sendResponse(
            true,
            '✅ Votre avis a été enregistré avec succès ! Il sera visible après modération.',
            ['id_avis' => $avisId]
        );

    } catch (PDOException $e) {
        error_log("Erreur lors de l'ajout d'avis: " . $e->getMessage());
        sendResponse(false, 'Erreur lors de l\'enregistrement de l\'avis');
    }
}

// Fonction pour récupérer les avis
function getAvis()
{
    $pdo = getPDO();
    if (!$pdo) {
        sendResponse(false, 'Erreur de connexion à la base de données');
    }

    // Paramètres de filtrage
    $limit = filter_input(INPUT_GET, 'limit', FILTER_VALIDATE_INT) ?? 10;
    $offset = filter_input(INPUT_GET, 'offset', FILTER_VALIDATE_INT) ?? 0;
    $minRating = filter_input(INPUT_GET, 'min_rating', FILTER_VALIDATE_INT) ?? 1;
    $id_article = filter_input(INPUT_GET, 'id_article', FILTER_VALIDATE_INT);

    try {
        // Construction de la requête
        $sql = "
            SELECT 
                a.id_avis,
                a.note,
                a.commentaire,
                a.date_avis,
                a.statut,
                c.id_client,
                CONCAT(c.prenom, ' ', LEFT(c.nom, 1), '.') as nom_client,
                ar.id_article,
                ar.titre as nom_article
            FROM avis a
            JOIN client c ON a.id_client = c.id_client
            JOIN article ar ON a.id_article = ar.id_article
            WHERE a.statut = 'approuve'
            AND a.note >= ?
        ";

        $params = [$minRating];

        // Filtre par article si spécifié
        if ($id_article) {
            $sql .= " AND a.id_article = ?";
            $params[] = $id_article;
        }

        $sql .= " ORDER BY a.date_avis DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $avis = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Compter le nombre total d'avis (pour la pagination)
        $countSql = "
            SELECT COUNT(*) as total 
            FROM avis a 
            WHERE a.statut = 'approuve'
            AND a.note >= ?
        ";

        $countParams = [$minRating];
        if ($id_article) {
            $countSql .= " AND a.id_article = ?";
            $countParams[] = $id_article;
        }

        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute($countParams);
        $total = $countStmt->fetchColumn();

        sendResponse(true, 'Avis récupérés avec succès', [
            'avis' => $avis,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset
        ]);

    } catch (PDOException $e) {
        error_log("Erreur lors de la récupération des avis: " . $e->getMessage());
        sendResponse(false, 'Erreur lors du chargement des avis');
    }
}

// Fonction pour récupérer les avis d'un utilisateur
function getUserAvis()
{
    $id_client = filter_input(INPUT_GET, 'id_client', FILTER_VALIDATE_INT);

    if (!$id_client) {
        sendResponse(false, 'ID client requis');
    }

    $pdo = getPDO();
    if (!$pdo) {
        sendResponse(false, 'Erreur de connexion à la base de données');
    }

    try {
        $stmt = $pdo->prepare("
            SELECT 
                a.id_avis,
                a.note,
                a.commentaire,
                a.date_avis,
                a.statut,
                ar.titre as nom_article,
                ar.id_article
            FROM avis a
            JOIN article ar ON a.id_article = ar.id_article
            WHERE a.id_client = ?
            ORDER BY a.date_avis DESC
        ");

        $stmt->execute([$id_client]);
        $avis = $stmt->fetchAll(PDO::FETCH_ASSOC);

        sendResponse(true, 'Avis utilisateur récupérés', ['avis' => $avis]);

    } catch (PDOException $e) {
        error_log("Erreur lors de la récupération des avis utilisateur: " . $e->getMessage());
        sendResponse(false, 'Erreur lors du chargement de vos avis');
    }
}
?>