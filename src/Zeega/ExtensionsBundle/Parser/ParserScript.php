<?php

require_once("ParserService.php");

use Zeega\ExtensionsBundle\Parser\ParserService as ParserService;

$p = new ParserService("a","b");
$p::load('a','c');