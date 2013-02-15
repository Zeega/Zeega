<?php
namespace Zeega\DataBundle\Service;

use Zeega\DataBundle\Entity\Item;

class ItemService
{
    public function __construct($itemService) 
    {
        $this->thumbnailService = $itemService;
    }

    public function parseItem($itemArray, $user, $item = null, $ingestor = null)
    {
        if(!isset($item)) {
            $item = new Item();    
            
            // set the defaults
            $item->setDateCreated(new \DateTime("now"));
            $item->setChildItemsCount(0);
            $item->setEnabled(true);
            $item->setPublished(false);

            $item->setUser($user);
        }
        
        $item->setDateUpdated(new \DateTime("now"));       
        
        // parse the item        
        if(isset($ingestor)) {
            $item->setIngestedBy($ingestor);    
        }

        if(isset($itemArray['title'])) {
            $item->setTitle($itemArray['title']);  
        } 
        
        if(isset($itemArray['description'])) {
            $item->setDescription($itemArray['description']);
        } 

        if(isset($itemArray['text'])) {
            $item->setText($itemArray['text']);  
        } 

        if(isset($itemArray['uri'])) {
            $item->setUri($itemArray['uri']);  
        } 
        
        if(isset($itemArray['attribution_uri'])) {
            $item->setAttributionUri($itemArray['attribution_uri']);  
        } 

        if(isset($itemArray['media_type'])) {
            $item->setMediaType($itemArray['media_type']);  
        } 

        if(isset($itemArray['layer_type'])) {
            $item->setLayerType($itemArray['layer_type']);  
        } 
        
        if(isset($itemArray['media_geo_latitude'])) {
            $item->setMediaGeoLatitude($itemArray['media_geo_latitude']);  
        } 
        if(isset($itemArray['media_geo_longitude'])) {
            $item->setMediaGeoLongitude($itemArray['media_geo_longitude']);  
        } 

        if(isset($itemArray['thumbnail_url'])) {
            $thumbnail = $this->thumbnailService->getItemThumbnail($itemArray['thumbnail_url']);
        } else {
            $thumbnail = $this->thumbnailService->getItemThumbnail($item->getUri());
        } 

        if(null !== $thumbnail) {
            $item->setThumbnailUrl($thumbnail);
        }

        if(isset($itemArray['media_date_created'])) {
            $parsedDate = strtotime($itemArray['media_date_created']);
            if($parsedDate) {
                $d = date("Y-m-d h:i:s",$parsedDate);
                $item->setMediaDateCreated(new \DateTime($d));
            }
        }

        if(isset($itemArray['media_creator_username'])) {
            $item->setMediaCreatorUsername($itemArray['media_creator_username']);
        } else {
            $item->setMediaCreatorUsername($user->getDisplayName());
        }

        if(isset($itemArray['media_creator_realname'])) {
            $item->setMediaCreatorRealname($itemArray['media_creator_realname']);
        } else {
            $item->setMediaCreatorUsername($user->getDisplayName());
        }
            
        if(isset($itemArray['archive'])) {
            $item->setArchive($itemArray['archive']);  
        } 

        if(isset($itemArray['location'])) {
            $item->setLocation($itemArray['location']);  
        } 

        if(isset($itemArray['license'])) {
            $item->setLicense($itemArray['license']);  
        } 
        
        if(isset($itemArray['attributes'])) {
            $item->setAttributes($itemArray['attributes']);  
        } 

        if(isset($itemArray['tags'])) {
            $item->setTags($itemArray['tags']);  
        } 

        if(isset($itemArray['published'])) {
            $item->setPublished($itemArray['published']);  
        } 

        if(isset($itemArray["child_items"])) {
            foreach($itemArray["child_items"] as $child_item) {
                $child = self::parseItem($child_item, $user, $ingestor);
                if(isset($child)) {
                    $item->addChildItem($child);    
                }
            }
        }
        
        return $item;
    }
}