<?php

namespace Zeega\IngestionBundle\Parser\Flickr;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;

use \DateTime;

class ParserFlickrSet extends ParserAbstract
{
	private static $license=array('','Attribution-NonCommercial-ShareAlike Creative Commons','Attribution-NonCommercial Creative 		
			Commons','Attribution-NonCommercial-NoDerivs Creative Commons','Attribution Creative Commons',
			'Attribution-ShareAlike Creative Commons','Attribution-NoDerivs Creative Commons','No known copyright restrictions');
	
	private $itemParser;
	
	function __construct() 
	{
		$this->itemParser = new ParserFlickrPhoto();
	}
	
	public function load($url, $parameters = null)
    {
        require_once(__DIR__.'/../../../../../vendor/phpflickr/lib/Phpflickr/Phpflickr.php');
        $loadCollectionItems = $parameters["load_child_items"];
        $regexMatches = $parameters["regex_matches"];
	    $setId = $regexMatches[1]; // bam
	    
		$f = new \Phpflickr_Phpflickr('97ac5e379fbf4df38a357f9c0943e140');
		$setInfo = $f->photosets_getInfo($setId);

		$collection = new Item();
		$ownerInfo = $f->people_getInfo($setInfo["owner"]);

		$collection->setTitle($setInfo["title"]);
		$collection->setDescription($setInfo["description"]);
		$collection->setMediaType('Collection');
	    $collection->setLayerType('Flickr');
        $collection->setArchive('Flickr');
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
		if(isset($sizes['Large']))$itemSize='Large';
		elseif(isset($sizes['Original'])) $itemSize='Original';
		elseif(isset($sizes['Medium'])) $itemSize='Medium';
		else $itemSize='Small';

		$collection->setUri($sizes[$itemSize]['source']);
		
		if($loadCollectionItems == true)
		{
            $page = 1;

            while(1) {
    		 	$setPhotos = $f->photosets_getPhotos($setId,null,null,500,$page);
    		 	$photos = $setPhotos['photoset']['photo'];

        		if(null !== $photos) {
        			$ownerInfo = $f->people_getInfo($setInfo["owner"]);
        			$collection->setChildItemsCount(count($photos));

        			foreach($photos as $photo)
        			{
        				$item = $this->itemParser->load(null, array("photo_id" => $photo['id']));
        				if(isset($item))
    	    				$collection->addChildItem($item["items"][0]);
        			}
        		} else {
                    break;
                }

                if($page > 10) {
                    break;
                }
		++$page; 
                
            }
		}
		
		return parent::returnResponse($collection, true, true);
	}
}
