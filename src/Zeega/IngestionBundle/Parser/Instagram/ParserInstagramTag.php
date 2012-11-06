<?php

namespace Zeega\IngestionBundle\Parser\Instagram;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;
use Symfony\Component\HttpFoundation\Response;

use \DateTime;

class ParserInstagramTag extends ParserAbstract
{
    private static $soundcloudConsumerKey = 'lyCI2ejeGofrnVyfMI18VQ';
    
    public function load($url, $parameters = null)
    {
        $loadCollectionItems = $parameters["load_child_items"];
        $checkForDuplicates = (bool) $parameters["check_for_duplicates"];
        $tags = $parameters["tags"];
        $user = $parameters["user"]; 
        $originalItems = null;

        $apiUrl = "https://api.instagram.com/v1/tags/$tags/media/recent?access_token=1907240.f59def8.6a53e4264d87413a8e8cd431430b6e94";
        
        $itemsJson = file_get_contents($apiUrl,0,null,null);

        $items = array();

        if(null !== $itemsJson) {            
            $apiItems = json_decode($itemsJson,true);

            if(null !== $apiItems && is_array($apiItems) && array_key_exists("data", $apiItems)) {

                foreach($apiItems["data"] as $apiItem) {
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

                    array_push($items,$item);
                }
            }
        }
        return $this->returnResponse($items, true, true);
    }
}
