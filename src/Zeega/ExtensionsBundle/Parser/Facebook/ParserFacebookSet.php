<?php

namespace Zeega\ExtensionsBundle\Parser\Facebook;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
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
		$albumQueryError = 0; // replace with real tests for error later.  first check catches HTTP error.  
		if($albumQueryError){
			return $this->returnResponse(null, false, false);
		}
		$albumQueryError = 0; // replace with real tests for error later.  second check catches JSON error msg.  
		if($albumQueryError){
			return $this->returnResponse(null, false, false);
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
		$coverQueryError = 0; // replace with real tests for error later.  first check catches HTTP error.  
		if($coverQueryError){
			return $this->returnResponse(null, false, false);
		}
		$coverQueryError = 0; // replace with real tests for error later.  second check catches JSON error msg.
		if($coverQueryError){
			return $this->returnResponse(null, false, false);
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
		$photoQueryError = 0; // replace with real tests for error later.  first check catches HTTP error.  
		if($photoQueryError){
			return $this->returnResponse(null, false, false);
		}
		$photoQueryError = 0; // replace with real tests for error later.  second check catches JSON error msg.
		if($photoQueryError){
			return $this->returnResponse(null, false, false);
		}

		// create collection and metadata
		$collection = new Item();
		$collection->setMediaType('Collection');
	    $collection->setLayerType('Facebook');
		$collection->setTitle($albumData['name']);
		//$collection->setDescription();
		$collection->setAttributionUri($albumData['link']);
        $collection->setChildItemsCount($albumData['count']);
		$collection->setMediaCreatorUsername($albumData['from']['name']);
        $collection->setMediaCreatorRealname($albumData['from']['name']);
		$collection->setMediaDateCreated($albumData['created_time']);
		$collection->setThumbnailUrl($coverData['picture']);
    	foreach($photoData['data'] as $photoData){
			$item = new Item();
			$tags = array();

			$item->setArchive('Facebook'); 
			$item->setMediaType('Image');
			$item->setLayerType('Image');
			$item->setChildItemsCount(0);

			$item->setTitle($photoData['name']);
			//$item->setDescription($photoData['name']);
			$item->setUri($photoData['source']);
			$item->setThumbnailUrl($photoData['picture']);
			$item->setAttributionUri($photoData['link']);
			$item->setMediaCreatorUsername($photoData['from']['name']);
			$item->setLicense('All Rights Reserved');
			$item->setMediaDateCreated(new DateTime($photoData['created_time']));
			// lat/lon might exist
			if(array_key_exists("place", $photoData)){
				$item->setMediaGeoLatitude($photoData['place']['location']['latitude']);
				$item->setMediaGeoLongitude($photoData['place']['location']['longitude']);
			}
			// tags might exist
			if(array_key_exists("tags", $photoData)){
				// loop through $photoData['tags'];
				//$item->setTags($tags);
			}
	    	$collection->addItem($item);
    	}
		return parent::returnResponse($collection, true, true);
	}
}
