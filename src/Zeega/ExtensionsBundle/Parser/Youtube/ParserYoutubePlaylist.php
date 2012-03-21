<?php

namespace Zeega\ExtensionsBundle\Parser\Youtube;

use Zeega\CoreBundle\Parser\Base\ParserCollectionAbstract;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;

use \DateTime;
use SimpleXMLElement;

class ParserYoutubePlaylist extends ParserCollectionAbstract
{
	public function getInfo($url, $setId)
	{
		if(strpos($setId, 'PL') === 0)    $setId = substr($setId, 2); // apparently the playlist ID changed... need to remove the PL prefix.
        
		$originalUrl="http://gdata.youtube.com/feeds/api/playlists/$setId?v=2";
        
		// read feed into SimpleXML object
		$xml = simplexml_load_file($originalUrl);
		
		$collection = new Item();
		$collection->setTitle((string)$xml->title);
		$collection->setArchive("Youtube");
		$collection->setDescription((string)$xml->subtitle);
		$collection->setMediaCreatorUsername((string)$xml->author->name);
		$collection->setMediaType('Collection');
	    $collection->setLayerType('Youtube');
	    $collection->setUri($url);
		$collection->setAttributionUri($url);
		$collection->setEnabled(true);
		$collection->setPublished(true);
		
		// get a thumbnail from the first item and break
		foreach ($xml->entry as $entry) 
		{
			$entryMedia = $entry->children('http://search.yahoo.com/mrss/');
			$attrs = $entryMedia->group->thumbnail->attributes();
			$collection->setThumbnailUrl((string)$attrs['url']);
			break;
		}
		
		return parent::returnResponse($collection, true);
	}
	
	public function getCollection($url, $setId, $collection)
	{
		// http://www.ibm.com/developerworks/xml/library/x-youtubeapi/
        if(strpos($setId, 'PL') === 0)    $setId = substr($setId, 2); // apparently the playlist ID changed... need to remove the PL prefix.
        
		$originalUrl="http://gdata.youtube.com/feeds/api/playlists/$setId?v=2";

		// read feed into SimpleXML object
		$xml = simplexml_load_file($originalUrl);

		foreach ($xml->entry as $entry) 
		{
			// get frames in media: namespace for media information
			$entryMedia = $entry->children('http://search.yahoo.com/mrss/');
			$yt = $entryMedia->children('http://gdata.youtube.com/schemas/2007');

			$item= new Item();

			$arr = explode(':',$entry->id);
			$entryId = $arr[count($arr)-1];

			$attrs = $entryMedia->group->player->attributes();
			$attributionUrl = $attrs['url'];

			$item->setUri((string)$yt->videoid);
			$item->setTitle((string)$entryMedia->group->title);
			$item->setDescription((string)$entryMedia->group->description);
			$item->setAttributionUri((string)$attributionUrl);
			$item->setDateCreated(new \DateTime("now"));
			$item->setMediaType('Video');
			$item->setLayerType('Youtube');
			$item->setChildItemsCount(0);

			foreach($entry->children('http://www.georss.org/georss') as $geo)
			{
				foreach($geo->children('http://www.opengis.net/gml') as $position)
				{
					// Coordinates are separated by a space
					$coordinates = explode(' ', (string)$position->pos);

					$item->setMediaGeoLatitude((string)$coordinates[0]);
					$item->setMediaGeoLongitude((string)$coordinates[1]);
					break;
				}
			}

			$item->setMediaCreatorUsername((string)$entry->author->name);
			$item->setMediaCreatorRealname('Unknown');

			// read metadata from xml
			$attrs = $entryMedia->group->thumbnail->attributes();
			$thumbnailUrl = (string)$attrs['url'];

			// write metadata
			$item->setArchive('Youtube');
			$item->setLicense((string)$entryMedia->group->license);
			$item->setThumbnailUrl((string)$thumbnailUrl);
			
			// read media from xml
			//$attrs = $yt->duration->attributes();
			//$duration = $attrs['seconds'];
			
			// access control
			$yt = $entry->children('http://gdata.youtube.com/schemas/2007');
			$embed = (isset($yt->accessContro)) ? 'true' : 'false';

			if(!isset($entry->children('http://gdata.youtube.com/schemas/2007')->noembed)) // deprecated, but works for now
			{
				$collection->addItem($item);;
				$collection->setChildItemsCount($collection->getChildItemsCount() + 1);
			}
			
		}

		return parent::returnResponse($collection, true, "");
	}
}
