<?php

namespace Zeega\ExtensionsBundle\Parser\Flickr;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;

use \DateTime;

class ParserFlickrTag extends ParserAbstract
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
        $loadCollectionItems = $parameters["load_child_items"];
        $regexMatches = $parameters["regex_matches"];
	    $setId = $regexMatches[1]; // bam
	    
		$f = new \Phpflickr_Phpflickr('97ac5e379fbf4df38a357f9c0943e140');
		$searchResults =  $f->photos_search(array("tags"=>"planettakeout", "per_page" => 500, "tag_mode"=>"any", "extras"=>"description, license, date_upload, date_taken, owner_name, geo, tags, url_l, url_o"));

		$collection = new Item();
		
		$collection->setTitle("Planet Takeout photos");
		$collection->setDescription("Planet Takeout description");
		$collection->setMediaType('Collection');
	    $collection->setLayerType('Flickr');
		$collection->setAttributionUri("http://www.flickr.com/photos/tags/planettakeout/");

        $collection->setChildItemsCount($setInfo["count_photos"]);

		$collection->setMediaCreatorUsername("Planet Takeout");
        $collection->setMediaCreatorRealname("Planet Takeout");
		$collection->setMediaDateCreated(new \DateTime());
		
		if($loadCollectionItems == true)
		{
            $photos = $searchResults['photo'];

    		if($photos)
    		{
    			foreach($photos as $photo)
    			{
                    $item = new Item();
                    $tags = array();

                    if(isset($photo['tags'])) $item->setTags(explode(" ", $photo['tags']));
                    if(isset($photo['datetaken'])) $item->setMediaDateCreated(new DateTime($photo['datetaken']));
                    if(isset($photo['ownername'])) $item->setMediaCreatorUsername($photo['ownername']);
                    if(isset($photo['latitude'])) $item->setMediaGeoLatitude($photo['latitude']);
                    if(isset($photo['longitude'])) $item->setMediaGeoLatitude($photo['longitude']);

                    if(isset($photo['license']))  $item->setLicense(self::$license[$photo['license']]);
                    else $item->setLicense('All Rights Reserved');

                    // $item->setThumbnailUrl($sizes['Square']['source']);

                    $item->setTitle($photo['title']);
                    $item->setAttributionUri("http://www.flickr.com/photos/".$photo["ownername"]."/".$photo["7939455914"]);
                    $item->setArchive('Flickr'); 
                    $item->setMediaType('Image');
                    $item->setLayerType('Image');
                    $item->setUri($photo['url_l']);
                    $item->setChildItemsCount(0);
                    $item->setDescription($photo['description']);
	    			
                    $collection->addItem($item);
    			}
    		}
		}
		
		return parent::returnResponse($collection, true, true);
	}
}
