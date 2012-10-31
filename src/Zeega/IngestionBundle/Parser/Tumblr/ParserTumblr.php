<?php

namespace Zeega\IngestionBundle\Parser\Tumblr;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;

use \DateTime;

class ParserTumblr extends ParserAbstract
{
	public function load($url, $parameters = null)
    {
        $regexMatches = $parameters["regex_matches"];
        $blogHostname = $regexMatches[1] . ".tumblr.com"; 
        $postId = $regexMatches[2]; 
        # API key should be moved into a conf file
        $apiKey = "F7zV5AJ9F5I2oKPydkeDcIRydMMm5iiyX3By8Mir6sjMZFpbFv"; 
        $apiCallUrl = "http://api.tumblr.com/v2/blog/" . $blogHostname . "/posts?api_key=" . $apiKey . "&id=" . $postId;
        $results_str = file_get_contents(($apiCallUrl));
        $results_json = json_decode($results_str);
        #print(var_dump($results_json));
        if($results_json->meta->status == 200){
			$item = new Item();
        	$currentPost = $results_json -> response -> posts[0];
			$item->setMediaCreatorUsername($results_json -> response -> blog -> name);
			$item->setMediaCreatorRealname($results_json -> response -> blog -> name);
        	switch($currentPost -> type){
        		case "photo":
                    $photoArray = $currentPost -> photos;
                    $item->setArchive('Tumblr');
                    $item->setAttributionUri($currentPost->post_url);
                    $item->setChildItemsCount(count($photoArray)-1);
                    $item->setMediaDateCreated(new DateTime($currentPost -> date));
                    $item->setTags($currentPost -> tags);
                    $item->setTitle(ucwords(str_replace ( '-',' ', $currentPost->slug)));
                    if(count($photoArray) == 1){
                        $altSizes = $currentPost -> photos[0] -> alt_sizes;
                        $img75px = end($altSizes);
                        $item->setMediaType('Image');
                        $item->setLayerType('Image');
                        $item->setThumbnailUrl($img75px -> url);
                        $item->setUri($currentPost -> photos[0] -> original_size -> url);
                        $item->setMediaDateCreated(new DateTime($currentPost -> date));
                        $item->setChildItemsCount(0);
                        $item->setTags($currentPost -> tags);
                    }else{
                        $item->setMediaType('Collection');
                        $item->setLayerType('Collection');
                        for($pi=0; $pi < count($photoArray); $pi++){
                            $photoItem = $photoArray[$pi];
                            #print(var_dump($photoItem));
                            #print("***");
                            #print($photoItem -> original_size -> url);
                            $altSizes = $photoItem -> alt_sizes;
                            $img75px = end($altSizes);
                            $childItem = new Item();
                            $childItem->setMediaType('Image');
                            $childItem->setLayerType('Image');
                            $childItem->setThumbnailUrl($img75px -> url);
                            $childItem->setUri($photoItem -> original_size -> url);
                            if(strlen($photoItem -> caption)>0) $childItem->setTitle(strip_tags($currentPost -> caption));
                            else $childItem->setTitle(ucwords(str_replace ( '-',' ', $currentPost->slug)));
                            $childItem->setMediaDateCreated(new DateTime($currentPost -> date));
                            $childItem->setAttributionUri($currentPost->post_url);
                            $childItem->setChildItemsCount(0);
                            $childItem->setMediaCreatorUsername($results_json -> response -> blog -> name);
                            $childItem->setMediaCreatorRealname($results_json -> response -> blog -> name);
                            $childItem->setTags($currentPost -> tags);
                            $item->addChildItem($childItem);
                        }
                    }
        			break;
                case "video": # not finished
                    die("Video postings not yet supported.");
                    $item->setUri($currentPost -> audio_url);
                    $item->setMediaType('Video');
                    $item->setLayerType('Video');
					$item->setTitle(ucwords(str_replace ( '-',' ', $currentPost->slug)));
                    $item->setChildItemsCount(0);
                    $item->setMediaDateCreated(new DateTime($currentPost -> date));
                    $item->setArchive('Tumblr');
                    break;
                case "audio": # not finished
                    die("Audio postings not yet supported.");
                    $item->setUri($currentPost -> audio_url);
                    $item->setMediaType('Audio');
                    $item->setLayerType('Audio');
                    $item->setTitle(ucwords(str_replace ( '-',' ', $currentPost->slug)));
                    $item->setChildItemsCount(0);
                    $item->setMediaDateCreated(new DateTime($currentPost -> date));
                    $item->setArchive('Tumblr');
                    break;
                case "text": # not finished
                    die("Text postings not yet supported.");
                    $item->setUri($currentPost -> body);
                    $item->setMediaType('tumblr_text');
                    $item->setLayerType('Text');
                    $item->setTitle(ucwords(str_replace ( '-',' ', $currentPost->slug)));
                    $item->setChildItemsCount(0);
                    $item->setMediaDateCreated(new DateTime($currentPost -> date));
                    $item->setArchive('Tumblr');
                    $item->setTags($currentPost -> tags);
                    break;
                case "quote": # not finished
                    die("Quote postings not yet supported.");
                    $item->setUri($currentPost -> photos[0] -> original_size -> url);
                    $item->setMediaType('tumblr_quote');
                    $item->setLayerType('Text');
                    $item->setTitle(ucwords(str_replace ( '-',' ', $currentPost->slug)));
                    $item->setChildItemsCount(0);
                    $item->setMediaDateCreated(new DateTime($currentPost -> date));
                    $item->setArchive('Tumblr');
                    break;
		     }
        }else{
        	die("Failed to retrieve url " . $apiCallUrl);
        };
        return $this->returnResponse($item, true, false);
	}
}


