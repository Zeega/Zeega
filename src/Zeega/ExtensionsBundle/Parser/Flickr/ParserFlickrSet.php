<?php

namespace Zeega\ExtensionsBundle\Parser\Flickr;

use Zeega\CoreBundle\Parser\Base\ParserCollectionAbstract;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;

use \DateTime;

class ParserFlickrSet extends ParserCollectionAbstract
{
	private static $license=array('','Attribution-NonCommercial-ShareAlike Creative Commons','Attribution-NonCommercial Creative 		
			Commons','Attribution-NonCommercial-NoDerivs Creative Commons','Attribution Creative Commons',
			'Attribution-ShareAlike Creative Commons','Attribution-NoDerivs Creative Commons','No known copyright restrictions');
	
	private $itemParser;
	
	function __construct() 
	{
		$this->itemParser = new ParserFlickrPhoto();
	}
	
	public function getInfo($url, $setId)
	{
		$f = new \Phpflickr_Phpflickr('97ac5e379fbf4df38a357f9c0943e140');
		$setInfo = $f->photosets_getInfo($setId);

		$collection = new Item();
		$ownerInfo = $f->people_getInfo($setInfo["owner"]);

		$collection->setTitle($setInfo["title"]);
		$collection->setDescription($setInfo["description"]);
		$collection->setMediaType('Collection');
	    $collection->setLayerType('Flickr');
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
		
		return parent::returnResponse($collection, true, true);
	}
	
	public function getCollection($url, $setId, $collection)
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
				$item = $this->itemParser->getItem("", $photo['id']);
				$collection->addItem($item["items"]);
			}
			
			return $this->returnResponse($collection, true, true);
		}
		return $this->returnResponse($collection, false, true);
	}
}
