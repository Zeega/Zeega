<?php

namespace Zeega\ExtensionsBundle\Parser\Dropbox;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;

use \DateTime;

class ParserDropboxItem extends ParserAbstract
{
	private static $license=array('','Attribution-NonCommercial-ShareAlike Creative Commons','Attribution-NonCommercial Creative 		
			Commons','Attribution-NonCommercial-NoDerivs Creative Commons','Attribution Creative Commons',
			'Attribution-ShareAlike Creative Commons','Attribution-NoDerivs Creative Commons','No known copyright restrictions');
	
	public function load($mediaUrl, $parameters = null)
    {
		
		//require_once('../vendor/dropbox/bootstrap.php');
		//require_once('bootstrap.php');
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

		//$thumbnailData = $dropbox->thumbnails($filename);
		//error_log(json_encode($thumbnailData),0); 
		//$item->setThumbnailUrl( filename );
		//$item->setMediaDateCreated();
		$item->setLicense('All Rights Reserved');
		$item->setUri($redirect_url);
		$item->setChildItemsCount(0);

		$item->setMediaCreatorUsername($username);
		$item->setMediaCreatorRealname($username);

		$item->setArchive('Dropbox'); 
		$item->setMediaType($media_type);
		$item->setLayerType($layer_type);
    	//error_log("ParserDropboxItem 4", 0);
		return $this->returnResponse($item, true, false);
	}
}
