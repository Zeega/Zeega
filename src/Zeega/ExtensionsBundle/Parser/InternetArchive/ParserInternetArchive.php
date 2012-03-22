<?php

namespace Zeega\ExtensionsBundle\Parser\InternetArchive;

use Zeega\CoreBundle\Parser\Base\ParserItemAbstract;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\ItemTags;

use \DateTime;

class ParserInternetArchive extends ParserItemAbstract
{
	public function getItem($url,$itemId)
	{
	    $originalUrl = $url;
	    $url = $url."?output=json";
	    
	    $itemJson = file_get_contents($url,0,null,null);
		$itemJson = json_decode($itemJson,true);
	
		$mdata = $itemJson["metadata"];
		$files=(array)$itemJson["files"];
		$fileKeys=array_keys($files);
		$dir=$itemJson["dir"];
		$misc=$itemJson["misc"];
	
	
		$item= new Item();
		$attr=array();
		
		//if(isset($mdata->subject)&&isset($mdata->subject[0])) $tags=str_replace("; ",",",(string)$mdata->subject[0]);
		//else $tags='';
		$item->setTitle($mdata["title"][0]);
	
		//if(!$item->getTitle()){return false;}
	
		$item->setDescription($mdata["description"][0]);
		$item->setDescription(str_replace('<br />','',$item->getDescription()));
		$item->setChildItemsCount(0);
		$item->setThumbnailUrl(urldecode($misc["image"]));
		
		if(isset($mdata->creator)){
			$item->setMediaCreatorUsername((string)$mdata["creator"][0]);
			$item->setMediaCreatorRealname((string)$mdata["creator"][0]);
		}
		else{
			$item->setMediaCreatorUsername('Unknown');
			$item->setMediaCreatorRealname('Unknown');
		}
		
	
		$newUrl = str_replace( "details" , "download" , $originalUrl);
		$type = (string)$mdata["mediatype"][0];
	
		if($type == 'movingImage' || $type == 'movies')
		{	
			$index=0;
			$format="mp4";
			
			for($i=0;$i<sizeof($fileKeys);$i++)
			{
			    if(strstr($fileKeys[$i],$format)&&$index==0) 
    			{
    				$index=$i;
    			}
			}
			
			$item->setMediaType('Video');
			$item->setLayerType('Video');
			$item->setUri($newUrl.$fileKeys[$index]);
		}
		
		else if($type=='audio')
		{	
			$index=0;
			$format="mp3";
		
			for($i=0;$i<sizeof($fileKeys);$i++)
			{
			    if(strstr($fileKeys[$i],$format)&&$index==0) 
			    {
				    $index=$i;
				}
			}
			
			$item->setMediaType('Audio');
			$item->setLayerType('Audio');
			$item->setUri($newUrl.$fileKeys[$index]);
		}
		
		else if($type=='image')
		{
			$index=0;
			$format="JPEG";
			for($i=0;$i<sizeof($fileKeys);$i++)
			{
			    if(strstr($fileKeys[$i],$format)&&$index==0) 
			    {
				    $index=$i;
				}
			}
			$item->setMediaType('Image');
			$item->setLayerType('Image');
			$item->setUri($newUrl.$fileKeys[$index]);
		}
		
		else return false;	
		
		$item->setArchive('InternetArchive');
		
		return $this->returnResponse($item, true, false);
	}
}
