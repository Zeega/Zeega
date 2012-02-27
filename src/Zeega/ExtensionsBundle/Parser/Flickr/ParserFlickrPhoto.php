<?php

namespace Zeega\ExtensionsBundle\Parser\Flickr;

use Zeega\CoreBundle\Parser\Base\ParserItemAbstract;
use Zeega\DataBundle\Entity\Media;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\Metadata;

use \DateTime;

class ParserFlickrPhoto extends ParserItemAbstract
{
	private static $license=array('','Attribution-NonCommercial-ShareAlike Creative Commons','Attribution-NonCommercial Creative 		
			Commons','Attribution-NonCommercial-NoDerivs Creative Commons','Attribution Creative Commons',
			'Attribution-ShareAlike Creative Commons','Attribution-NoDerivs Creative Commons','No known copyright restrictions');
	
	public function getItem($url,$itemId)
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

			$item->setArchive('Flickr'); 
			$item->setMediaType('Image');
			$item->setLayerType('Image');
			$metadata->setAttributes($attr);
			$item->setMedia($media);
			$item->setMetadata($metadata);

			return $this->returnResponse($item, true);
		}
		else{
			return $this->returnResponse($item, false);
		}
	}
}
