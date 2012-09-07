<?php

namespace Zeega\ExtensionsBundle\Parser\Dropbox;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\User;

use \DateTime;

class ParserDropboxSet extends ParserAbstract
{
	public function load($url, $parameters = null)
    {
		require_once('../vendor/dropbox/bootstrap.php');

		$user = $parameters["user"];

		$em = $parameters["entityManager"];
        $this->user = $user;

		$accountInfo = $dropbox->accountInfo();
		$dropboxUser = $accountInfo["body"]->display_name;
		$this->dropboxUser = $dropboxUser;

        $loadCollectionItems = $parameters["load_child_items"];

		$collection = new Item();
		$collection->setTitle("Dropbox");
		$collection->setDescription("Media from Dropbox");
		$collection->setMediaType('Collection');
	    $collection->setLayerType('Dropbox');
	    $collection->setArchive('Dropbox');
		$collection->setAttributionUri($url);
		$collection->setMediaCreatorUsername($dropboxUser);
        $collection->setMediaCreatorRealname($dropboxUser);
		$collection->setMediaDateCreated(new \DateTime());
		$collection->setUri($url);
		$itemCount = 0;

        if($loadCollectionItems)
        {
			// if collection exists
			$this->loadFolder('/', $dropbox, $collection, $dropboxUser, $itemCount);
			$this->setDeltaCursor($dropbox, $em);
			$collection->setThumbnailUrl("../images/templates/dropbox.png");
        }
        else
        {
        	$deltaCount = $this->checkForDeltas($dropbox, $em);
			$collection->setChildItemsCount($deltaCount);
			$this->setCollectionThumbnail('/', $dropbox, $collection, $dropboxUser, $itemCount);
			$collection->setThumbnailUrl("../images/templates/dropbox.png");
	    }
	    return parent::returnResponse($collection, true, true);
	}


	private function checkForDeltas($dropbox, $em)
	{
		// fetch last cursor from DB
		$dbCursor = $this->user->getDropboxDelta();
		$deltas = $dropbox->delta($dbCursor);
		$deltas_body = $deltas["body"];
		$deltas_cursor = $deltas_body->cursor;
		
		$deltas_entries = $deltas_body->entries;
		$deltas_entries_count = 0;
		$mime_types = array("image/jpg","image/jpeg","image/png","image/gif","text/plain","audio/mpeg","audio/vorbis","audio/ogg","audio/mp4","video/mp4","video/quicktime","video/mpeg","video/H264","video/H261","video/H263","video/H263-1998","video/H263-2000","video/H264-RCDO","video/H264-SVC","video/DV");
		foreach ($deltas_entries as $key => $entry) {
			$entry_data = $entry[1];
			// skip entries signifying deletes
			if( is_null($entry_data)){
				continue;
			}
			// skip directories
			if($entry_data->is_dir){
				continue;
			}
			// skip entries that don't match accepted mime types
			$entry_mime_type = $entry_data->mime_type;
			if (!in_array($entry_mime_type, $mime_types)) {
				continue;
			}
			$deltas_entries_count++;
		}
        return $deltas_entries_count;
	}
	
	private function setDeltaCursor($dropbox, $em)
	{
		// fetch last cursor from DB
		$dbCursor = $this->user->getDropboxDelta();
		$deltas = $dropbox->delta($dbCursor);
		$deltas_body = $deltas["body"];
		$deltas_cursor = $deltas_body->cursor;
		$this->user->setDropboxDelta($deltas_cursor);
    	$em->persist($this->user);
    	$em->flush();
	}

	private function fetchRedirectURL($url1)
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

	private function setCollectionThumbnail($path, $dropbox, $collection, $dropboxUser, $itemCount)
	{
    	$folderMetaData = $dropbox->metaData($path);
    	$folderItems = $folderMetaData["body"]->contents;
		$mime_types = array("image/jpg","image/jpeg","image/png","image/gif"); // using only thumbs for image types, until thumbnail server returns  useful thumbs for every type
		foreach ($folderItems as $folderItem){
			if($folderItem->is_dir){ // if this path is a directory
				$this->loadFolder($folderItem->path, $dropbox, $collection, $dropboxUser, $itemCount); // recurse function
				continue;
			}else{
				if (!in_array($folderItem->mime_type, $mime_types)) {
					continue;
				}
				$filename = $folderItem->path;
				$mediaData = $dropbox->shares($filename);
				$mediaUrl = $mediaData["body"]->url;
				$redirect_url = $this->fetchRedirectURL($mediaUrl);	
				$collection->setThumbnailUrl( $redirect_url );
				break;
			}
		}
	}

	private function loadFolder($path, $dropbox, $collection, $dropboxUser, $itemCount)
    {
    	$folderMetaData = $dropbox->metaData($path);
    	$folderItems = $folderMetaData["body"]->contents;
		foreach ($folderItems as $folderItem){
			if($folderItem->is_dir){ // if this path is a directory
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

	private function loadItem($mediaUrl, $parameters = null)
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
		
        $filePath = $fileData->path;
        
        $filePath = preg_replace("/\//","",$fileData->path,1);  // remove leading slash
        
        $pos = strrpos($filePath,".");                         // remove file extension 
        if ($pos !== false) 
        { 
            $filePath = substr($filePath, 0, $pos);
        }
        
		$item->setTitle($filePath);
		$item->setTags($tags); 
		$item->setAttributionUri($mediaUrl);
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
}