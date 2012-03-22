<?php

namespace Zeega\ExtensionsBundle\Parser\Soundcloud;

use Zeega\CoreBundle\Parser\Base\ParserCollectionAbstract;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;

use \DateTime;

class ParserSoundcloudSet  extends ParserCollectionAbstract
{
	private static $soundcloudConsumerKey = 'lyCI2ejeGofrnVyfMI18VQ';
	
	public function getInfo($url, $setId)
	{
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
		$item->setMediaType('Audio');
		$item->setLayerType('Audio');
		$item->setArchive('SoundCloud');
		$item->setUri($itemJson['permalink_url']);
		$item->setUri($item->getUri().'?consumer_key='.self::$soundcloudConsumerKey);
		$item->setAttributionUri($itemJson['permalink_url']);
		$item->setDateCreated(new DateTime((string)$itemJson['created_at']));
		$item->setThumbnailUrl($itemJson['tracks'][0]['waveform_url']);
		$item->setChildItemsCount(count($itemJson['tracks']));

		$item->setLicense($itemJson['license']);
		
		return $this->returnResponse($item, true, true);
	}
	
	public function getCollection($url, $setId, $collection)
	{
		$itemUrl = "http://api.soundcloud.com/resolve.json?url=$url&consumer_key=".self::$soundcloudConsumerKey;
		
		$itemJson = file_get_contents($itemUrl,0,null,null);
		$itemJson = json_decode($itemJson,true);
		
		foreach ($itemJson["tracks"] as $itemJson) 
		{
			if($itemJson["streamable"])
			{
				$item = new Item();

				$item->setTitle($itemJson['permalink']);
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
				$item->setChildItemsCount(0);
				$item->setLicense($itemJson['license']);
			
				$collection->addItem($item);;
			}
		}
		return $this->returnResponse($collection, true, true);
	}
}
