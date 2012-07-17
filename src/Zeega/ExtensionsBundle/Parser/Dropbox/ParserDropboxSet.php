<?php

namespace Zeega\ExtensionsBundle\Parser\Dropbox;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\User;
//use Dropbox;

use \DateTime;
//require_once('../vendor/dropbox/bootstrap.php');

class ParserDropboxSet extends ParserAbstract
{

	public function __construct()
	{
    }

	private static $license=array('','Attribution-NonCommercial-ShareAlike Creative Commons','Attribution-NonCommercial Creative 		
			Commons','Attribution-NonCommercial-NoDerivs Creative Commons','Attribution Creative Commons',
			'Attribution-ShareAlike Creative Commons','Attribution-NoDerivs Creative Commons','No known copyright restrictions');
	
	//private $itemParser;

	private $dropboxUserName = "";

	private $defaultIconAudio = "https://dl.dropbox.com/s/3xhxfzt9j5gsx3i/Audio.png?dl=1";
	private $defaultIconVideo = "https://www.dropbox.com/s/r7m0030a5xepbgx/Video.png?dl=1";
	private $defaultIconText = "https://www.dropbox.com/s/anv1gqdkc96ek5c/Text.png?dl=1";
	private $defaultIconImage = "https://dl.dropbox.com/s/1mttjeg2dluzl0i/Image.png?dl=1";
	

	public function prepThumbFolder($dropbox)
	{
    	$folderMetaData = $dropbox->metaData("/");
    	$folderItems = $folderMetaData["body"]->contents;
    	$found = 0;
		foreach ($folderItems as $folderItem){
			$filename = $folderItem->path;
			if($filename == "/__zeegaThumbnails__"){
				$found = 1;
			}
		}
		if($found == 1){
			$delete_response = $dropbox->delete("/__zeegaThumbnails__");
		}
		$dropbox->create("/__zeegaThumbnails__");
	}

	public function checkForDeltas($dropbox, $em)
	{
		// fetch last cursor from DB
		$dbCursor = $this->user->getDropboxDelta();
		$deltas = $dropbox->delta($dbCursor);
		$deltas_body = $deltas["body"];
		$deltas_cursor = $deltas_body->cursor;

		$userTable = $em->getRepository('ZeegaDataBundle:User')->findOneById($this->user->getId());
		$this->user->setDropboxDelta($deltas_cursor);
		//$this->user->setDropboxDelta($deltas_cursor);
    	$em->persist($this->user);
    	$em->flush();

		$deltas_entries = $deltas_body->entries;
		$deltas_entries_count = count($deltas_entries);
		$deltas_reset = $deltas_body->reset;
        return $deltas_entries_count;
	}

	public function fetchRedirectURL($url1)
	{  // fetch redirected URL
		$ch = curl_init($url1);
		curl_setopt($ch, CURLOPT_HEADER, true);
		curl_setopt($ch, CURLOPT_NOBODY, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		curl_close($ch);
		$header = "location: ";
		$pos = strpos($response, $header);
		$pos += strlen($header);
		$url2 = substr($response, $pos, strpos($response, "\r\n", $pos)-$pos) . "?dl=1";
		return $url2;
	}

	public function loadFolder($path, $dropbox, $collection, $dropboxUser, $itemCount)
    {
    	$folderMetaData = $dropbox->metaData($path);
    	$folderItems = $folderMetaData["body"]->contents;
		foreach ($folderItems as $folderItem){
			if($folderItem->is_dir){ // if this path is a directory
				if($folderItem->path == "/__zeegaThumbnails__"){ // and it's not the thumbnails directory
					continue;
				}
				if($folderItem->path == "/__ZeegaDefaultThumbnails__"){ // and it's not the default thumbnails directory
					continue;
				}
				$this->loadFolder($folderItem->path, $dropbox, $collection, $dropboxUser, $itemCount); // recurse function
				continue;
			}else{
				$filename = $folderItem->path;
				$mediaData = $dropbox->shares($filename);
				$mediaUrl = $mediaData["body"]->url;
				//$item = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findOneBy(array("attribution_uri" => $parsedItem["attribution_uri"], "enabled" => 1));
				$item = $this->loadItem($mediaUrl, array("dropbox" => $dropbox, "filename" => $filename, "fileData" => $folderItem, "username" => $dropboxUser));
				// this is a hack, more efficient to apply only once
				// does not cover the case where folder contains no images
				if ($item["items"]->getMediaType() == "Image") {
					$collection->setThumbnailUrl( $item["items"]->getThumbnailUrl() );
				}
				$collection->addItem($item["items"]);
				$itemCount++;
				$collection->setChildItemsCount($itemCount);
			}
		}
		return $itemCount;
    }


	public function loadItem($mediaUrl, $parameters = null)
    {
		$fileData = $parameters["fileData"];
		$username = $parameters["username"];
		$filename = $parameters["filename"];
		$dropbox = $parameters["dropbox"];

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
		    case "video/mp4":
		        $media_type = "Video";
		        $layer_type = "Video";
		        break;
		    case "audio/mp4":
		        $media_type = "Audio";
		        $layer_type = "Audio";
		        break;
		    case "audio/mp3":
		        $media_type = "Audio";
		        $layer_type = "Audio";
		        break;
		    case "audio/mpeg":
		        $media_type = "Audio";
		        $layer_type = "Audio";
		        break;
		    default:
				$item = new Item();
		    	return $this->returnResponse($item, true, false);
		        //$media_type = false;
		        //$layer_type = false;
		        break;
		}

		/*
		Appending "?dl=1" to the permanent URL makes it directly downloadable (as opposed to embedded in Dropbox's viewer)
		But the /shares API call gives us a short URL that redirects at Dropbox.
		So to get a stable, direct URL, we have to pre-fetch the long post-redirect URL and append "?dl=1"
		*/
		$redirect_url = $this->fetchRedirectURL($mediaUrl);

		if($media_type == false){ // if this is not a supported media type
			return $this->returnResponse(null, false, false);
		}
		$item = new Item();
		$tags = array();

		$item->setTitle($fileData->path);
		$item->setTags($tags); 
		$item->setAttributionUri($redirect_url);

		switch ($media_type){
			case "Image":
				//$item->setThumbnailUrl( "https://dl.dropbox.com/s/1mttjeg2dluzl0i/Image.png?dl=1" );
				$thumbnailData = $dropbox->thumbnails($filename);
				$thumbnailData_path = $thumbnailData['meta']->path;
				$pinfo = pathinfo($thumbnailData_path);
				$newPath = "/__zeegaThumbnails__/" . $pinfo["basename"];
				$dropbox->copy($thumbnailData_path, $newPath);
				$thumbData = $dropbox->shares($newPath);
				$thumbUrl = $thumbData["body"]->url;
				$redirect_url = $this->fetchRedirectURL($thumbUrl);
				$item->setThumbnailUrl( $redirect_url );
				break;
			case "Text":
				$item->setThumbnailUrl( "https://www.dropbox.com/s/anv1gqdkc96ek5c/Text.png?dl=1" );
				//$item->setThumbnailUrl( $this->$defaultIconText );
				break;
			case "Video":
				$item->setThumbnailUrl( "https://dl.dropbox.com/s/q5et7g8raziwkpk/video.jpg?dl=1" );
				//$item->setThumbnailUrl($parameters['hostname'].$parameters['directory'].'images/templates/video.jpg');
				break;
			case "Audio":
				$item->setThumbnailUrl( "https://dl.dropbox.com/sh/3ykw078h8sr8veh/CD0Fy8pB8T/audio.jpg?dl=1" );
				//$item->setThumbnailUrl($parameters['hostname'].$parameters['directory'].'images/templates/audio.jpg');
				break;
		}
		$item->setLicense('All Rights Reserved');
		$item->setUri($redirect_url);
		$item->setChildItemsCount(0);

		$item->setMediaCreatorUsername($username);
		$item->setMediaCreatorRealname($username);

		$item->setArchive('Dropbox'); 
		$item->setMediaType($media_type);
		$item->setLayerType($layer_type);

		return $this->returnResponse($item, true, false);
    }


	public function load($url, $parameters = null)
    {
        //error_log("ParserDropboxSet ZERO parse", 0);
		require_once('../vendor/dropbox/bootstrap.php');
        //$this->dropbox = $dropbox;

		$user = $parameters["user"];

		$em = $parameters["entityManager"];
        $this->user = $user;

		$accountInfo = $dropbox->accountInfo();
		$dropboxUser = $accountInfo["body"]->display_name;
		$this->dropboxUser = $dropboxUser;

        $loadCollectionItems = $parameters["load_child_items"];

		$collection = new Item();
		$collection->setTitle("Dropbox");
		$collection->setDescription("test collection for Dropbox");
		$collection->setMediaType('Collection');
	    $collection->setLayerType('Dropbox');
		$collection->setAttributionUri($url);
		$collection->setMediaCreatorUsername($dropboxUser);
        $collection->setMediaCreatorRealname($dropboxUser);
		$collection->setMediaDateCreated(new \DateTime());
		$collection->setUri($url);
		$itemCount = 0;

        if($loadCollectionItems){
			// if collection exists
			$this->prepThumbFolder($dropbox);
			$this->loadFolder('/', $dropbox, $collection, $dropboxUser, $itemCount);
			return parent::returnResponse($collection, true, true);
        }else{
        	$deltaCount = $this->checkForDeltas($dropbox, $em);
        	//error_log("ParserDropboxSet deltas " . $deltaCount, 0);
			$collection->setChildItemsCount($deltaCount);
			//$this->loadFolder('/', $dropbox, $collection, $dropboxUser, $deltaCount);
			return parent::returnResponse($collection, true, true);
	    }
	}
}
