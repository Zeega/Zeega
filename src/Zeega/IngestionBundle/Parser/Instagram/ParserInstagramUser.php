<?php

namespace Zeega\IngestionBundle\Parser\Instagram;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;
use Symfony\Component\HttpFoundation\Response;

use \DateTime;

class ParserInstagramUser extends ParserAbstract
{
    public function load($url, $parameters = null)
    {
        if ( isset($parameters) ) {
            if ( isset($parameters["regex_matches"][1]) ) {
                $userName = $parameters["regex_matches"][1];

                $userUrl = "https://api.instagram.com/v1/users/search?q=$userName&access_token=1907240.f59def8.6a53e4264d87413a8e8cd431430b6e94";

                $userInfo = file_get_contents($userUrl,0,null,null);
                $userInfo = json_decode($userInfo,true);

                if(null != $userInfo ){
                    $userId = $userInfo["data"][ 0 ]["id"];
                

                    $photoUrl = "https://api.instagram.com/v1/users/$userId/media/recent?access_token=1907240.f59def8.6a53e4264d87413a8e8cd431430b6e94";
            
                    $photoInfo = file_get_contents( $photoUrl, 0, null, null );
                    $photoInfo = json_decode( $photoInfo, true );
                    
                    $items = array();

                    if(null != $photoInfo && isset($photoInfo["data"])) {
                        $itemsJson = $photoInfo["data"];
                        foreach($itemsJson as $itemJson) {
                            $item = new Item();

                            
                            $item->setMediaCreatorUsername( $itemJson["user"]["username"] );
                            $item->setMediaCreatorRealname( $itemJson["user"]["username"] );
                            $item->setMediaType( "Image" );
                            $item->setLayerType( "Image" );
                            $item->setArchive( "Instagram" );
                            $item->setUri( $itemJson["images"]["standard_resolution"]["url"] );
                            $item->setAttributionUri( $url );
                            $item->setThumbnailUrl($itemJson["images"]["low_resolution"]["url"]);

                             array_push($items,$item);
                        }

                    }
                }
            }
        }
        

        return $this->returnResponse($items, true, true);
    }

}
