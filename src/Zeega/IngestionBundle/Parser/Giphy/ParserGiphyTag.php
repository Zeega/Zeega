<?php

namespace Zeega\IngestionBundle\Parser\Giphy;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Document\Item;
use Symfony\Component\HttpFoundation\Response;

use \DateTime;

class ParserGiphyTag extends ParserAbstract
{
    public function load($url, $parameters = null)
    {
        if ( isset($parameters) ) {
            if ( isset($parameters["regex_matches"][1]) ) {
                $tag = $parameters["regex_matches"][1];

                //$embedApiUrl = "http://giphy.com/api/gifs?tag=$tag&page=1&size=50";
                

                if( $parameters["regex_matches"][2] ){
                    $offset = $parameters["regex_matches"][2];
                    $embedApiUrl = "http://api.giphy.com/v1/gifs/search?q=$tag&api_key=Uy5fohPTSnze8&offset=$offset&limit=50";
                } else {
                    $embedApiUrl = "http://api.giphy.com/v1/gifs/search?q=$tag&api_key=Uy5fohPTSnze8&limit=50";
                }
                




                $embedInfo = file_get_contents($embedApiUrl,0,null,null);
                $embedInfo = json_decode($embedInfo,true);
                
                

                $items = array();
                if( $embedInfo["pagination"]["total_count"] > $embedInfo["pagination"]["offset"] + $embedInfo["pagination"]["count"]){
                    $more = true;
                } else {
                    $more = false;
                }

                if(null != $embedInfo && isset($embedInfo["data"])) {
                    $itemsJson = $embedInfo["data"];
                    foreach($itemsJson as $itemJson) {

                        $id = $itemJson["id"];

                        $item = new Item();

                        $item->setMediaCreatorUsername("Unknown");
                        $item->setMediaCreatorRealname("Unknown");
                        $item->setMediaType("Image");
                        $item->setLayerType("Image");
                        $item->setArchive("Giphy");
                        $item->setUri( $itemJson["images"]["original"]["url"] );
                        $item->setAttributionUri($itemJson["bitly_gif_url"]);
                        

                        $title = "#" . implode( " #", $itemJson["tags"] );
                        $item->setTitle($title);



                       
                        
                        if( ( int ) $itemJson["images"]["fixed_width_still"]["width"] >  200 || ( int) $itemJson["images"]["fixed_width_still"]["height"] >  200 ){
                            $item->setThumbnailUrl( $itemJson["images"]["fixed_height_still"]["url"]);
                            $width = ( int ) $itemJson["images"]["fixed_height_still"]["width"];
                            $height = ( int ) $itemJson["images"]["fixed_height_still"]["height"];
                        } else {
                            $item->setThumbnailUrl( $itemJson["images"]["fixed_width_still"]["url"]);
                            $width = ( int ) $itemJson["images"]["fixed_width_still"]["width"];
                            $height = ( int ) $itemJson["images"]["fixed_width_still"]["height"];
                        }

                        $item->setAttributes(array("id" => $id, "width"=>$width, "height"=>$height ));
                         array_push($items,$item);
                    }

                }
            }
        }
        

        return $this->returnResponse($items, true, true, "", $more);
    }

}
