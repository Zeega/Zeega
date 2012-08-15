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

	    //error_log(json_encode($parameters["regex_matches"][1]), 0);
		require_once('../vendor/facebook/facebook.php');
		$facebook = new \Facebook(array(
		  'appId'  => '459848834048078',
		  'secret' => 'f5b344b91bff03ace4df454e35fca4e4',
		));
		// deal with FB login and redirect later.  Use auth token from graph server for now
		/*
		$user = $facebook->getUser();
		if ($user) {
		  try {
		    $user_profile = $facebook->api('/me');
		  } catch (FacebookApiException $e) {
		    error_log($e);
		    $user = null;
		  }
		}
		if ($user) {
		  $logoutUrl = $facebook->getLogoutUrl();
		  error_log($loginUrl,0);
		} else {
		  $params = array(
		    'scope'           => 'user_photos',
		    'display'         => 'page'
		  );
		  $loginUrl = $facebook->getLoginUrl($params);
		  error_log($loginUrl,0);
		}
		*/
	    //error_log("-----------------------1>", 0);
	    $fbid = $parameters["regex_matches"][1];
		$access_token = "AAAGiOuZAnYE4BAIJBv0GvLucABvc4aw6doHtpdPmzClZByAnr2kuiHFOD9IISZBXtYruOUWhcF1X3oobZA7brLTgPZCZClEBZC4dlO2u7uQ4QZDZD";
        $photoQueryUrl = 'https://graph.facebook.com/' . $fbid . '?method=GET&metadata=true&format=json&access_token=' . $access_token; 
        $photoQueryResult = file_get_contents($photoQueryUrl); 
        $photoQueryError = 0; // replace with real tests for error later.  for now, proceed as if everything's great.

        $photoData = json_decode($photoQueryResult);

	    //error_log("-----------------------4>", 0);
	    //error_log($photoData->created_time, 0);
	    //error_log("-----------------------5>", 0);
		if(!$photoQueryError){
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
			return $this->returnResponse($item, true, false);
		}
		else{
			return $this->returnResponse(null, false, false);
		}
	}
}
