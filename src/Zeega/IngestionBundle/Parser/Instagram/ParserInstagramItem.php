<?php

namespace Zeega\IngestionBundle\Parser\Instagram;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;
use Symfony\Component\HttpFoundation\Response;

use \DateTime;

class ParserInstagramItem extends ParserAbstract
{
    public function load($url, $parameters = null)
    {
        // to get the photo id we first need to use the embed API
        $embedApiUrl = "https://api.instagram.com/oembed?url=$url";
        
        $embedInfo = file_get_contents($embedApiUrl,0,null,null);
        $embedInfo = json_decode($embedInfo,true);
        
        if(null != $embedInfo && isset($embedInfo["media_id"])) {
            $mediaId = $embedInfo["media_id"];
            $mediaApiUrl = "https://api.instagram.com/v1/media/$mediaId?access_token=1907240.f59def8.6a53e4264d87413a8e8cd431430b6e94";

            $mediaDetails = file_get_contents($mediaApiUrl,0,null,null);
            $mediaDetails = json_decode($mediaDetails,true);

            if(null !== $mediaDetails && is_array($mediaDetails) && array_key_exists("data", $mediaDetails)) {
                $mediaDetails = $mediaDetails["data"];
                
                $item = new Item();
                $item->setTitle($mediaDetails["caption"]["text"]);
                $item->setMediaCreatorUsername($mediaDetails['user']['username']);
                $item->setMediaCreatorRealname($mediaDetails['user']['full_name']);
                $item->setMediaType('Image');
                $item->setLayerType('Image');
                $item->setArchive('Instagram');
                $item->setUri($mediaDetails['images']['standard_resolution']['url']);
                $item->setAttributionUri($mediaDetails['link']);
                $item->setMediaDateCreated(DateTime::createFromFormat('U', $mediaDetails['created_time']));                    
                $item->setThumbnailUrl($mediaDetails['images']['thumbnail']['url']);
                $item->setIdAtSource($mediaDetails['id']);
                
                $tags = $mediaDetails["tags"];                            
                if(isset($tags)) {
                    $item->setTags($tags);
                }

                $location = $mediaDetails["location"];

                if(null !== $location && is_array($location)) {
                	if(array_key_exists("latitude", $location) && array_key_exists("longitude", $location)) {
                		$item->setMediaGeoLatitude($mediaDetails['location']['latitude']);
                		$item->setMediaGeoLongitude($mediaDetails['location']['longitude']);
                	}

                	if(array_key_exists("name", $location)) {
                		$item->setLocation($mediaDetails['location']['name']);	
                	}
                }
                return $this->returnResponse(array($item), true, false);
            }
        }

        return $this->returnResponse(array(), false, true);
    }
}
