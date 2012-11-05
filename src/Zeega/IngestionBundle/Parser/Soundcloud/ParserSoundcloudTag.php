<?php

namespace Zeega\IngestionBundle\Parser\Soundcloud;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;

use \DateTime;

class ParserSoundcloudTag extends ParserAbstract
{
    private static $soundcloudConsumerKey = 'lyCI2ejeGofrnVyfMI18VQ';
    
    public function load($url, $parameters = null)
    {
        $loadCollectionItems = $parameters["load_child_items"];
        $checkForDuplicates = (bool) $parameters["check_for_duplicates"];
        $tags = $parameters["tags"];
        $user = $parameters["user"]; 
        $originalItems = null;

        $apiUrl = "http://api.soundcloud.com/tracks.json?tags=$tags&consumer_key=".self::$soundcloudConsumerKey;
        $limit = 50;
        $page = 1;

        if(FALSE !== $checkForDuplicates) {
            $em = $parameters["entityManager"];
            $originalItems = $em->getRepository('ZeegaDataBundle:Item')->findUriByUserArchive($user->getId(), "SoundCloud");
            
            if(isset($originalItems)) {
                $checkForDuplicates = TRUE;
            } else {
                $checkForDuplicates = FALSE;    
            }
        } else {
            $checkForDuplicates = FALSE;
        } 

        $items = array();

        while(1) {
            $offset = $limit * $page;
            $apiUrl = $apiUrl . "&limit=$limit&offset=$offset";

            $itemsJson = file_get_contents($apiUrl,0,null,null);
            $itemsJson = json_decode($apiUrl,true);

            if(null !== $itemsJson && is_array($itemsJson)) {
                foreach($itemsJson as $itemJson) {
                    if(TRUE === $checkForDuplicates) {
                        if(TRUE === array_key_exists($item->getAttributionUri(), $originalItems)) {
                            continue;
                        }
                    } 

                    $item = new Item();
                    $item->setTitle($itemJson['title']);
                    $item->setDescription($itemJson['description']);
                    $item->setMediaCreatorUsername($itemJson['user']['username']);
                    $item->setMediaCreatorRealname($itemJson['user']['username']);
                    $item->setMediaType('Audio');
                    $item->setLayerType('Audio');
                    $item->setArchive('SoundCloud');
                    $item->setUri($itemJson['stream_url']);
                    $item->setUri($item->getUri().'?consumer_key='.self::$soundcloudConsumerKey);
                    $item->setAttributionUri($itemJson['permalink_url']);
                    $item->setDateCreated(new DateTime((string)$itemJson['created_at']));
                    $item->setThumbnailUrl($itemJson['waveform_url']);
                    $item->setitemsCount(0);
                    $item->setLicense($itemJson['license']);
                    
                    $tags = $itemJson["tag_list"];                            
                    if(isset($tags)) {
                        $tags = explode(" ", $tags);
                        $itemTags = array();
                        foreach($tags as $tag) {
                            array_push($itemTags, $tag);
                        }
                        $item->setTags($tags);
                    }

                    array_push($items,$item);
                }
            } else {
                break;
            }

            if($page++ > 10) {
                break;
            }
        }    

        return $this->returnResponse($item, true, true);
    }
}
