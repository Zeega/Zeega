<?php

namespace Zeega\ExtensionsBundle\Parser\AbsoluteUrl;

use Zeega\CoreBundle\Parser\Base\ParserItemAbstract;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;

use \DateTime;
use SimpleXMLElement;

class ParserAbsoluteUrl extends ParserItemAbstract
{
	public function getItem($url, $itemId)
	{
	    /* TEMP */
	    
	    $urlSplit = explode('?',$url);
		$urlClean = $urlSplit[0];
		
	    $fileFormat = strtolower(substr($urlClean,strlen($urlClean)-4));
		$fileFormatLong = strtolower(substr($urlClean,strlen($urlClean)-5));
		
		if(in_array($fileFormat,array('.jpg','.png','.gif'))) 
		{
		    $contentType = 'Image';
		}
		elseif(in_array($fileFormat,array('.mov','.mp4')))
		{
		    $contentType = 'Video';
		}
		elseif(in_array($fileFormat,array('.wav','.mp3','.aiff')))
		{
			if($fileFormatLong == '.aiff') 
			{
			    $urlInfo['fileFormat'] = $fileFormatLong;
			}
			$contentType = 'Audio';
		}
		else
		{
		    $item=new Item();
		    return $this->returnResponse($item, false, "This item cannot be added to Zeega.");
		}
		
		$archive = 'Absolute';
		$split = explode('/',$urlClean);
		$title = $split[count($split)-1];
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
		elseif($contentType=='Audio') $item->setThumbnailUrl('../images/templates/audio.jpg');
		elseif($contentType=='Video') $item->setThumbnailUrl('../images/templates/video.jpg');

		return $this->returnResponse($item, true);
	}
}
