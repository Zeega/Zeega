<?php
namespace Zeega\DataBundle\Service;

use Zeega\DataBundle\Entity\Item;

class ItemService
{
    public function __construct($solr) 
    {
        $this->solr = $solr;
    }

    public function parseItem($itemArray, $user = null, $ingestor = null)
    {
        $title = $itemArray['title'];
        $description = $itemArray['description'];
        $text = $itemArray['text'];
        $uri = $itemArray['uri'];
        $attributionUri = $itemArray['attribution_uri'];
        $mediaType = $itemArray['media_type'];
        $layerType = $itemArray['layer_type'];
        $thumbnailUrl = $itemArray['thumbnail_url'];
        $mediaGeoLatitude = $itemArray['media_geo_latitude'];
        $mediaGeoLongitude = $itemArray['media_geo_longitude'];
        $mediaDateCreated = $itemArray['media_date_created'];
        $mediaCreatorUsername = $itemArray['media_creator_username'];
        $mediaCreatorRealname = $itemArray['media_creator_realname'];
        $archive = $itemArray['archive'];
        $attributes = $itemArray['attributes'];
        $tags = $itemArray['tags'];
        $published = $itemArray['published'];
        $childItems = $itemArray['child_items'];
        
        $checkForDuplicateItems = true;

        if(!isset($item)) {
            $item = new Item();    
            
            // set the defaults
            $item->setDateCreated(new \DateTime("now"));
            $item->setDateUpdated(new \DateTime("now"));
            $item->setChildItemsCount(0);
            $item->setEnabled(true);
            $item->setPublished(false);
        }
        
        // parse the item        
        if(isset($ingestor)) {
            $item->setIngestedBy($ingestor);    
        }

        if(isset($title)) {
            $item->setTitle($title);  
        } 
        
        if(isset($description)) {
            $item->setDescription($description);
        } 

        if(isset($text)) {
            $item->setText($text);  
        } 

        if(isset($uri)) {
            $item->setUri($uri);  
        } 
        
        if(isset($attributionUri)) {
            $item->setAttributionUri($attributionUri);  
        } 

        if(isset($mediaType)) {
            $item->setMediaType($mediaType);  
        } 

        if(isset($layerType)) {
            $item->setLayerType($layerType);  
        } 
        
        if(isset($mediaGeoLatitude)) {
            $item->setMediaGeoLatitude($mediaGeoLatitude);  
        } 
        if(isset($mediaGeoLongitude)) {
            $item->setMediaGeoLongitude($mediaGeoLongitude);  
        } 

        if(isset($thumbnailUrl)) {
            $thumbnail = $this->zeegaThumbnailService->getItemThumbnail($thumbnailUrl, "Image");
        } else {
            $thumbnail = $this->zeegaThumbnailService->getItemThumbnail($item->getUri(), $item->getMediaType());
        } 

        if(null !== $thumbnail) {
            $item->setThumbnailUrl($thumbnail);
        }

        if(isset($mediaDateCreated)) {
            $parsedDate = strtotime($mediaDateCreated);
            if($parsedDate) {
                $d = date("Y-m-d h:i:s",$parsedDate);
                $item->setMediaDateCreated(new \DateTime($d));
            }
        }

        if(isset($mediaCreatorUsername)) {
            $item->setMediaCreatorUsername($mediaCreatorUsername);
        }

        if(isset($mediaCreatorRealname)) {
            $item->setMediaCreatorRealname($mediaCreatorRealname);
        }
            
        if(isset($archive)) {
            $item->setArchive($archive);  
        } 

        if(isset($itemArray['location'])) {
            $item->setLocation($itemArray['location']);  
        } 

        if(isset($itemArray['license'])) {
            $item->setLicense($itemArray['license']);  
        } 
        
        if(isset($attributes)) {
            $item->setAttributes($attributes);  
        } 

        if(isset($tags)) {
            $item->setTags($tags);  
        } 

        if(isset($published)) {
            $item->setPublished($published);  
        } 
        
        return $item;
    }
}