<?php

namespace Zeega\IngestionBundle\Parser\Instagram;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;
use Symfony\Component\HttpFoundation\Response;

use \DateTime;

class ParserInstagramTag extends ParserAbstract
{
    public function load($url, $parameters = null)
    {
        $loadCollectionItems = $parameters["load_child_items"];
        $checkForDuplicates = (bool) $parameters["check_for_duplicates"];
        $tags = $parameters["tags"];
        $user = $parameters["user"]; 
        $originalItems = null;

        $items = array();

        $apiUrl = "https://api.instagram.com/v1/tags/$tags/media/recent?access_token=1907240.f59def8.6a53e4264d87413a8e8cd431430b6e94";
        
        $itemsJson = file_get_contents($apiUrl,0,null,null);

        if(FALSE !== $checkForDuplicates) { // temp check for duplicates [with duplicated code]. transition to max_id / min_id later.
            $em = $parameters["entityManager"];
            $originalItems = $em->getRepository('ZeegaDataBundle:Item')->findUriByUserArchive($user->getId(), "Instagram");
            
            if(isset($originalItems)) {
                $checkForDuplicates = TRUE;
            } else {
                $checkForDuplicates = FALSE;    
            }
        } else {
            $checkForDuplicates = FALSE;
        } 

        if(null !== $itemsJson) {            
            $apiItems = json_decode($itemsJson,true);

            if(null !== $apiItems && is_array($apiItems) && array_key_exists("data", $apiItems)) {

                foreach($apiItems["data"] as $apiItem) {
                	if(TRUE === $checkForDuplicates) {
                        if(TRUE === array_key_exists($apiItem['link'], $originalItems)) {
                            continue;
                        }
                    } 

                    $item = new Item();
                    $item->setTitle($apiItem["caption"]["text"]);
                    $item->setMediaCreatorUsername($apiItem['user']['username']);
                    $item->setMediaCreatorRealname($apiItem['user']['full_name']);
                    $item->setMediaType('Image');
                    $item->setLayerType('Image');
                    $item->setArchive('Instagram');
                    $item->setUri($apiItem['images']['standard_resolution']['url']);
                    $item->setAttributionUri($apiItem['link']);
                    $item->setMediaDateCreated(DateTime::createFromFormat('U', $apiItem['created_time']));                    
                    $item->setThumbnailUrl($apiItem['images']['thumbnail']['url']);
                    $item->setIdAtSource($apiItem['id']);
                    
                    $tags = $apiItem["tags"];                            
                    if(isset($tags)) {
                        $item->setTags($tags);
                    }

                    $location = $apiItem["location"];

                    if(null !== $location && is_array($location)) {
                    	if(array_key_exists("latitude", $location) && array_key_exists("longitude", $location)) {
                    		$item->setMediaGeoLatitude($apiItem['location']['latitude']);
                    		$item->setMediaGeoLongitude($apiItem['location']['longitude']);
                    	}

                    	if(array_key_exists("name", $location)) {
                    		$item->setLocation($apiItem['location']['name']);	
                    	}
                    }

                    array_push($items,$item);
                }
            }
        }
        return $this->returnResponse($items, true, true);
    }
}
