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
		//error_log("1", 0);
	    $albumId = $parameters["regex_matches"][2];
		$access_token = "AAAGiOuZAnYE4BALEx0WWjSYGjVEHvaCNnbCblN0RpjW35wwFN70TdZBy4DQPAwFdeVhFOHYKQcExLR27CD8iJFCqb0oGd2VK6bSSrUZBQZDZD";
		// get album metadata
        $albumQueryUrl = 'https://graph.facebook.com/' . $albumId . '?method=GET&metadata=true&format=json&access_token=' . $access_token; 
        $albumQueryResult = file_get_contents($albumQueryUrl); 
        $albumQueryError = 0; // replace with real tests for error later.  for now, proceed as if everything's great.
		if($albumQueryError){
			return $this->returnResponse(null, false, false);
		}
        $albumData = json_decode($albumQueryResult);


		//error_log("2", 0);
        // get album cover image
        $coverImageId = $albumData->cover_photo;
        $coverQueryUrl = 'https://graph.facebook.com/' . $coverImageId . '?method=GET&metadata=true&format=json&access_token=' . $access_token; 
        $coverQueryResult = file_get_contents($coverQueryUrl); 
        $coverQueryError = 0; // replace with real tests for error later.  for now, proceed as if everything's great.
		if($coverQueryError){
			return $this->returnResponse(null, false, false);
		}
        $coverData = json_decode($coverQueryResult);
		//error_log($coverQueryUrl, 0);


		//error_log("3", 0);
        // get album photos
        $photosQueryUrl = 'https://graph.facebook.com/' . $albumId . '/photos?method=GET&metadata=true&format=json&access_token=' . $access_token; 
        $photosQueryResult = file_get_contents($photosQueryUrl); 
        $photosQueryError = 0; // replace with real tests for error later.  for now, proceed as if everything's great.
        $photoData = json_decode($photosQueryResult);

		//error_log("4", 0);
		if($photosQueryError){
			return $this->returnResponse(null, false, false);
		}
		//error_log("5", 0);

		// create collection and metadata
		$collection = new Item();
		$collection->setMediaType('Collection');
	    $collection->setLayerType('Facebook');
		$collection->setTitle($albumData->name);
		//$collection->setDescription();
		$collection->setAttributionUri($albumData->link);
        $collection->setChildItemsCount($albumData->count);
		$collection->setMediaCreatorUsername($albumData->from->name);
        $collection->setMediaCreatorRealname($albumData->from->name);
		$collection->setMediaDateCreated($albumData->created_time);
		//error_log("5.1", 0);
		//error_log($coverQueryResult, 0);
		//error_log("5.2", 0);
		$collection->setThumbnailUrl($coverData->picture);

		//error_log("6", 0);
    	foreach($photoData->data as $photoData){
    		error_log($photoData->name, 0);
			$item = new Item();
			$tags = array();

			$item->setArchive('Facebook'); 
			$item->setMediaType('Image');
			$item->setLayerType('Image');
			$item->setChildItemsCount(0);

			$item->setTitle($photoData->name);
			//$item->setDescription($photoData->name);
			$item->setUri($photoData->source);
			$item->setThumbnailUrl($photoData->picture);
			$item->setAttributionUri($photoData->link);
			$item->setMediaCreatorUsername($photoData->from->name);
			$item->setLicense('All Rights Reserved');
			$item->setMediaDateCreated(new DateTime($photoData->created_time));
			// lat/lon might exist
			if(array_key_exists("place", $photoData)){
				$item->setMediaGeoLatitude($photoData->place->location->latitude);
				$item->setMediaGeoLongitude($photoData->place->location->longitude);
			}
			// tags might exist
			if(array_key_exists("tags", $photoData)){
				// loop through $photoData->tags;
				//$item->setTags($tags);
			}
	    	$collection->addItem($item);
    	}
		//error_log("7", 0);
		return parent::returnResponse($collection, true, true);
	}
}
