<?php

namespace Zeega\ExtensionsBundle\Parser\DocumentCloud;

use Zeega\CoreBundle\Parser\Base\ParserItemAbstract;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\ItemTags;

use \DateTime;

class ParserDocumentCloud extends ParserItemAbstract
{
	public function getItem($url,$itemId)
	{
	    $originalUrl = $url;
	    $url=str_replace( 'org/documents', 'org/api/documents',$url);
		$url=str_replace( '.html', '.json',$url);
		
	    $itemJson = file_get_contents($url,0,null,null);
		$itemJson = json_decode($itemJson,true);
		
		$document = $itemJson["document"];
		$item= new Item();
		
		if($document["source"]){
			$item->setMediaCreatorUsername($document["source"]);
			$item->setMediaCreatorRealname($document["source"]);
		}
		else {
			$item->setMediaCreatorUsername('Unknown');
			$item->setMediaCreatorRealname('Unknown');
		}
		
		$item->setArchive('DocumentCloud');
		$item->setMediaType('Document');
		$item->setLayerType('DocumentCloud');
		$item->setTitle($document["title"]);
		$item->setUri($document["id"]);
		$item->setAttributionUri($originalUrl);
		
		$item->setDescription($document["description"]);
	
	
		$image = $document["resources"]["page"]["image"];
		$image=str_replace('{page}','1',$image);
		$image=str_replace('{size}','small',$image);
		
	
		$item->setThumbnailUrl($image);
		
		
		return $this->returnResponse($item, true, false);
	}
}
