<?php

namespace Zeega\ExtensionsBundle\Parser\GoogleBook;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\ItemTags;

use \DateTime;

class ParserGoogleBook extends ParserAbstract
{
    public function load($url, $parameters = null)
    {
        $regexMatches = $parameters["regex_matches"];
        $itemId = $regexMatches[1]; // bam

	
		$originalUrl = 'https://www.googleapis.com/books/v1/volumes/'.$itemId;

		// read feed into SimpleXML object
		$entry = json_decode(file_get_contents($originalUrl));
	
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
		
		$mainCategories = (string)$entry->volumeInfo->mainCategory;
		if(isset($mainCategories))
		{
		    $mainCategories = explode(" / ", $mainCategories);
			foreach($mainCategories as $category)
			{
			    $tag = new Tag;
			    $tag->setName($category);
                $tag->setDateCreated(new \DateTime("now"));
	            $item_tag = new ItemTags;
	            $item_tag->setItem($item);
	            $item_tag->setTag($tag);
	            $item_tag->setDateCreated(new \DateTime("now"));
                $item->addItemTags($item_tag);
			}
		}

		return $this->returnResponse($item, true, false);		
	}
}
