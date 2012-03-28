<?php

namespace Zeega\ExtensionsBundle\Parser\Mapbox;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;

use \DateTime;

class ParserMapBoxTiles extends ParserAbstract
{
    public function load($url, $parameters = null)
    {
        $regexMatches = $parameters["regex_matches"];
        $itemId = $regexMatches[1]; // bam

		$info = explode('/map/',$itemId);
		
		$originalUrl = 'http://api.tiles.mapbox.com/v2/'.$info[0].'.'.$info[1].'.json';

		// read feed into SimpleXML object
		$entry = json_decode(file_get_contents(($originalUrl)));
	
		$item= new Item();

		$item->setUri((string)$entry->id);
		$item->setTitle((string)$entry->name);
		$item->setAttributionUri((string)$entry->webpage);
		$item->setDateCreated(new \DateTime("now"));
		$item->setMediaType('Map');
		$item->setLayerType('Mapbox');
		$item->setChildItemsCount(0);
		
		$center = (array)$entry->center;
		
		$item->setMediaGeoLatitude((string)$center[0]);
		$item->setMediaGeoLongitude((string)$center[1]);
	
		$item->setMediaCreatorUsername((string)$info[0]);
		$item->setMediaCreatorRealname('Unknown');


		$thumbnailUrl = (string)'http://api.tiles.mapbox.com/v2/'.$info[0].'.'.$info[1].'/thumb.png';

		// write metadata
		$item->setArchive('Mapbox');
		$item->setLicense('Unknown');
		$item->setThumbnailUrl($thumbnailUrl);
		
		$item->setThumbnailUrl($thumbnailUrl);
	
		return $this->returnResponse($item, true, false);
		
	}
}
