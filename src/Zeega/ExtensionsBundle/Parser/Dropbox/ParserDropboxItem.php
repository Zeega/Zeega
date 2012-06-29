<?php

namespace Zeega\ExtensionsBundle\Parser\Dropbox;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;

use \DateTime;

class ParserDropboxItem extends ParserAbstract
{
	private static $license=array('','');
	
	public function load($mediaUrl, $parameters = null)
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
		    case "audio/mp3":
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

		// pre-fetch redirect URL
		$ch = curl_init($mediaUrl);
		curl_setopt($ch, CURLOPT_HEADER, true);
		curl_setopt($ch, CURLOPT_NOBODY, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		curl_close($ch);
		$header = "location: ";
		$pos = strpos($response, $header);
		$pos += strlen($header);
		$redirect_url = substr($response, $pos, strpos($response, "\r\n", $pos)-$pos) . "?dl=1";
		

		if($media_type == false){ // if this is not a supported media type
			return $this->returnResponse(null, false, false);
		}
		$item = new Item();
		$tags = array();

		$item->setTitle($mediaUrl);
		$item->setTags($tags); 
		$item->setAttributionUri($redirect_url);

		$thumbnailData = $dropbox->thumbnails($filename);
		//error_log("THUMBNAIL DATA =>",0); 
		$thumbnailData_path = $thumbnailData['meta']->path;
		$pinfo = pathinfo($thumbnailData_path);
		$newPath = "/__thumbnails__/" . $pinfo["basename"];
		$dropbox->copy($thumbnailData_path, $newPath);

		
		$thumbData = $dropbox->shares($newPath);
		$thumbUrl = $thumbData["body"]->url;


		$ch = curl_init($thumbUrl);
		curl_setopt($ch, CURLOPT_HEADER, true);
		curl_setopt($ch, CURLOPT_NOBODY, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		curl_close($ch);
		$header = "location: ";
		$pos = strpos($response, $header);
		$pos += strlen($header);
		$redirect_url = substr($response, $pos, strpos($response, "\r\n", $pos)-$pos) . "?dl=1";

		$item->setThumbnailUrl( $redirect_url );

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
