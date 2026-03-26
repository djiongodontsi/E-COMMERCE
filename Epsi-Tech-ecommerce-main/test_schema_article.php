<?php
$context = stream_context_create(['http' => ['ignore_errors' => true]]);
$result = file_get_contents('http://localhost/Accueil_epsi-tech/check_schema_article.php', false, $context);
echo "Body:\n";
echo $result;
?>
