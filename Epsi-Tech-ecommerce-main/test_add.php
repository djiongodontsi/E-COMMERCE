<?php
$url = 'http://localhost/Accueil_epsi-tech/ajout_panier.php';
$data = json_encode(['titre' => 'Test PC', 'quantite' => 1]);

$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => $data,
        'ignore_errors' => true
    ]
];
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === FALSE) {
    echo "Error fetching URL\n";
} else {
    echo "Result:\n$result\n";
    echo "Headers:\n";
    print_r($http_response_header);
}
?>
