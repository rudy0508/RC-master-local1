<?php
require($_SERVER['DOCUMENT_ROOT'].'/bitrix/header.php');
?>
<h1> HOla mundo </h1>
<?php

$var = [
  "quer"=>"holaaaaaa"
];
$var_name = date('Y-m-d')." OTUZS";

define("LOG_FILENAME","/local/logs/test3.log");

//genera el log y lo envia al archivo($var= data, $var_name, $var_location)
//Bitrix\Main\Diag\Debug::writeToFile($var, $var_name);

// Muestra en pantalla el por metodo dump los datos.
Bitrix\Main\Diag\Debug::dump($var, $var_name);

echo "holaaaaaaaaaaaa";
