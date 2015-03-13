<?php
    spl_autoload_register(function ($class) {
        include 'classes/' . $class . '.class.php';
    });
 
	$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
    if (preg_match('/^\/api\/.+/', $path)){
    	$path_parts = explode('/', substr($path, 1));
    	$api_name = $path_parts[1].'Api';
    	$action_name = $path_parts[2];
    	$rest_of_path = implode('/', array_slice($path_parts, 3));

    	$api = new $api_name();
    	$api->$action_name($rest_of_path);
    	return true;
    } else {
    	// let server deal with it
		return false;
    }
?>