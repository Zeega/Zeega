<?php

namespace Zeega\ExtensionsBundle\Parser\Vimeo;

use Zeega\CoreBundle\Parser\Base\ParserItemAbstract;
use Zeega\DataBundle\Entity\Media;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\Metadata;

use \DateTime;
use SimpleXMLElement;

class ParserVimeoVideo extends ParserItemAbstract
{
	public function getItem($url, $itemId)
	{
		$originalUrl = 'http://vimeo.com/api/v2/video/'.$itemId.'.json';

		// read feed into SimpleXML object
		$entry = json_decode(file_get_contents(($originalUrl)));
		
		$entry=$entry[0];
		$item= new Item();
	

		
		$item->setUri((string)$entry->id);

		$item->setTitle((string)$entry->title);
		$item->setDescription((string)$entry->description);
		$item->setAttributionUri('http://vimeo.com/'.$item->getUri());
		$item->setDateCreated(new \DateTime((string)$entry->upload_date));
		$item->setMediaType('Video');
		$item->setLayerType('Vimeo');
		$item->setChildItemsCount(0);


		// TODO: ADD TAGS


		$item->setMediaCreatorUsername((string)$entry->user_name);
		$item->setMediaCreatorRealname('Unknown');

		
		// write metadata
		$item->setArchive('Vimeo');
		/*
		$metadata->setLicense((string)$entry->embed_privacy);
		$metadata->setThumbnailUrl((string)$entry->thumbnail_medium);
		*/
		$item->setThumbnailUrl((string)$entry->thumbnail_medium);
		
		/*

		// write media information
		$media->setDuration((string)$entry->duration);
		$media->setWidth((string)$entry->width);
		$media->setHeight((string)$entry->height);

		
		$item->setMetadata($metadata);
		$item->setMedia($media);
*/
		return $this->returnResponse($item, true, false);
		
	}
}
