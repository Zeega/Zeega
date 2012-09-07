<?php

namespace Zeega\ExtensionsBundle\Parser\DocumentCloud;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;

use \DateTime;

class ParserDocumentCloud extends ParserAbstract
{
	public function load($url, $parameters = null)
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
		$item->setChildItemsCount(0);
		
		$description = $document["description"];
		if(isset($description))
		{
		    if(strlen($description) > 500 )
		    {
		        $description = substr($description, 0, 500);
		    }
		    $item->setDescription($description);
		}
			
		$image = $document["resources"]["page"]["image"];
		$image=str_replace('{page}','1',$image);
		$image=str_replace('{size}','small',$image);
		
	
		$item->setThumbnailUrl($image);
		
		
		return $this->returnResponse($item, true, false);
	}
}
