<?php

ini_set('display_errors',1);
error_reporting(E_ALL | E_STRICT );
date_default_timezone_set('America/Sao_Paulo');

define('DS', DIRECTORY_SEPARATOR);
define('APP_ROOT', realpath(__DIR__.DS.'..'));


$composer_autoload = APP_ROOT.DS.'vendor'.DS.'autoload.php';
if(!file_exists($composer_autoload)){
    die('Please, fucking install composer, http://getcomposer.org');
}
require $composer_autoload;

/**
 * Carrega todas as classes do Slim e do system
 */
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

//GET route
$app->get('/wines', function () {
   	$wines	= array(
   			 'id'=>1
            ,'name'=> "CHATEAU DE SAINT COSME"
            ,'year'=> "2009"
            ,'grapes'=> "Grenache / Syrah"
            ,'country'=> "France"
            ,'region'=> "Southern Rhone"
            ,'description'=> "The aromas of fruit and spice give one a hint of the light drinkability of this lovely wine, which makes an excellent complement to fish dishes."
            ,'picture'=> "saint_cosme.jpg"
        );
    echo json_encode($wines);
});

//POST route
$app->post('/', function () {
   echo "POST";
});

//PUT route
$app->put('/', function () {
   echo "PUT";
});

//DELETE route
$app->delete('/', function () {
   echo "DELETE";
});

$app->run();
