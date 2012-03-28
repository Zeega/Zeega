<?php

namespace Zeega\ExtensionsBundle\Parser\Youtube;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;

use \DateTime;
use SimpleXMLElement;

class ParserYoutubePlaylist extends ParserAbstract
{
	public function load($url, $parameters = null)
	{
	    $regexMatches = $parameters["regex_matches"];
	    $loadCollectionItems = $parameters["load_child_items"];
	    
	    $setId = $regexMatches[1]; // bam
	    
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
		$collection->setChildItemsCount(count($xml->entry));
		
		foreach ($xml->entry as $entry) 
		{
			$entryMedia = $entry->children('http://search.yahoo.com/mrss/');
			$attrs = $entryMedia->group->thumbnail->attributes();
			$yt = $entryMedia->children('http://gdata.youtube.com/schemas/2007'); // get frames in media: namespace for media information
            
            if($loadCollectionItems == false)
            {
                // we just want the set description - get a thumbnail from the first item and break
                $collection->setThumbnailUrl((string)$attrs['url']);
                break;
            }
			
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
		
		return parent::returnResponse($collection, true,true);
	}
}
