<?php

namespace Zeega\ExtensionsBundle\Parser\Youtube;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\ItemTags;

use \DateTime;
use SimpleXMLElement;

class ParserYoutubeVideo extends ParserAbstract
{
	public function load($url, $parameters = null)
	{
	    $regexMatches = $parameters["regex_matches"];
	    $itemId = $regexMatches[1]; // bam
	    
		$originalUrl = 'http://gdata.youtube.com/feeds/api/videos/'.$itemId.'?alt=json';

		// read feed into SimpleXML object
		$videoInfo = json_decode(file_get_contents($originalUrl),true);
		$entry = $videoInfo["entry"];

		$item= new Item();

		$item->setUri($itemId);
		$item->setTitle($entry["title"]["\$t"]);
		$item->setDescription($entry["content"]["\$t"]);
		$item->setAttributionUri($entry["link"][0]["href"]);
		$item->setDateCreated(new \DateTime("now"));
		$item->setMediaType('Video');
		$item->setLayerType('Youtube');
		$item->setChildItemsCount(0);
		
		$categories = $entry["category"];

        if(isset($categories)) 
		{
		    foreach($categories as $cat)
			{
			    if($cat["term"] != "http://gdata.youtube.com/schemas/2007#video")
			    {
			        $tag = new Tag;
        		    $tag->setName($cat["term"]);
                    $tag->setDateCreated(new \DateTime("now"));
                    $item_tag = new ItemTags;
                    $item_tag->setItem($item);
                    $item_tag->setTag($tag);
                    $item_tag->setDateCreated(new \DateTime("now"));
                    $item->addItemTags($item_tag);
        		    
			    }
			}
		}
        
        /*
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
		}*/

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
		$embed = (isset($yt->accessControl)) ? 'true' : 'false';
		
		if(isset($entry->children('http://gdata.youtube.com/schemas/2007')->noembed)) // deprecated, but works for now
		{
			return $this->returnResponse($item, false, false, "This video is not embeddable and cannot be added to Zeega.");
		}
		else
		{
			return $this->returnResponse($item, true, false);
		}
	}
}
