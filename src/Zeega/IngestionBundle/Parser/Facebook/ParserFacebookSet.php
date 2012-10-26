<?php

namespace Zeega\IngestionBundle\Parser\Facebook;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;

use \DateTime;


class ParserFacebookSet extends ParserAbstract
{
	private static $license=array('','Attribution-NonCommercial-ShareAlike Creative Commons','Attribution-NonCommercial Creative 		
			Commons','Attribution-NonCommercial-NoDerivs Creative Commons','Attribution Creative Commons',
			'Attribution-ShareAlike Creative Commons','Attribution-NoDerivs Creative Commons','No known copyright restrictions');
	
	private $itemParser;
	
	function __construct() 
	{
		//$this->itemParser = new ParserFacebookPhoto();
	}
	
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
	    $albumId = $parameters["regex_matches"][2]; // album id

		$albumData = $facebook->api(
			$albumId,
			"GET",
            array(
              'metadata' => 'true',
              'format' => 'json',
            )
		);
		// check if response is false
		if($albumData==false){
			return $this->returnResponse(null, false, false, "You do not have Facebook Permissions to add this media.  The owner of the album can resolve this by changing the album's privacy settings.");
		}
		// check for FB error message
		if(array_key_exists("error",$albumData)){
			return $this->returnResponse(null, false, false, "Facebook responded with this error message: " . $photoData['error']['message']);
		}
        // get album cover image
        $coverImageId = $albumData['cover_photo'];
		$coverData = $facebook->api(
			$coverImageId,
			"GET",
            array(
              'metadata' => 'true',
              'format' => 'json',
            )
		);
		// check if response is false
		if($coverData==false){
			return $this->returnResponse(null, false, false, "You do not have Facebook Permissions to add this album's cover image.  The owner of the album can resolve this by changing the album's privacy settings.");
		}
		// check for FB error message
		if(array_key_exists("error",$coverData)){
			return $this->returnResponse(null, false, false, "Facebook responded with this error message: " . $photoData['error']['message']);
		}
        // get album photos
        $photoQueryUrl = $albumId . '/photos';
		$photoData = $facebook->api(
			$photoQueryUrl,
			"GET",
            array(
              'metadata' => 'true',
              'format' => 'json',
            )
		);
		// check if response is false
		if($photoData==false){
			return $this->returnResponse(null, false, false, "You do not have Facebook Permissions to add one or more of these photos.  The owner of the album can resolve this by changing the album's privacy settings.");
		}
		// check for FB error message
		if(array_key_exists("error",$photoData)){
			return $this->returnResponse(null, false, false, "Facebook responded with this error message: " . $photoData['error']['message']);
		}

		// create collection and metadata
		$collection = new Item();
		$collection->setMediaType('Collection');
	    $collection->setLayerType('Facebook');
		$collection->setTitle($albumData['name']);
		//$collection->setDescription();
		$collection->setAttributionUri($url);
        //$collection->setChildItemsCount($albumData['count']);
		$collection->setMediaCreatorUsername($albumData['from']['name']);
        $collection->setMediaCreatorRealname($albumData['from']['name']);
		$collection->setMediaDateCreated($albumData['created_time']);
		$collection->setThumbnailUrl($coverData['picture']);
		$itemCount = 0;

		foreach($photoData['data'] as $photoData){
			$item = new Item();
			$tags = array();

			$item->setArchive('Facebook'); 
			$item->setMediaType('Image');
			$item->setLayerType('Image');
			$item->setChildItemsCount(0);
			$item->setLicense('All Rights Reserved');// todo: what are the proper permissions here?

			if(array_key_exists("from",$photoData)){
				if(array_key_exists("name",$photoData["from"])){
					$item->setTitle($photoData["from"]["name"]);
				}
			}

			// lat/lon might exist
			if(array_key_exists("place", $photoData)){
				$item->setMediaGeoLatitude($photoData['place']['location']['latitude']);
				$item->setMediaGeoLongitude($photoData['place']['location']['longitude']);
			}
			if(array_key_exists("source",$photoData)){
				$item->setUri($photoData["source"]);
			}
			if(array_key_exists("picture",$photoData)){
				$item->setThumbnailUrl($photoData["picture"]);
			}
			if(array_key_exists("link",$photoData)){
				$item->setAttributionUri($photoData["link"]);
			}
			if(array_key_exists("from",$photoData)){
				$item->setMediaCreatorUsername($photoData["from"]["name"]);
				$item->setMediaCreatorRealname($photoData["from"]["name"]);
			}
			if(array_key_exists("created_time",$photoData)){
				$item->setMediaDateCreated(new DateTime($photoData['created_time']));
			}

			// tags might exist
			if(array_key_exists("tags", $photoData)){
				$tags = array();
				foreach($photoData['tags']['data'] as $fb_tag){
					array_push($tags, $fb_tag['name']);
				}
				$item->setTags($tags);
			}
			$processeditem = $this->returnResponse($item, true, false);

			$itemCount++;
			$collection->setChildItemsCount($itemCount);

			$collection->addItem($processeditem["items"][0]);
    	}
		return $this->returnResponse($collection, true, true);
	}
}
