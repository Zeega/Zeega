<?php

namespace Zeega\ExtensionsBundle\Parser\Flickr;

use Zeega\ExtensionsBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;

use \DateTime;

class ParserFlickrTag extends ParserAbstract
{
	private static $license=array('','Attribution-NonCommercial-ShareAlike Creative Commons','Attribution-NonCommercial Creative 		
			Commons','Attribution-NonCommercial-NoDerivs Creative Commons','Attribution Creative Commons',
			'Attribution-ShareAlike Creative Commons','Attribution-NoDerivs Creative Commons','No known copyright restrictions');
	
	public function load($url, $parameters = null)
    {
        $loadCollectionItems = $parameters["load_child_items"];
        $regexMatches = $parameters["regex_matches"];
	    $setId = $regexMatches[1]; // bam
	    
		$f = new \Phpflickr_Phpflickr('97ac5e379fbf4df38a357f9c0943e140');
		
        $searchParameters = array(
            "tags"=>"planettakeout", 
            "per_page" => 500, 
            "tag_mode"=>"any", 
            "extras"=>"description, license, date_upload, date_taken, owner_name, geo, tags, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o", 
            "page"=>1
            );

        $currentPage = 1;

        $items = array();

        if(true !== $loadCollectionItems) {
            $searchParameters["per_page"] = 1;
        }

        while(1) {
            $searchParameters["page"] = $currentPage;
            $searchResults =  $f->photos_search($searchParameters);
            $photos = $searchResults['photo'];
            $pages = $searchResults['pages'];

            foreach($photos as $photo) {
                $item = new Item();
                $tags = array();

                if(isset($photo['tags'])) {
                    $item->setTags(explode(" ", $photo['tags']));
                }         
                
                if(isset($photo['datetaken'])) {
                    $item->setMediaDateCreated(new DateTime($photo['datetaken']));
                }    
                
                if(isset($photo['ownername'])) {
                    $item->setMediaCreatorUsername($photo['ownername']);
                }      

                if(isset($photo['latitude'])) {
                    $item->setMediaGeoLatitude($photo['latitude']);
                }   
                
                if(isset($photo['longitude'])) {
                    $item->setMediaGeoLatitude($photo['longitude']); 
                }  
                
                if(isset($photo['license'])) {
                    $item->setLicense(self::$license[$photo['license']]);    
                } else {
                    $item->setLicense('All Rights Reserved');
                }

                if(isset($photo["url_l"])) {
                    $item->setUri($photo['url_l']);  
                } else if (isset($photo["url_o"])) {
                    $item->setUri($photo['url_o']);
                } else if (isset($photo["url_m"])) {
                    $item->setUri($photo['url_m']);
                } else {
                    $item->setUri($photo['url_s']);
                }    

                if(isset($photo["description"])) {
                    $item->setDescription($photo['description']);
                } 
                
                $item->setTitle($photo['title']);
                $item->setAttributionUri("http://www.flickr.com/photos/".$photo["ownername"]."/".$photo["id"]);
                $item->setArchive('Flickr'); 
                $item->setMediaType('Image');
                $item->setLayerType('Image');
                $item->setChildItemsCount(0);
                
                array_push($items,$item);

                if(true !== $loadCollectionItems) {                    
                    return parent::returnResponse($items, true, true);
                }
            }

            if(($currentPage++ > $pages) || $currentPage > 10) {
                break;
            }
        }		
		
		return parent::returnResponse($items, true, true);
	}
}
