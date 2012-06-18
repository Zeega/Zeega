<?php

/**
 * Retreive the metadata for a file/folder
 * @link https://www.dropbox.com/developers/reference/api#metadata
 * @link https://github.com/BenTheDesigner/Dropbox/blob/master/Dropbox/API.php#L170-192
 */

// Require the bootstrap
require_once('bootstrap.php');

// Set the file path
// You will need to modify $path or run putFile.php first
$path = '/handsIsHiring.jpg';

$mediaData = $dropbox->media($path);
$mediaUrl = $mediaData["body"]->url;
// Dump the output
//var_dump($shareUrl);
print $mediaUrl;
//http://db.tt/aIV9rkYL