<?php

namespace Zeega\ExtensionsBundle\Parser\GoogleBook;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;

use \DateTime;

class ParserGoogleBook extends ParserAbstract
{
    public function load($url, $parameters = null)
    {
        $regexMatches = $parameters["regex_matches"];
        $itemId = $regexMatches[1]; // bam

	
		$originalUrl = 'https://www.googleapis.com/books/v1/volumes/'.$itemId;

		// read feed into SimpleXML object
		$entry = json_decode(file_get_contents(($originalUrl)));
	
		
		$item= new Item();
		
	
	
		$volume=$entry->volumeInfo;
		
		$item->setUri((string)$entry->accessInfo->webReaderLink);
		$item->setTitle((string)$volume->title);
		$item->setAttributionUri((string)$volume->infoLink);
		$item->setDateCreated(new \DateTime("now"));
		$item->setMediaType('GoogleBook');
		$item->setLayerType('GoogleBook');
		$item->setChildItemsCount(0);
		
		$authors=(array)$volume->authors;
		
		$item->setMediaCreatorUsername((string)$authors[0]);
		$item->setMediaCreatorRealname('Unknown');

		// write metadata
		$item->setArchive('Google Books');
		$item->setLicense('Unknown');
		$item->setThumbnailUrl($volume->imageLinks->thumbnail);

		if((bool)$entry->accessInfo->embeddable) return $this->returnResponse($item, true, false);
		
		else return $this->returnResponse($item, false, false, "This book cannot be embedded.");
		
		
		
	}
}
