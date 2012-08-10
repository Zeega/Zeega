<?php

/**
 * A bootstrap for the Dropbox SDK unit tests
 * @link https://github.com/BenTheDesigner/Dropbox/tree/master/tests
 */

// Restrict access to the command line
if (PHP_SAPI !== 'cli') {
	exit('setup.php must be run via the command line interface');
}

// Set error reporting
error_reporting(-1);
ini_set('display_errors', 'On');
ini_set('html_errors', 'Off');
session_start();

// Register a simple autoload function
spl_autoload_register(function($class){
	$class = str_replace('\\', '/', $class);
	require_once('../' . $class . '.php');
});

// Set your consumer key, secret and callback URL
$key      = '9ab1pg37krkg3a5';
$secret   = '7yasfh44hk9i3p5';

// Check whether to use HTTPS and set the callback URL
$protocol = (!empty($_SERVER['HTTPS'])) ? 'https' : 'http';
$callback = $protocol . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

// Instantiate the required Dropbox objects
$encrypter = new \Dropbox\OAuth\Storage\Encrypter('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
$storage = new \Dropbox\OAuth\Storage\Session($encrypter);
$OAuth = new \Dropbox\OAuth\Consumer\Curl($key, $secret, $storage, $callback);
$dropbox = new \Dropbox\API($OAuth);