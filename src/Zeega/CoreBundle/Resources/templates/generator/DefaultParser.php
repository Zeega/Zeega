<?php

namespace {{namespace}};

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;

use \DateTime;

class {{parserClass}} extends ParserAbstract
{
	public function load($url, $parameters = null)
    {
		$item = new Item();
		/
		/*
		$item->setTitle();                  // string
		$item->setDescription();            // string
		$item->setMediaCreatorUsername();   // string
		$item->setMediaCreatorRealname();   // string
		$item->setMediaType();              // string
		$item->setLayerType();              // string
		$item->setArchive();                // string
		$item->setUri();                    // string
        $item->setAttributionUri();         // string
		$item->setDateCreated();            // string
		$item->setThumbnailUrl();           // string
		$item->setChildItemsCount();        // int
        */
        
        // returnResponse($object:Item, $success:Boolean, $isSet:Boolean, $message:String: default = "")
		return $this->returnResponse($item, true, false, "I am a parser for the url $url");
	}
}
