<?php

namespace Zeega\ExtensionsBundle\Parser\Mapbox;

use Zeega\CoreBundle\Parser\Base\ParserItemAbstract;
use Zeega\DataBundle\Entity\Media;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\Metadata;

use \DateTime;

class ParserMapBoxTiles extends ParserItemAbstract
{
	public function getItem($url, $itemId)
	{
	
		$info = explode('/map/',$itemId);
		
		$originalUrl = 'http://api.tiles.mapbox.com/v2/'.$info[0].'.'.$info[1].'.json';

		// read feed into SimpleXML object
		$entry = json_decode(file_get_contents(($originalUrl)));
	
		$item= new Item();
		$metadata= new Metadata();
		$media = new Media();

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
		$metadata->setLicense('Unknown');
		$metadata->setThumbnailUrl($thumbnailUrl);
		
		$item->setThumbnailUrl($thumbnailUrl);
		
	
		$item->setMetadata($metadata);
		$item->setMedia($media);
		return $this->returnResponse($item, true);
		
	}
}
