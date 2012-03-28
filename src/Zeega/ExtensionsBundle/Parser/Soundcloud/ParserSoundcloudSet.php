<?php

namespace Zeega\ExtensionsBundle\Parser\Soundcloud;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;

use \DateTime;

class ParserSoundcloudSet extends ParserAbstract
{
	private static $soundcloudConsumerKey = 'lyCI2ejeGofrnVyfMI18VQ';
	
	public function load($url, $parameters = null)
    {
        $loadCollectionItems = $parameters["load_child_items"];
        
		$itemUrl = "http://api.soundcloud.com/resolve.json?url=$url&consumer_key=".self::$soundcloudConsumerKey;
		
		$itemJson = file_get_contents($itemUrl,0,null,null);
		$itemJson = json_decode($itemJson,true);
		
		if(!$itemJson["streamable"])
		{
			return $this->returnResponse($item, false,"This track is not embeddable and cannot be added to Zeega.");
		}
		
		$item = new Item();

		$item->setTitle($itemJson['permalink']);
		$item->setDescription($itemJson['description']);
		$item->setMediaCreatorUsername($itemJson['user']['username']);
		$item->setMediaCreatorRealname($itemJson['user']['username']);
		$item->setMediaType('Collection');
		$item->setLayerType('Collection');
		$item->setArchive('SoundCloud');
		$item->setUri($itemJson['permalink_url']);
		$item->setUri($item->getUri().'?consumer_key='.self::$soundcloudConsumerKey);
		$item->setAttributionUri($itemJson['permalink_url']);
		$item->setDateCreated(new DateTime((string)$itemJson['created_at']));
		$item->setThumbnailUrl($itemJson['tracks'][0]['waveform_url']);
		$item->setChildItemsCount(count($itemJson['tracks']));
		$item->setLicense($itemJson['license']);
		
		if($loadCollectionItems)
		{
    		foreach ($itemJson["tracks"] as $itemJson) 
    		{
    			if($itemJson["streamable"])
    			{
    				$childItem = new Item();

    				$childItem->setTitle($itemJson['permalink']);
    				$childItem->setDescription($itemJson['description']);
    				$childItem->setMediaCreatorUsername($itemJson['user']['username']);
    				$childItem->setMediaCreatorRealname($itemJson['user']['username']);
    				$childItem->setMediaType('Audio');
    				$childItem->setLayerType('Audio');
    				$childItem->setArchive('SoundCloud');
    				$childItem->setUri($itemJson['stream_url']);
    				$childItem->setUri($item->getUri().'?consumer_key='.self::$soundcloudConsumerKey);
    				$childItem->setAttributionUri($itemJson['permalink_url']);
    				$childItem->setDateCreated(new DateTime((string)$itemJson['created_at']));
    				$childItem->setThumbnailUrl($itemJson['waveform_url']);
    				$childItem->setChildItemsCount(0);
    				$childItem->setLicense($itemJson['license']);
			
    				$item->addItem($childItem);
    			}
    		}
		}
		
		return $this->returnResponse($item, true, true);
	}
}
