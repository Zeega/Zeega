<?php

namespace Zeega\IngestionBundle\Parser\Tumblr;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Document\Item;

use \DateTime;

class ParserTumblrTag extends ParserAbstract
{
    public function load($url, $parameters = null)
    {
        $regexMatches = $parameters["regex_matches"];
        $tag = $regexMatches[2];
        
        # API key should be moved into a conf file
        $apiKey = "F7zV5AJ9F5I2oKPydkeDcIRydMMm5iiyX3By8Mir6sjMZFpbFv"; 

        if(isset($regexMatches[3])){
            $apiCallUrl = "http://api.tumblr.com/v2/tagged?tag=" . $tag . "&api_key=" . $apiKey . "&before=" . $regexMatches[3];
        } else {
            $apiCallUrl = "http://api.tumblr.com/v2/tagged?tag=" . $tag . "&api_key=" . $apiKey;
        }

        $results_str = file_get_contents(($apiCallUrl));
        $results_json = json_decode($results_str);
        #print(var_dump($results_json));
        if($results_json->meta->status == 200){

            $items = array();

            foreach ( $results_json -> response as $currentPost ){
            
                

                switch($currentPost -> type){
                    case "photo":
                        $photoArray = $currentPost -> photos;
                        foreach ($photoArray as $photo){
                            $item = new Item();
                            $item->setMediaCreatorUsername($currentPost -> blog_name);
                            $item->setMediaCreatorRealname($currentPost -> blog_name);
                            $item->setArchive('Tumblr');
                            $item->setAttributionUri($currentPost->post_url);
                            $item->setChildItemsCount( 0 );
                            $item->setMediaDateCreated(new DateTime($currentPost -> date));
                            $item->setTags($currentPost -> tags);
                            $item->setTitle(ucwords(str_replace ( '-',' ', $currentPost->slug)));
                            $altSizes = $photo -> alt_sizes;
                            $img75px = end($altSizes);
                            $item->setMediaType('Image');
                            $item->setLayerType('Image');
                            $item->setThumbnailUrl($img75px -> url);
                            $item->setUri($photo -> original_size -> url);
                            $item->setMediaDateCreated(new DateTime($currentPost -> date));
                            $item->setChildItemsCount(0);
                            $item->setTags($currentPost -> tags);
                            $item->setAttributes( array( "timestamp"=> $currentPost -> timestamp, "id"=>$currentPost -> id, "apiRequestUrl"=> $apiCallUrl) );
                            array_push($items,$item); 
                        }
                        break;
                    
                 }  
            
            }


        }else{
            die("Failed to retrieve url " . $apiCallUrl);
        };
        return $this->returnResponse($items, true, true);
    }
}


