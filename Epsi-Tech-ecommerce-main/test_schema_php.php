<?php
$context = stream_context_create(['http' => ['ignore_errors' => true]]);
$result = file_get_contents('http://localhost/Accueil_epsi-tech/check_schema_web.php', false, $context);
echo "Headers:\n";
print_r($http_response_header);
echo "\nBody:\n";
echo $result;
?>
