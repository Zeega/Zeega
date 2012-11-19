<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\IngestionBundle\Parser\Flickr;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;

use \DateTime;

class ParserFlickrTag extends ParserAbstract
{
	private static $license=array('','Attribution-NonCommercial-ShareAlike Creative Commons','Attribution-NonCommercial Creative 		
			Commons','Attribution-NonCommercial-NoDerivs Creative Commons','Attribution Creative Commons',
			'Attribution-ShareAlike Creative Commons','Attribution-NoDerivs Creative Commons','No known copyright restrictions');
	
	public function load($url, $parameters = null)
    {
        require_once(__DIR__.'/../../../../../vendor/phpflickr/lib/Phpflickr/Phpflickr.php');

        $flickrAuthenticationKey = $parameters["authentication_key"];
        $loadCollectionItems = $parameters["load_child_items"];
        $checkForDuplicates = (bool) $parameters["check_for_duplicates"];
        $tags = $parameters["tags"];
        $user = $parameters["user"]; 
        $originalItems = null;

        $searchParameters = array(
            "tags"=>$tags,
            "tag_mode"=>"any",
            "extras"=>"path_alias, description, license, date_upload, date_taken, owner_name, geo, tags, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o",
            "page"=>1,
            "per_page"=>500
        );

        if(FALSE !== $checkForDuplicates) {
            $em = $parameters["entityManager"];
            $originalItems = $em->getRepository('ZeegaDataBundle:Item')->findUriByUserArchive($user->getId(), "Flickr");
            
            if(isset($originalItems)) {
                $checkForDuplicates = TRUE;
            } else {
                $checkForDuplicates = FALSE;    
            }
        } else {
            $checkForDuplicates = FALSE;
        } 

        echo $checkForDuplicates;
		$f = new \Phpflickr_Phpflickr("97ac5e379fbf4df38a357f9c0943e140");
        $currentPage = 1;
        $items = array();

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
                    $item->setMediaGeoLongitude($photo['longitude']); 
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
                $item->setAttributionUri("http://www.flickr.com/photos/".$photo["pathalias"]."/".$photo["id"]."/");
                
                $item->setArchive('Flickr'); 
                $item->setMediaType('Image');
                $item->setLayerType('Image');
                $item->setChildItemsCount(0);
                if(TRUE === $checkForDuplicates) {
                    echo $item->getAttributionUri();
                    if(FALSE === array_key_exists($item->getAttributionUri(), $originalItems)) {
                        array_push($items,$item);
                    }
                } else {                    
                    array_push($items,$item);                    
                }

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
