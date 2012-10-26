<?php

namespace Zeega\ExtensionsBundle\Parser\Youtube;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;

use \DateTime;
use SimpleXMLElement;

class ParserYoutubePlaylist extends ParserAbstract
{
	public function load($url, $parameters = null)
	{
	    $regexMatches = $parameters["regex_matches"];
	    $loadCollectionItems = $parameters["load_child_items"];
	    
	    $setId = $regexMatches[1]; // bam
	    
		if(strpos($setId, 'PL') === 0)    $setId = substr($setId, 2); // apparently the playlist ID changed... need to remove the PL prefix.
        
		$originalUrl="http://gdata.youtube.com/feeds/api/playlists/$setId?v=2&alt=json&max_results=50";
        
		// read feed into SimpleXML object
		$playlistInfo = json_decode(file_get_contents($originalUrl),true);
		$entry = $playlistInfo["feed"];
		
		$collection = new Item();
		$collection->setTitle($entry["title"]["\$t"]);
		$collection->setArchive("Youtube");
		$collection->setDescription($entry["subtitle"]["\$t"]);
		$collection->setMediaType('Collection');
	    $collection->setLayerType('Youtube');
	    $collection->setUri($url);
		$collection->setAttributionUri($entry["media\$group"]["media\$content"][0]["url"]);
		$collection->setEnabled(true);
		$collection->setPublished(true);
		$collection->setChildItemsCount($entry["openSearch\$totalResults"]["\$t"]);
		$collection->setMediaCreatorUsername($entry["author"][0]["name"]["\$t"]);
		$collection->setMediaCreatorRealname('Unknown');
		
		foreach ($entry["entry"] as $child) 
		{
           	$collection->setThumbnailUrl($child["media\$group"]["media\$thumbnail"][0]["url"]);
            
			if($loadCollectionItems == false)
            {
                // we just want the set description - get a thumbnail from the first item and break
                break;
            }
			
			$item= new Item();

			$item->setUri($child["media\$group"]["yt\$videoid"]["\$t"]);
			$item->setTitle($child["title"]["\$t"]);
			$item->setDescription($child["media\$group"]["media\$description"]["\$t"]);
			$item->setAttributionUri($child["media\$group"]["media\$player"]["url"]);
			$item->setMediaDateCreated($child["updated"]["\$t"]);
			$item->setDateCreated(new \DateTime("now"));
			$item->setMediaType('Video');
			$item->setLayerType('Youtube');
			$item->setChildItemsCount(0);
			$item->setThumbnailUrl($child["media\$group"]["media\$thumbnail"][0]["url"]);
			$item->setArchive("Youtube");

			$categories = $child["category"];
	        if(isset($categories)) 
			{
			    $itemTags = array();
			    foreach($categories as $cat)
				{
					if (strpos($cat["term"], 'gdata.youtube.com') === false) 
					{
	                    array_push($itemTags, $cat["term"]);
				    }
				}
				$item->setTags($itemTags);
			}
			$item->setMediaCreatorUsername($child["author"][0]["name"]["\$t"]);
			$item->setMediaCreatorRealname('Unknown');
			$item->setLicense($child["media\$group"]["media\$license"]["\$t"]);

			$accessControl = $child["yt\$accessControl"];
			foreach($accessControl as $access)
			{
				if($access["action"] == "embed" && $access["permission"] == "allowed")
				{
					$collection->addItem($item);
				}
			}
		}
		
		return parent::returnResponse($collection, true,true);
	}
}
