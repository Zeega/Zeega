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
     * Parses a single item from the $url.
     *
     * @param String  $url  The url to be checked.
	 * @return boolean|success
     */
	public function parseSingleItem($url,$itemId)
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
			//return $sizes;
			$item->setThumbnailUrl($sizes['Square']['source']);
			$metadata->setThumbnailUrl($sizes['Small']['source']);

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

			return parent::returnResponse($item, true);
		}
		else{
			return parent::returnResponse($item, false);
		}
	}
	
	/**
     * Parses a single item from the $url and adds the associated media to the database.
     *
     * @param String  $url  The url to be checked.
	 * @return boolean|success
     */
	public function getSetInfo($url, $setId)
	{
		$f = new \Phpflickr_Phpflickr('97ac5e379fbf4df38a357f9c0943e140');
		$setInfo = $f->photosets_getInfo($setId);

		$collection = new Item();
		$ownerInfo = $f->people_getInfo($setInfo["owner"]);

		$collection->setTitle($setInfo["title"]);
		$collection->setDescription($setInfo["description"]);
		$collection->setType('Collection');
	    $collection->setSource('Flickr');
	    $collection->setUri('http://zeega.org');
		$collection->setAttributionUri($url);

        $collection->setChildItemsCount($setInfo["count_photos"]);

		$collection->setMediaCreatorUsername($ownerInfo["path_alias"]);
        $collection->setMediaCreatorRealname($ownerInfo["username"]);
		$collection->setMediaDateCreated(new \DateTime());
		
		if(isset($setInfo["primary"]))
		{
			$size = $f->photos_getSizes($setInfo["primary"]);
			foreach ($size as $s)
			{
				$sizes[$s['label']]=array('width'=>$s['width'],'height'=>$s['height'],'source'=>$s['source']);
			}	
		}
		$collection->setThumbnailUrl($sizes['Square']['source']);
		
		return parent::returnResponse($collection, true);
	}
	
	
	/**
     * Parses the set of media from the $url and adds the associated media to the database.
     *
     * @param String  $url  The url to be parsed.
	 * @return boolean|success
     */	
	public function parseSet($url, $setId)
	{
		$f = new \Phpflickr_Phpflickr('97ac5e379fbf4df38a357f9c0943e140');
		$setPhotos = $f->photosets_getPhotos($setId);
		$setInfo = $f->photosets_getInfo($setId);
		
		$photos = $setPhotos['photoset']['photo'];

		$collection = new Item();

		if($photos)
		{
			$ownerInfo = $f->people_getInfo($setInfo["owner"]);
			
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
			
			return parent::returnResponse($collection, true);
		}
		return parent::returnResponse($collection, false);
	}
	
	public function parseSetItems($setId, $collection)
	{
		$f = new \Phpflickr_Phpflickr('97ac5e379fbf4df38a357f9c0943e140');
		$setPhotos = $f->photosets_getPhotos($setId);
		$setInfo = $f->photosets_getInfo($setId);
		
		$photos = $setPhotos['photoset']['photo'];

		if($photos)
		{
			$ownerInfo = $f->people_getInfo($setInfo["owner"]);
			$collection->setChildItemsCount(count($photos));
			
			foreach($photos as $photo)
			{
				$item = $this->parseSingleItem("", $photo['id']);
				$collection->addItem($item["items"]);
			}
			
			return parent::returnResponse($collection, true);
		}
		return parent::returnResponse($collection, false);
	}
}
