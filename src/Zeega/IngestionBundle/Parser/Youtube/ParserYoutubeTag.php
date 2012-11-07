<?php

namespace Zeega\IngestionBundle\Parser\Youtube;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;

use \DateTime;
use SimpleXMLElement;

class ParserYoutubeTag extends ParserAbstract
{
	public function load($url, $parameters = null)
	{
	    $tags = $parameters["tags"];
	    $user = $parameters["user"];
	    $checkForDuplicates = (bool) $parameters["check_for_duplicates"];

		$apiUrl = "https://gdata.youtube.com/feeds/api/videos?alt=json&v=2&category=$tags";

		// read feed into SimpleXML object
		$videoList = json_decode(file_get_contents($apiUrl),true);
		$videos = $videoList["feed"];
		
		$items = array();

		if(FALSE !== $checkForDuplicates) {
            $em = $parameters["entityManager"];
            $originalItems = $em->getRepository('ZeegaDataBundle:Item')->findUriByUserArchive($user->getId(), "Youtube");
            
            if(isset($originalItems)) {
                $checkForDuplicates = TRUE;
            } else {
                $checkForDuplicates = FALSE;    
            }
        } else {
            $checkForDuplicates = FALSE;
        } 

		foreach ($videos["entry"] as $video) 
		{
			$accessControl = $video["yt\$accessControl"];
			foreach($accessControl as $access) {
				if($access["action"] !== "embed" || $access["permission"] !== "allowed") {

					if(TRUE === $checkForDuplicates) {
                        if(TRUE === array_key_exists($video["media\$group"]["media\$player"]["url"], $originalItems)) {
                            break;
                        }
                    } 

					$item= new Item();

					$item->setUri($video["media\$group"]["yt\$videoid"]["\$t"]);
					$item->setTitle($video["title"]["\$t"]);
					$item->setDescription($video["media\$group"]["media\$description"]["\$t"]);
					$item->setAttributionUri($video["media\$group"]["media\$player"]["url"]);
					$item->setMediaDateCreated($video["published"]["\$t"]);
					$item->setDateCreated(new \DateTime("now"));
					$item->setMediaType('Video');
					$item->setLayerType('Youtube');
					$item->setChildItemsCount(0);
					$item->setThumbnailUrl($video["media\$group"]["media\$thumbnail"][2]["url"]);
					$item->setArchive("Youtube");

					$categories = $video["category"];
			        if(isset($categories)) {
					    $itemTags = array();
					    foreach($categories as $cat) {
							if (strpos($cat["term"], 'gdata.youtube.com') === false)  {
			                    array_push($itemTags, $cat["term"]);
						    }
						}
						$item->setTags($itemTags);
					}

					$item->setMediaCreatorUsername($video["author"][0]["name"]["\$t"]);
					$item->setMediaCreatorRealname($video["author"][0]["name"]["\$t"]);
					
					$item->setLicense($video["media\$group"]["media\$license"]["\$t"]);

					array_push($items,$item);
					break;
				}
			}
		}
		
		return parent::returnResponse($items, true,true);
	}
}
