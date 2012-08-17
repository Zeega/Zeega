<?php

namespace Zeega\ExtensionsBundle\Parser\Facebook;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;

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
	    	
			return $this->returnResponse($item, true, false);
	    	
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
		$photoQueryError = 0; // replace with real tests for error later.  for now, proceed as if everything's great.
		if(!$photoQueryError){
			$item = new Item();
			$tags = array();

			$item->setArchive('Facebook'); 
			$item->setMediaType('Image');
			$item->setLayerType('Image');
			$item->setChildItemsCount(0);

			$item->setTitle($photoData["name"]);
			$item->setUri($photoData["source"]);
			$item->setThumbnailUrl($photoData["picture"]);
			$item->setAttributionUri($photoData["link"]);
			$item->setMediaCreatorUsername($photoData["from"]["name"]);
			$item->setLicense('All Rights Reserved');
			$item->setMediaDateCreated(new DateTime($photoData['created_time']));
			// lat/lon might exist
			if(array_key_exists("place", $photoData)){
				$item->setMediaGeoLatitude($photoData['place']['location']['latitude']);
				$item->setMediaGeoLongitude($photoData['place']['location']['longitude']);
			}
			// tags might exist
			if(array_key_exists("tags", $photoData)){
				// loop through $photoData->tags;
				//$item->setTags($tags);
			}
			return $this->returnResponse($item, true, false);
		}
		else{
			return $this->returnResponse(null, false, false);
		}
	}
}
