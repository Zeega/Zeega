<?php

namespace Zeega\IngestBundle\Parser;

use Zeega\IngestBundle\Entity\Media;
use Zeega\IngestBundle\Entity\Tag;
use Zeega\IngestBundle\Entity\Item;
use Zeega\IngestBundle\Entity\Metadata;

use \DateTime;

/**
 * Flickr data parser.
 *
 */
class ParserFlickr extends ParserAbstract
{
	private static $license=array('','Attribution-NonCommercial-ShareAlike Creative Commons','Attribution-NonCommercial Creative 		
			Commons','Attribution-NonCommercial-NoDerivs Creative Commons','Attribution Creative Commons',
			'Attribution-ShareAlike Creative Commons','Attribution-NoDerivs Creative Commons','No known copyright restrictions');
	
	/**
     * Returns true if the $url is supported by the parser.
     *
     * @param String  $url  The url to be parsed.
	 * @return boolean|supported
     */
	public function isUrlSupported($url)
	{
		/* Info fROM: http://www.flickr.com/services/api/misc.urls.html
		http://www.flickr.com/photos/{user-id}/ - photostream
		http://www.flickr.com/photos/{user-id}/{photo-id} - individual photo
		http://www.flickr.com/photos/{user-id}/sets/ - all photosets
		http://www.flickr.com/photos/{user-id}/sets/{photoset-id} - single photoset
		*/
		return strstr($url,'flickr.com')&&strstr($url,'/photos/')&&!strstr($url,'/sizes/');
	}
	
	/**
     * Parses a single item from the $url and adds the associated media to the database.
     *
     * @param String  $url  The url to be checked.
	 * @return boolean|success
     */
	public function parseSingleItem($url)
	{
		$id = $this->getItemId($url);
		return $this->parseItem($id);
	}
	
	/**
     * Parses the set of media from the $url and adds the associated media to the database.
     *
     * @param String  $url  The url to be parsed.
	 * @return boolean|success
     */	
	public function parseSet($url)
	{
		$setId = $this->getItemId($url);
		
		$f = new \Phpflickr_Phpflickr('97ac5e379fbf4df38a357f9c0943e140');
		$setPhotos = $f->photosets_getPhotos($setId);
		$setInfo = $f->photosets_getInfo($setId);
		
		$photos = $setPhotos['photoset']['photo'];
		
		if($photos)
		{
			$ownerInfo = $f->people_getInfo($setInfo["owner"]);
			//return var_dump($ownerInfo);
			$collection = new Item();
			
			$collection->setTitle($setInfo["title"]);
			$collection->setDescription($setInfo["description"]);
			$collection->setType('Collection');
		    $collection->setSource('Flickr');
		    $collection->setUri('http://zeega.org');
			$collection->setAttributionUri($url);
		    
	        $collection->setChildItemsCount(0);
	        
			$collection->setMediaCreatorUsername($ownerInfo["path_alias"]);
	        $collection->setMediaCreatorRealname($ownerInfo["username"]);
			$collection->setMediaDateCreated(new \DateTime());
	        
			$thumbnailUrlIsSet = false;
			
			$collection->setChildItemsCount(count($photos));
			
			foreach($photos as $photo)
			{
				$item = $this->parseItem($photo['id']);
				if(!$thumbnailUrlIsSet) 
				{
					$collection->setThumbnailUrl($item->getThumbnailUrl());
					$thumbnailUrlIsSet = true;
				}
				$collection->addItem($item);
			}
			
			return $collection;
		}
	}

	/*  PRIVATE METHODS */

	private function getItemId($url)
	{
		if(strstr($url,'flickr.com')&&strstr($url,'/photos/')&&!strstr($url,'/sizes/'))
		{
			if(strstr($url,'sets'))
			{
				$split = explode('/sets/',$url);
				$split = explode('/',$split[1]);
				$id = $split[0];
			}
			else 
			{
				$split = explode('/photos/',$url);
				$split = explode('/',$split[1]);
				$id = $split[1];
			}

			return $id;
		}
		return -1;
	}
	
	private function parseItem($itemId)
	{
		$f = new \Phpflickr_Phpflickr('97ac5e379fbf4df38a357f9c0943e140');
		$info = $f->photos_getInfo($itemId);
		$size = $f->photos_getSizes($itemId);
	
		if(is_array($info)&&is_array($size)) // why?
		{
			$item = new Item();
			$metadata = new Metadata();
			$media = new Media();
			$tags = array();
			
			$item->setAttributionUri($info['urls']['url'][0]['_content']);
			
			if($info['tags'])
			{
				foreach($info['tags']['tag'] as $tag)
				{
					array_push($tags, ucwords(strtolower($tag['raw'])));
				}
				$attr['tags']=$tags;
			}
			else
			{
				$attr['tags']='';
			}
			
			foreach ($size as $s)
			{
				$sizes[$s['label']]=array('width'=>$s['width'],'height'=>$s['height'],'source'=>$s['source']);
			}	
			
			$metadata->setThumbnailUrl($sizes['Square']['source']);
			//$metadata->setThumbnailUrl($sizes['Small']['source']);
			
			$attr = array('farm'=>$info['farm'],'server'=>$info['server'],'id'=>$info['id'],'secret'=>$info['secret']);
			if(isset($sizes['Original'])) $attr['originalsecret']=$info['originalsecret'];

			if(isset($sizes['Large']))$itemSize='Large';
			elseif(isset($sizes['Original'])) $itemSize='Original';
			elseif(isset($sizes['Medium'])) $itemSize='Medium';
			else $itemSize='Small';
			
			if($info['dates']['taken']) $item->setMediaDateCreated(new DateTime($info['dates']['taken']));
			
			$item->setUri($sizes[$itemSize]['source']);
			$item->setChildItemsCount(0);
			$media->setWidth($sizes[$itemSize]['width']);
			$media->setHeight($sizes[$itemSize]['height']);
			
			$attr['sizes']=$sizes;
			$item->setDescription($info['description']);
			
			if($info['license'])$metadata->setLicense(self::$license[$info['license']]);
			else $metadata->setLicense('All Rights Reserved');
		
			if($info['owner']['username']) $item->setMediaCreatorUsername($info['owner']['username']);
			else $item->setMediaCreatorUsername($info['owner']['realname']);
			$item->setMediaCreatorRealname($info['owner']['realname']);
			$attr['creator_nsid']=$info['owner']['nsid'];
			$item->setTitle($info['title']);
			
			if(array_key_exists ('location',$info)){
				if($info['location']['latitude']){
					$item->setMediaGeoLatitude($info['location']['latitude']);
					$item->setMediaGeoLongitude($info['location']['longitude']);
				}
			}
		
			$metadata->setArchive('Flickr'); 
			$item->setType('Image');
			$item->setSource('Image');
			$metadata->setAttributes($attr);
			$item->setMedia($media);
			$item->setMetadata($metadata);

			return $item;	
		}
		else{
			return false;
		}
	}
}
