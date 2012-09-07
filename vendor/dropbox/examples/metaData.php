<?php

require_once('bootstrap.php');

$accountInfo = $dropbox->accountInfo();

$dropboxUser = $accountInfo["body"]->display_name;

$metaData = $dropbox->metaData('/');
$fileArray = $metaData["body"]->contents;

$collection = array(
	"items" => array()
);

//var_dump(json_encode($collection));

$item = array(
	'id' => '', 
	'site_id' => 1, 
	'title' => '', 
	'user_id' => 1, 
	'description' => '', 
	'text' => null, 
	'uri' => '', 
	'attribution_uri' => null, 
	'date_created' => '', 
	'archive' => 'Dropbox', 
	'media_type' => '', 
	'layer_type' => '', 
	'thumbnail_url' => '', 
	'child_items_count' => 0, 
	'media_geo_latitude' => 0, 
	'media_geo_longitude' => 0, 
	'location' => null, 
	'media_date_created' => null, 
	'media_date_created_end' => null, 
	'media_creator_username' => '', 
	'media_creator_realname' => "Unknown", 
	'license' => null, 
	'attributes' => array(), 
	'tags' => array(), 
	'enabled' => true, 
	'published' => true,
);
$tempId = 0;
foreach ($fileArray as $fileData){
	$filename = $fileData->path;
	$mediaData = $dropbox->media($filename);
	$mediaUrl = $mediaData["body"]->url;;
	//$item["title"] = $fileData["path"];

	switch ($fileData->mime_type) {
	    case "image/gif":
	        $media_type = "Image";
	        $layer_type = "Image";
	        break;
	    case "image/jpeg":
	        $media_type = "Image";
	        $layer_type = "Image";
	        break;
	    case "image/png":
	        $media_type = "Image";
	        $layer_type = "Image";
	        break;
	    case "text/plain":
	        $media_type = "Text";
	        $layer_type = "Text";
	        break;
	    case "video/quicktime":
	        $media_type = "Video";
	        $layer_type = "Video";
	        break;
	    case "audio/mpeg":
	        $media_type = "Audio";
	        $layer_type = "Audio";
	        break;
	    default:
	        $media_type = false;
	        $layer_type = false;
	        break;
	}
	if($media_type != false){
		$item["id"] = $tempId++;
		$item["title"] = $fileData->path;
		$item["date_created"] = $fileData->client_mtime;
		$item["uri"] = $mediaData["body"]->url;
		$item["media_type"] = $media_type;
		$item["layer_type"] = $layer_type;

		$collection['items'][] = $item;
	}
	//var_dump($mediaData["body"]->url);
};
print json_encode($collection);
