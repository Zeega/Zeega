<?php

namespace Zeega\IngestionBundle\Parser\AbsoluteUrl;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Document\Item;

use \DateTime;
use SimpleXMLElement;


class ParserAbsoluteUrl extends ParserAbstract
{
	public function load($url, $parameters = null)
	{
	    /* TEMP */
	    
	    $urlSplit = explode('?',$url);
		$urlClean = $urlSplit[0];
		
	    $fileFormat = strtolower(substr($urlClean,strlen($urlClean)-4));
		$fileFormatLong = strtolower(substr($urlClean,strlen($urlClean)-5));

		if(in_array($fileFormat,array('.jpg','.png','.gif','jpeg'))) 
		{
		    $contentType = 'Image';
		}
		else
		{
		    $item=new Item();
		    return $this->returnResponse($item, false, false);
		}
		
		$archive = 'Absolute';
		$split = explode('/',$urlClean);
		$title = $split[count($split)-1];
		
		$url = str_replace(" ", "%20", $url);

		$thumbUrl = $url;
		$itemUrl = $url;
        
		$item=new Item();
		$item->setMediaType($contentType);
		$item->setLayerType($contentType);
		$item->setUri($url);
		$item->setAttributionUri($url);
		$item->setTitle($title);
		$item->setMediaCreatorUsername('Unknown');
		$item->setMediaCreatorRealname('Unknown');
		$item->setDescription('None');
		$item->setArchive($archive);
		$item->setChildItemsCount(0);

		if($contentType=='Image') $item->setThumbnailUrl($itemUrl);
		elseif($contentType=='Audio') $item->setThumbnailUrl($parameters['hostname'].$parameters['directory'].'images/templates/audio.jpg');
		elseif($contentType=='Video') $item->setThumbnailUrl($parameters['hostname'].$parameters['directory'].'images/templates/video.jpg');

		return $this->returnResponse($item, true, false);
	}
}
