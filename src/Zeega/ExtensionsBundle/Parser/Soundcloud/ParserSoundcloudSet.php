<?php

namespace Zeega\ExtensionsBundle\Parser\Soundcloud;

use Zeega\CoreBundle\Parser\Base\ParserCollectionAbstract;
use Zeega\DataBundle\Entity\Media;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\Metadata;

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
		$metadata = new Metadata();
		$media = new Media();
		
		$attr=array();
		$attr['tags']=$itemJson["tag_list"];
		$metadata->setThumbnailUrl($itemJson['tracks'][0]['waveform_url']);

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

		$duration=$itemJson['duration'];
		$media->setDuration(floor($duration/1000));

		$metadata->setLicense($itemJson['license']);
		
		$item->setMetadata($metadata);
		$item->setMedia($media);
		
		return $this->returnResponse($item, true);
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
				$metadata = new Metadata();
				$media = new Media();

				$attr=array();
				$attr['tags']=$itemJson["tag_list"];
				$metadata->setThumbnailUrl($itemJson['waveform_url']);

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

				$duration=$itemJson['duration'];
				$media->setDuration(floor($duration/1000));

				$metadata->setLicense($itemJson['license']);

				$item->setMetadata($metadata);
				$item->setMedia($media);
			
				$collection->addItem($item);;
			}
		}
		return $this->returnResponse($collection, true);
	}
}
