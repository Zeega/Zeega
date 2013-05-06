<?php

namespace Zeega\IngestionBundle\Parser\Giphy;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Document\Item;
use Symfony\Component\HttpFoundation\Response;

use \DateTime;

class ParserGiphyItem extends ParserAbstract
{
    public function load($url, $parameters = null)
    {
        if ( isset($parameters) ) {
            if ( isset($parameters["regex_matches"][1]) ) {
                $id = $parameters["regex_matches"][1];

                $embedApiUrl = "http://giphy.com/api/gifs/$id";
                
                $embedInfo = file_get_contents($embedApiUrl,0,null,null);
                $embedInfo = json_decode($embedInfo,true);
                
                if(null != $embedInfo && isset($embedInfo["data"])) {
                    $mediaDetails = $embedInfo["data"];
                    $id = $mediaDetails["id"];

                    $item = new Item();
                    $item->setMediaCreatorUsername("Unknown");
                    $item->setMediaCreatorRealname("Unknown");
                    $item->setMediaType('Image');
                    $item->setLayerType('Image');
                    $item->setArchive('Giphy');
                    $item->setUri("http://media.giphy.com/media/$id/original.gif");
                    $item->setAttributionUri($mediaDetails['bitly_gif_url']);
                    
                    if ( isset($mediaDetails['date']) ) {
                        $item->setMediaDateCreated(DateTime::createFromFormat('U', $mediaDetails['date']));                    
                    } else if ( isset($mediaDetails['tumblr_date']) ) {
                        $item->setMediaDateCreated(DateTime::createFromFormat('U', $mediaDetails['tumblr_date']));
                    }
                    
                    $item->setThumbnailUrl($mediaDetails['image_fixed_width_still_url']);
                    
                    $tags = $mediaDetails["tags"]; 
                    if(isset($tags)) {
                        $itemTags = array();
                        $first = true;
                        foreach($tags as $tag) {
                            $itemTags[] = $tag["name_encoded"];

                            if ( $first ) {
                                $item->setTitle($tag["name"]);
                                $first = false;
                            }
                        }

                        $item->setTags($itemTags);
                    }

                    return $this->returnResponse(array($item), true, false);
                }
            }
        }
        

        return $this->returnResponse(array(), false, true);
    }
}
