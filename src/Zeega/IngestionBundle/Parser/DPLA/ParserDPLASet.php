<?php

namespace Zeega\IngestionBundle\Parser\DPLA;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Document\Item;

use \DateTime;

class ParserDPLASet extends ParserAbstract
{
    public function load($url, $parameters = null)
    {
      
		
	

		// read feed into SimpleXML object
		$entryList = json_decode(file_get_contents(($url)));
	
	
		
		$docs = $entryList->docs;
		
		$entry = $docs[0];
		
		$item= new Item();

		$item->setUri((string)$url);
		
	
		$item->setMediaCreatorRealname("David Weinberger");
		$item->setMediaCreatorUsername("David Weinberger");
		$item->setTitle("DPLA Collection");
		$item->setAttributionUri((string)$url);
		
		$item->setMediaType('Collection');
		$item->setLayerType('Collection');
		$item->setArchive((string)$entry->{"dpla.contributor"});
		$item->setThumbnailUrl('http://dev.zeega.org/dpla/web/images/dpla.jpeg');
		//$item->setDescription((string)$entry->{"dpla.description"}[0]);
	
		
		
		
		$entry = $docs[0];
		$i=0;
		foreach ($docs as $entry){
			if ($i<10){
				$i++;
				$childItem= new Item();

				$childItem->setUri((string)$url);
				
			
				if(property_exists($entry, "dpla.creator"))$childItem->setMediaCreatorRealname((string)$entry->{"dpla.creator"}[0]);
				if(property_exists($entry, "dpla.creator"))$childItem->setMediaCreatorUsername((string)$entry->{"dpla.creator"}[0]);
				if(property_exists($entry, "dpla.title"))$childItem->setTitle((string)$entry->{"dpla.title"});
				$childItem->setAttributionUri((string)$url);
				$childItem->setChildItemsCount(0);
				$childItem->setMediaType('DPLA');
				$childItem->setLayerType('DPLA');
				$childItem->setArchive((string)$entry->{"dpla.contributor"});
				$childItem->setThumbnailUrl('http://dev.zeega.org/dpla/web/images/dpla.jpeg');
				if(property_exists($entry, "dpla.description"))$childItem->setDescription((string)$entry->{"dpla.description"}[0]);
				if(property_exists($entry, "dpla.subject"))$childItem->setTags((array)$entry->{"dpla.subject"});
				$item->addChildItem($childItem);
			}
		}
	
		$item->setChildItemsCount($i);
		
		
		return $this->returnResponse($item, true, true);
		
	}
}
