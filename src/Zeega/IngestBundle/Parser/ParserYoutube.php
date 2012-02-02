<?php

namespace Zeega\IngestBundle\Parser;

use Zeega\IngestBundle\Entity\Media;
use Zeega\IngestBundle\Entity\Tag;
use Zeega\IngestBundle\Entity\Item;
use Zeega\IngestBundle\Entity\Metadata;

use \DateTime;
use SimpleXMLElement;

/**
 * Flickr data parser.
 *
 */
class ParserYoutube extends ParserAbstract
{
	/**
     * Returns true if the $url is supported by the parser.
     *
     * @param String  $url  The url to be parsed.
	 * @return boolean|supported
     */
	public function isUrlSupported($url)
	{
		/* Info fROM: http://www.flickr.com/services/api/misc.urls.html
		http://www.flickr.com/photos/{user-id}/ - photostream
		http://www.flickr.com/photos/{user-id}/{photo-id} - individual photo
		http://www.flickr.com/photos/{user-id}/sets/ - all photosets
		http://www.flickr.com/photos/{user-id}/sets/{photoset-id} - single photoset
		*/
		/// return strstr($url,'flickr.com')&&strstr($url,'/photos/')&&!strstr($url,'/sizes/');
		return true;
	}
	
	/**
     * Parses a single item from the $url and adds the associated media to the database.
     *
     * @param String  $url  The url to be checked.
	 * @return boolean|success
     */
	public function parseSingleItem($url,$itemId)
	{
		$originalUrl = 'http://gdata.youtube.com/feeds/api/videos/'.$itemId;

		// read feed into SimpleXML object
		$entry = simplexml_load_file($originalUrl);
		
		$entryMedia = $entry->children('http://search.yahoo.com/mrss/');
		$yt = $entryMedia->children('http://gdata.youtube.com/schemas/2007');

		$item= new Item();
		$metadata= new Metadata();
		$media = new Media();

		$arr = explode(':',$entry->id);
		$entryId = $arr[count($arr)-1];

		$attrs = $entryMedia->group->player->attributes();
		$attributionUrl = $attrs['url'];

		$item->setUri((string)$yt->videoid);
		$item->setTitle((string)$entryMedia->group->title);
		//$item->setDescription((string)$entryMedia->group->description);
		$item->setDescription((string)$entryMedia->group->keywords);
		$item->setAttributionUri((string)$attributionUrl);
		$item->setDateCreated(new \DateTime("now"));
		$item->setType('Video');
		$item->setSource('Youtube');
		$item->setChildItemsCount(0);

		foreach($entry->children('http://www.georss.org/georss') as $geo)
		{
			foreach($geo->children('http://www.opengis.net/gml') as $position)
			{
				// Coordinates are separated by a space
				$coordinates = explode(' ', (string)$position->pos);

				$item->setMediaGeoLatitude((string)$coordinates[0]);
				$item->setMediaGeoLongitude((string)$coordinates[1]);
				break;
			}
		}

		$item->setMediaCreatorUsername((string)$entry->author->name);
		$item->setMediaCreatorRealname('Unknown');

		// read metadata from xml
		$attrs = $entryMedia->group->thumbnail->attributes();
		$thumbnailUrl = (string)$attrs['url'];

		// write metadata
		$metadata->setArchive('Youtube');
		$metadata->setLicense((string)$entryMedia->group->license);
		$metadata->setThumbnailUrl((string)$thumbnailUrl);
		
		$item->setThumbnailUrl((string)$thumbnailUrl);
		
		// read media from xml
		$attrs = $yt->duration->attributes();
		$duration = $attrs['seconds'];

		// write media information
		$media->setDuration((string)$duration);

		$item->setMetadata($metadata);
		$item->setMedia($media);
		
		return parent::returnResponse($item, true);
		/*
		$originalUrl='http://gdata.youtube.com/feeds/api/videos/'.$itemId;
		$ch = curl_init();
		$timeout = 5; // set to zero for no timeout
		curl_setopt ($ch, CURLOPT_URL, $originalUrl);
		curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		$file_contents = curl_exec($ch);

		$file_contents=str_replace ( "a:", "a", $file_contents );
		$file_contents=str_replace ( "o:l", "ol", $file_contents );
		$file_contents=str_replace ( "l:p", "lp", $file_contents );
		$file_contents=str_replace ( "l:P", "lP", $file_contents );
		$file_contents=str_replace ( "s:w", "sw", $file_contents );

		curl_close($ch);

		//echo $file_contents;
		$xml = new SimpleXMLElement($file_contents);
		$item= new Item();
		$metadata= new Metadata();
		$media = new Media();

		$item->setTitle((string) $xml->title);
		
		$item->setUri($itemId);
		$item->setAttributionUri("http://www.youtube.com/watch?v=$itemId");
		$item->setMediaCreatorUsername((string)$xml->author->name);
		$item->setMediaCreatorRealname('unknown');
		$item->setType('Video');
		$item->setSource('Youtube');
		$metadata->setArchive('Youtube');
		$item->setDescription((string)$xml->mediagroup->mediadescription);
		$metadata->setThumbnailUrl((string)$xml->mediagroup->mediathumbnail['url']);

		$item->setMedia($media);
		$item->setMetadata($metadata);

		return parent::returnResponse($item, true);
		*/
	}
	
	/**
     * Parses a single item from the $url and adds the associated media to the database.
     *
     * @param String  $url  The url to be checked.
	 * @return boolean|success
     */
	public function getSetInfo($url, $setId)
	{
		$f = new \Phpflickr_Phpflickr('97ac5e379fbf4df38a357f9c0943e140');
		$setInfo = $f->photosets_getInfo($setId);

		$collection = new Item();
		$ownerInfo = $f->people_getInfo($setInfo["owner"]);

		$collection->setTitle($setInfo["title"]);
		$collection->setDescription($setInfo["description"]);
		$collection->setType('Collection');
	    $collection->setSource('Flickr');
	    $collection->setUri('http://zeega.org');
		$collection->setAttributionUri($url);

        $collection->setChildItemsCount($setInfo["count_photos"]);

		$collection->setMediaCreatorUsername($ownerInfo["path_alias"]);
        $collection->setMediaCreatorRealname($ownerInfo["username"]);
		$collection->setMediaDateCreated(new \DateTime());
		
		if(isset($setInfo["primary"]))
		{
			$size = $f->photos_getSizes($setInfo["primary"]);
			foreach ($size as $s)
			{
				$sizes[$s['label']]=array('width'=>$s['width'],'height'=>$s['height'],'source'=>$s['source']);
			}	
		}
		$collection->setThumbnailUrl($sizes['Square']['source']);
		
		return parent::returnResponse($collection, true);
	}
	
	
	/**
     * Parses the set of media from the $url and adds the associated media to the database.
     *
     * @param String  $url  The url to be parsed.
	 * @return boolean|success
     */	
	public function parseSet($url, $setId)
	{
		$setId = $this->getItemId($url);
		
		$f = new \Phpflickr_Phpflickr('97ac5e379fbf4df38a357f9c0943e140');
		$setPhotos = $f->photosets_getPhotos($setId);
		$setInfo = $f->photosets_getInfo($setId);
		
		$photos = $setPhotos['photoset']['photo'];

		$collection = new Item();

		if($photos)
		{
			$ownerInfo = $f->people_getInfo($setInfo["owner"]);
			
			$collection->setTitle($setInfo["title"]);
			$collection->setDescription($setInfo["description"]);
			$collection->setType('Collection');
		    $collection->setSource('Flickr');
		    $collection->setUri('http://zeega.org');
			$collection->setAttributionUri($url);
		    
	        $collection->setChildItemsCount(0);
	        
			$collection->setMediaCreatorUsername($ownerInfo["path_alias"]);
	        $collection->setMediaCreatorRealname($ownerInfo["username"]);
			$collection->setMediaDateCreated(new \DateTime());
	        
			$thumbnailUrlIsSet = false;
			
			$collection->setChildItemsCount(count($photos));
			
			foreach($photos as $photo)
			{
				$item = $this->parseItem($photo['id']);
				if(!$thumbnailUrlIsSet)
				{
					$collection->setThumbnailUrl($item->getThumbnailUrl());
					$thumbnailUrlIsSet = true;
				}
				$collection->addItem($item);
			}
			
			return parent::returnResponse($collection, true);
		}
		return parent::returnResponse($collection, false);
	}
	
	public function parseSetItems($url, $setId, $collection)
	{
		//REF ABOUT HOW YOUTUBE IS PARSED IN THIS METHOD: http://www.ibm.com/developerworks/xml/library/x-youtubeapi/

		$originalUrl="http://gdata.youtube.com/feeds/api/playlists/$setId?v=2";

		// read feed into SimpleXML object
		$xml = simplexml_load_file($originalUrl);

		foreach ($xml->entry as $entry) 
		{
			// get nodes in media: namespace for media information
			$entryMedia = $entry->children('http://search.yahoo.com/mrss/');
			$yt = $entryMedia->children('http://gdata.youtube.com/schemas/2007');

			$item= new Item();
			$metadata= new Metadata();
			$media = new Media();

			$arr = explode(':',$entry->id);
			$entryId = $arr[count($arr)-1];

			$attrs = $entryMedia->group->player->attributes();
			$attributionUrl = $attrs['url'];

			$item->setUri((string)$yt->videoid);
			$item->setTitle((string)$entryMedia->group->title);
			//$item->setDescription((string)$entryMedia->group->description);
			$item->setDescription((string)$entryMedia->group->keywords);
			$item->setAttributionUri((string)$attributionUrl);
			$item->setDateCreated(new \DateTime("now"));
			$item->setType('Video');
			$item->setSource('Youtube');
			$item->setChildItemsCount(0);

			foreach($entry->children('http://www.georss.org/georss') as $geo)
			{
				foreach($geo->children('http://www.opengis.net/gml') as $position)
				{
					// Coordinates are separated by a space
					$coordinates = explode(' ', (string)$position->pos);

					$item->setMediaGeoLatitude((string)$coordinates[0]);
					$item->setMediaGeoLongitude((string)$coordinates[1]);
					break;
				}
			}

			$item->setMediaCreatorUsername((string)$entry->author->name);
			$item->setMediaCreatorRealname('Unknown');

			// read metadata from xml
			$attrs = $entryMedia->group->thumbnail->attributes();
			$thumbnailUrl = (string)$attrs['url'];

			// write metadata
			$metadata->setArchive('Youtube');
			$metadata->setLicense((string)$entryMedia->group->license);
			$metadata->setThumbnailUrl((string)$thumbnailUrl);

			// read media from xml
			$attrs = $yt->duration->attributes();
			$duration = $attrs['seconds'];

			// write media information
			$media->setDuration((string)$duration);

			$item->setMetadata($metadata);
			$item->setMedia($media);

			$collection->addItem($item);;
		}

		return parent::returnResponse($collection, true);
	}
}
