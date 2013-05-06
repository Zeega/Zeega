<?php

namespace Zeega\IngestionBundle\Parser\Facebook;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Document\Item;

use \DateTime;


class ParserFacebookPhoto extends ParserAbstract
{
	private static $license=array('','Attribution-NonCommercial-ShareAlike Creative Commons','Attribution-NonCommercial Creative 		
			Commons','Attribution-NonCommercial-NoDerivs Creative Commons','Attribution Creative Commons',
			'Attribution-ShareAlike Creative Commons','Attribution-NoDerivs Creative Commons','No known copyright restrictions');
	
	public function load($url, $parameters = null)
    {
		require_once('../vendor/facebook/facebook.php');
		
		$facebook = new \Facebook(array(
		  'appId'  => '459848834048078',
		  'secret' => 'f5b344b91bff03ace4df454e35fca4e4',
		));
		
		$user = $facebook->getUser();
		
		if (!$user) {
			$item = new Item();
			$item->setArchive('Facebook'); 
	    	
			$item->setChildItemsCount(-1);
	    	
			return $this->returnResponse($item, true, false, "You do not appear to be signed into Facebook.");
	    	
		}
	    $fbid = $parameters["regex_matches"][1];
		$photoData = $facebook->api(
			$fbid,
			"GET",
            array(
              'metadata' => 'true',
              'format' => 'json',
            )
		);
		// check if response is false
		if($photoData==false){
			return $this->returnResponse(null, false, false, "You do not have Facebook Permissions to add this media.  The owner of the image can resolve this by changing the image's privacy settings.");
		}
		// check for FB error message
		if(array_key_exists("error",$photoData)){
			return $this->returnResponse(null, false, false, "Facebook responded with this error message: " . $photoData['error']['message']);
		}

		// do FB permissions matter for static image URLs?
		// if so, we'll need to http get the image and verify the HTTP response 
		$item = new Item();
		$tags = array();
		$item->setArchive('Facebook'); 
		$item->setMediaType('Image');
		$item->setLayerType('Image');
		$item->setChildItemsCount(0);
		$item->setLicense('All Rights Reserved'); // todo: what are the proper permissions here?
		if(array_key_exists("name",$photoData)){
			$item->setTitle($photoData["name"]);
		}

		if(array_key_exists("from",$photoData)){
			if(array_key_exists("name",$photoData["from"])){
				$item->setMediaCreatorRealname($photoData["from"]["name"]);
				$item->setMediaCreatorUsername($photoData["from"]["name"]);
			}
		}

		if(array_key_exists("source",$photoData)){
			$item->setUri($photoData["source"]);
		}
		if(array_key_exists("picture",$photoData)){
			$item->setThumbnailUrl($photoData["picture"]);
		}
		if(array_key_exists("link",$photoData)){
			$item->setAttributionUri($url);
		}
		if(array_key_exists("from",$photoData)){
			$item->setMediaCreatorUsername($photoData["from"]["name"]);
		}
		if(array_key_exists("created_time",$photoData)){
			$item->setMediaDateCreated(new DateTime($photoData['created_time']));
		}
		if(array_key_exists("place",$photoData)){
			$item->setMediaGeoLatitude($photoData['place']['location']['latitude']);
			$item->setMediaGeoLongitude($photoData['place']['location']['longitude']);
		}
		// tags might exist
		if(array_key_exists("tags", $photoData)){
			$tags = array();
			foreach($photoData['tags']['data'] as $fb_tag){
				array_push($tags, $fb_tag['name']);
			}
			$item->setTags($tags);
		}
		return $this->returnResponse($item, true, false);
	}
}
