<?php

namespace Zeega\ExtensionsBundle\Parser\Tumblr;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
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
        if($results_json->meta->status == 200){
			$item = new Item();
        	$currentPost = $results_json -> response -> posts[0];
            print($currentPost -> type);
        	switch($currentPost -> type){
        		case "photo":
                    $altSizes = $currentPost -> photos[0] -> alt_sizes;
                    $img75px = end($altSizes);
		    		$item->setUri($currentPost -> photos[0] -> original_size -> url);
		    		$item->setMediaType('Image');
		    		$item->setLayerType('Image');
		    		$item->setTitle($currentPost -> caption);
		    		$item->setAttributionUri($currentPost -> source_url);
		    		$item->setChildItemsCount(0);
		    		$item->setMediaDateCreated(new DateTime($currentPost -> date));
                    $item->setArchive('Tumblr');
                    $item->setMediaCreatorUsername($results_json -> response -> blog -> name);
                    $item->setMediaCreatorRealname('Unknown');
                    $item->setThumbnailUrl($img75px -> url);
                    $item->setTags($currentPost -> tags);
        			break;
                case "video": # not finished
                    die("Video postings not yet supported.");
                    $item->setUri($currentPost -> audio_url);
                    $item->setMediaType('Video');
                    $item->setLayerType('Video');
                    $item->setTitle($currentPost -> caption);
                    #$item->setAttributionUri($currentPost -> source_url);
                    $item->setChildItemsCount(0);
                    $item->setMediaDateCreated(new DateTime($currentPost -> date));
                    $item->setArchive('Tumblr');
                    $item->setMediaCreatorUsername($results_json -> response -> blog -> name);
                    break;
                case "audio": # not finished
                    die("Video postings not yet supported.");
                    $item->setUri($currentPost -> audio_url);
                    $item->setMediaType('Audio');
                    $item->setLayerType('Audio');
                    $item->setTitle($currentPost -> caption);
                    #$item->setAttributionUri($currentPost -> source_url);
                    $item->setChildItemsCount(0);
                    $item->setMediaDateCreated(new DateTime($currentPost -> date));
                    $item->setArchive('Tumblr');
                    $item->setMediaCreatorUsername($results_json -> response -> blog -> name);
                    break;
                case "text": # not finished
                    die("Video postings not yet supported.");
                    $item->setUri($currentPost -> body);
                    $item->setMediaType('tumblr_text');
                    $item->setLayerType('Text');
                    $item->setTitle($currentPost -> title);
                    $item->setAttributionUri($currentPost -> source_url);
                    $item->setChildItemsCount(0);
                    $item->setMediaDateCreated(new DateTime($currentPost -> date));
                    $item->setArchive('Tumblr');
                    $item->setMediaCreatorUsername($results_json -> response -> blog -> name);
                    $item->setTags($currentPost -> tags);
                    break;
                case "quote": # not finished
                    die("Video postings not yet supported.");
                    $item->setUri($currentPost -> photos[0] -> original_size -> url);
                    $item->setMediaType('tumblr_quote');
                    $item->setLayerType('Text');
                    $item->setTitle($currentPost -> caption);
                    $item->setAttributionUri($currentPost -> source_url);
                    $item->setChildItemsCount(0);
                    $item->setMediaDateCreated(new DateTime($currentPost -> date));
                    $item->setArchive('Tumblr');
                    $item->setMediaCreatorUsername($results_json -> response -> blog -> name);
                    break;
		     }

    		#print(var_dump($item));
        }else{
        	die("Failed to retrieve url " . $apiCallUrl);
        };
        return $this->returnResponse($item, true, false);
	}
}


