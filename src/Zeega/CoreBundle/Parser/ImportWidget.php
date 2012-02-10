<?php

namespace Zeega\\CoreBundle\;

use Zeega\DataBundle\Entity\Media;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\Metadata;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Imagick;
use DateTime;
use SimpleXMLElement;


		
		
class ImportWidget
{
	public function parseUrl($url){
	
		$urlSplit=explode('?',$url);
		$urlClean=$urlSplit[0];
		$fileFormat=strtolower(substr($urlClean,strlen($urlClean)-4));
		$fileFormatLong=strtolower(substr($urlClean,strlen($urlClean)-5));
		
		$urlInfo['fileFormat']=$fileFormat;
		$urlInfo['type']='item';		
		$viawork = '/(olvwork[0-9]*)/';
		$viagroup	= '/(olvgroup[0-9]*)/';
		$viasite	= '/(olvsite[0-9]*)/';
		$viaHUAM='/(HUAM[0-9]*)/';
		/**  ABSOLUTE URL ************************************/
		
		
		if(in_array($fileFormat,array('.jpg','.png','.gif'))||in_array($fileFormat,array('.mov','.mp4'))||in_array($fileFormat,array('.wav','.mp3','.aiff'))){
			if(in_array($fileFormat,array('.jpg','.png','.gif'))) $contentType='Image';
			elseif(in_array($fileFormat,array('.mov','.mp4')))$contentType='Video';
			elseif(in_array($fileFormat,array('.wav','.mp3','.aiff'))){
				if($fileFormatLong=='.aiff') $urlInfo['fileFormat']=$fileFormatLong;
				$contentType='Audio';
			}
			$archive='Absolute';
			$split= explode('/',$urlClean);
			$title=$split[count($split)-1];
			$urlInfo['itemUrl']=$url;
			$urlInfo['thumbUrl']=$url;
			$urlInfo['title']=$title;
			$urlInfo['contentType']=$contentType;
			$id='';
		}

		
		
		/**  ARCHIVE>ORG **************************************/
		
	
		elseif(strstr($url,'archive.org/details')){
			$archive='archive.org';
			$id='';
		}
		
		
			/**  HOLLIS **************************************/
	
		
		elseif(preg_match($viagroup, $url, $matches)){
			$archive='Hollis-Group';
			$id=$matches[1];
			
	
		}
		
			elseif(preg_match($viaHUAM, $url, $matches)){
			$archive='Hollis-Work';
			$id=$matches[1];
			
	
		}
		
		elseif(preg_match($viawork, $url, $matches)){
			$archive='Hollis-Work';
			$id=$matches[1];
			
	
		}
		
		elseif(preg_match($viasite, $url, $matches)){
			$archive='Hollis-Group';
			$id=$matches[1];
			
	
		}
		
		/**  DocumentCloud **************************************/
		
	
		elseif(strstr($url,'documentcloud.org/documents')){
			$archive='DocumentCloud';
			$id='';
			$url=str_replace( 'org/documents', 'org/api/documents',$url);
			$url=str_replace( '.html', '.json',$url);
			
		}
		
	
		/**  FLICKR   *****************************************/
		
		
		
		elseif(strstr($url,'flickr.com')&&strstr($url,'/photos/')&&!strstr($url,'/sizes/')&&!strstr($url,'sets')){
			$archive='Flickr';
			if(strstr($url,'sets')) $split=explode('/sets/',$url);
			else $split=explode('/photos/',$url);
			$split=explode('/',$split[1]);
			$id=$split[1];
		}
		
	
		
		/** SOUNDCLOUD ****************************************/
		
		
		
		elseif(strstr($url,'soundcloud.com'))
		{
			
			if(strstr($url,'/sets')){
				$url=substr($url,7);
				$split=explode('/',$url);
				$user=$split[1];
				$id=$url;
				$archive='SoundCloudSet';
			}
			else{
				$url=substr($url,7);
				$split=explode('/',$url);
				$user=$split[1];
				$id=$url;
				$archive='SoundCloud';
			}
		}
	
		
		/** BLIP.TV ********************************************/   									
		
		/*  NOT ACTIVE
	
		elseif(strstr($url,'blip.tv')){
				$archive='blip.tv';
				$id=substr($urlClean[0],7);
		}
		*/
		
		
		 /** FREE MUSIC ARCHIVE *******************************/
		
		/*  NOT ACTIVE

		elseif(strstr($url,'freemusicarchive.org/music/')){
				$archive='Free Music Archive';
				$split=explode('/music/',$url);
				$id=$split[1];
		}
		 
		*/
		
		
		
		 /** NATIONAL PUBLIC RADIO (NPR) ***********************/
		 
		  /*  NOT ACTIVE
		  
		elseif(strstr($url,'npr.org')){
			$archive='NPR';
			if(strstr($url,'storyId=')){
				$split=explode('storyId=',$url);
				$id=$split[1];
			}
			else{
				$split=explode('/',$url);
				$id=$split[count($split)-2];
			}
		}
		*/
		
		 /** YOUTUBE ******************************************/   
		 
		
		elseif(strstr($url,'youtube.com')&&strstr($url,'v=')){
			$archive='Youtube';
			$split=explode('v=',$url);
			$split=explode('&',$split[1]);
			$id=$split[0];
		}
		
		elseif(strstr($url,'youtube.com')&&strstr($url,'#p/c')){
			$archive='YoutubeChannel';
			$split=explode('#p/c/',$url);
			$id=$split[1];
		}
		
		
		 /** UNSUPPORTED **************************************/ 
		
		else{
			$archive='Not Found';
			$id="";
		}
		
		$urlInfo['type']='item';
		$urlInfo['id']=$id;
		$urlInfo['archive']=$archive;
		$urlInfo['url']=$url;
		return $urlInfo;
	}
	
	
	
	
	public function parseArchiveDotOrg($urlInfo){
	
		$originalUrl=$urlInfo['url']."?output=json";
		$ch = curl_init();
		$timeout = 5; // set to zero for no timeout
		curl_setopt ($ch, CURLOPT_URL, $originalUrl);
		curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		$file_contents = curl_exec($ch);
		curl_close($ch);
	
		$json = json_decode($file_contents);
	
		$mdata=$json->metadata;
		$files=(array)$json->files;
		$fileKeys=array_keys($files);
		$dir=$json->dir;
		$misc=$json->misc;
	
	
		$item= new Item();
		$metadata= new Metadata();
		$media = new Media();
		$attr=array();
		
		if(isset($mdata->subject)&&isset($mdata->subject[0])) $tags=str_replace("; ",",",(string)$mdata->subject[0]);
		else $tags='';
		if (isset($mdata->title)&&isset($mdata->title[0]))$item->setTitle((string)$mdata->title[0]);
	
		if(!$item->getTitle()){return false;}
	
		$item->setDescription((string)$mdata->description[0]);
		$item->setDescription(str_replace('<br />','',$item->getDescription()));
		$metadata->setThumbnailUrl(urldecode($misc->image));
		
		if(isset($mdata->creator)){
			$item->setMediaCreatorUsername((string)$mdata->creator[0]);
			$item->setMediaCreatorRealname((string)$mdata->creator[0]);
		}
		else{
			$item->setMediaCreatorUsername('Unknown');
			$item->setMediaCreatorRealname('Unknown');
		}
		
	
	
	
	
		$newUrl=str_replace( "details" , "download" , $urlInfo['url']);
		$type=(string)$mdata->mediatype[0];
	
	
		if($type=='movingImage'||$type=='movies'){	
			$index=0;
			$format="mp4";
			for($i=0;$i<sizeof($fileKeys);$i++){
			if(strstr($fileKeys[$i],$format)&&$index==0) {
				$index=$i;
				
				}
			}
			$item->setMediaType('Video');
			$item->setLayerType('Video');
			$item->setUri($newUrl.$fileKeys[$index]);
		}
		
		else if($type=='audio'){	
			$index=0;
			$format="mp3";
			for($i=0;$i<sizeof($fileKeys);$i++){
			if(strstr($fileKeys[$i],$format)&&$index==0) {
				$index=$i;
				
				}
			}
			$item->setMediaType('Audio');
			$item->setLayerType('Audio');
			$item->setUri($newUrl.$fileKeys[$index]);
		}
		
		else if($type=='image'){	
			$index=0;
			$format="JPEG";
			for($i=0;$i<sizeof($fileKeys);$i++){
			if(strstr($fileKeys[$i],$format)&&$index==0) {
				$index=$i;
				
				}
			}
			$item->setMediaType('Image');
			$item->setLayerType('Image');
			$item->setUri($newUrl.$fileKeys[$index]);
		}
		
		else return false;	
		
		$item->setArchive('archive.org');
		$metadata->setAttributes(array('tags'=>$tags));
		$item->setMetadata($metadata);
		$item->setMedia($media);
		
		return $item;
		
	}
	
	public function parseHollisWork($id){
	
			$originalUrl="http://webservices.lib.harvard.edu/rest/mods/via/".$id;
			$ch = curl_init();
			$timeout = 5; // set to zero for no timeout
			curl_setopt ($ch, CURLOPT_URL, $originalUrl);
			curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
			$file_contents = curl_exec($ch);
			curl_close($ch);
			
			$xml = new SimpleXMLElement($file_contents);
	
		$items=array();
		
		foreach($xml->location as $location){
			if($location->url){
				$item= new Item();
				$metadata= new Metadata();
				$media = new Media();
				
				
				$item->setTitle((string) $xml->titleInfo->title);
				
				
				$item->setAttributionUri('http://hollis.harvard.edu/?itemid=|misc/via|'.$id);
				$item->setMediaCreatorUsername((string)$xml->name->namePart);
				$item->setMediaCreatorRealname((string)$xml->name->namePart);
				$item->setMediaType('Image');
				$item->setLayerType('Image');
				$item->setArchive('Hollis');
				//$metadata->setTagList((string)$xml->mediagroup->mediakeywords);
				//$metadata->setDescription((string)$xml->mediagroup->mediadescription);
				
				$url=$this->getRedirectUrl((string)$location->url);
				$metadata->setThumbnailUrl($url.'?height=144&width=144');
				$item->setUri($url);
				$item->setMedia($media);
				$item->setMetadata($metadata);
				$items[]=$item;
			}
		}
		$collection['title'] = (string) $xml->titleInfo->title;
		
		
		$collection['creator'] = (string)$xml->name->namePart;
		$collection['items']=$items;
		return $collection;
	}
	
	
	public function parseHollisGroup($id){
	
			$originalUrl="http://webservices.lib.harvard.edu/rest/mods/via/".$id;
			$ch = curl_init();
			$timeout = 5; // set to zero for no timeout
			curl_setopt ($ch, CURLOPT_URL, $originalUrl);
			curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
			$file_contents = curl_exec($ch);
			curl_close($ch);
			
			$xml = new SimpleXMLElement($file_contents);
		
			$items=array();
			foreach($xml->relatedItem as $relatedItem){
				
					if($relatedItem->location->url){
						$item= new Item();
						$metadata= new Metadata();
						$media = new Media();
						
						
						$item->setTitle((string) $relatedItem->titleInfo->title);
						
						
						$item->setAttributionUri('http://hollis.harvard.edu/?itemid=|misc/via|'.$id);
						$item->setMediaCreatorUsername((string)$xml->name->namePart);
						$item->setMediaCreatorRealname((string)$xml->name->namePart);
				
						$item->setMediaType('Image');
						$item->setLayerType('Image');
						$item->setArchive('Hollis');
						//$metadata->setTagList((string)$xml->mediagroup->mediakeywords);
						//$metadata->setDescription((string)$xml->mediagroup->mediadescription);
						
						$url=$this->getRedirectUrl((string)$relatedItem->location->url);
						$metadata->setThumbnailUrl($url.'?height=144&width=144');
						$item->setUri($url);
						$item->setMedia($media);
						$item->setMetadata($metadata);
						$items[]=$item;
					}
			}	
			$collection['title'] = count($items).(string) $xml->titleInfo->title;
			
			
			$collection['creator'] = (string)$xml->name->namePart;
			$collection['items']=$items;
			return $collection;
		
	}
	
	
	public function parseYoutube($id){
	
		$originalUrl='http://gdata.youtube.com/feeds/api/videos/'.$id;
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

		$item->setUri($id);
		$item->setAttributionUri('http://www.youtube.com/watch?v='+$id);
		$item->setMediaCreatorUsername((string)$xml->author->name);
		$item->setMediaCreatorRealname('unknown');
		$item->setMediaType('Video');
		$item->setLayerType('Youtube');
		$item->setArchive('Youtube');
		$item->setDescription((string)$xml->mediagroup->mediadescription);
		$metadata->setThumbnailUrl((string)$xml->mediagroup->mediathumbnail['url']);

		$item->setMedia($media);
		$item->setMetadata($metadata);
		
		return($item);
	}
	
	public function parseYoutubeChannel($id){
		//REF ABOUT HOW YOUTUBE IS PARSED IN THIS METHOD: http://www.ibm.com/developerworks/xml/library/x-youtubeapi/
		
		$originalUrl="http://gdata.youtube.com/feeds/api/playlists/$id?v=2";
		
		// read feed into SimpleXML object
		$xml = simplexml_load_file($originalUrl);
		
		// get summary counts from opensearch: namespace
	    //$counts = $sxml->children('http://a9.com/-/spec/opensearchrss/1.0/');
	    //$total = $counts->totalResults;
		$items=array();
		foreach ($xml->entry as $entry) 
		{
			// get frames in media: namespace for media information
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
			$item->setMediaType('Video');
			$item->setLayerType('Youtube');
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
			$item->setArchive('Youtube');
			$metadata->setLicense((string)$entryMedia->group->license);
			$metadata->setThumbnailUrl((string)$thumbnailUrl);
			
			// read media from xml
			$attrs = $yt->duration->attributes();
			$duration = $attrs['seconds'];
			
			// write media information
			$media->setDuration((string)$duration);
			
			$item->setMetadata($metadata);
			$item->setMedia($media);

			$items[]=$item;
		}

		$collection['title'] = (string)$xml->title;
		$collection['creator'] = 'mano';
		$collection['items']=$items;
		
		return($collection);
	}
	
	public function parseAbsolute($urlInfo,$container){
	
		$item=new Item();
		$item->setMediaType($urlInfo['contentType']);
		$item->setLayerType($urlInfo['contentType']);
		$item->setUri($urlInfo['itemUrl']);
		$item->setUri($urlInfo['itemUrl']);
		$item->setTitle($urlInfo['title']);
		$item->setMediaCreatorUsername('Unknown');
		$item->setMediaCreatorRealname('Unknown');
		$metadata=new Metadata();
		$item->setDescription('None');
		$item->setArchive($urlInfo['archive']);
		if($urlInfo['contentType']=='Image') $metadata->setThumbnailUrl($urlInfo['itemUrl']);
		elseif($urlInfo['contentType']=='Audio') $metadata->setThumbnailUrl($container->getParameter('hostname').$container->getParameter('directory') . 'images/templates/audio.jpg');
		elseif($urlInfo['contentType']=='Video') $metadata->setThumbnailUrl($container->getParameter('hostname') .$container->getParameter('directory') . 'images/templates/video.jpg');
		
		$media=new Media();
		$media->setFormat($urlInfo['fileFormat']);
		$item->setMedia($media);
		$item->setMetadata($metadata);
		return $item;
	}
	
	public function parseFlickr($id){
	
		$license=array('','Attribution-NonCommercial-ShareAlike Creative Commons','Attribution-NonCommercial Creative Commons','Attribution-NonCommercial-NoDerivs Creative Commons','Attribution Creative Commons','Attribution-ShareAlike Creative Commons','Attribution-NoDerivs Creative Commons','No known copyright restrictions');
		$f = new \Phpflickr_Phpflickr('97ac5e379fbf4df38a357f9c0943e140');
		$info = $f->photos_getInfo($id);
		$size = $f->photos_getSizes($id);
	
		if(is_array($info)&&is_array($size)){
			$item= new Item();
			$metadata= new Metadata();
			$media = new Media();
			$tags=array();
			
			$item->setAttributionUri($info['urls']['url'][0]['_content']);
			
			if($info['tags']){
				foreach($info['tags']['tag'] as $tag){
					array_push($tags, ucwords(strtolower($tag['raw'])));
				}
			$attr['tags']=$tags;
			}
			else{
			$attr['tags']='';
			}
			
			foreach ($size as $s){
				$sizes[$s['label']]=array('width'=>$s['width'],'height'=>$s['height'],'source'=>$s['source']);
			}	
			
			$metadata->setThumbnailUrl($sizes['Square']['source']);
			
			$attr=array('farm'=>$info['farm'],'server'=>$info['server'],'id'=>$info['id'],'secret'=>$info['secret']);
			if(isset($sizes['Original'])) $attr['originalsecret']=$info['originalsecret'];
			
			
			
			if(isset($sizes['Large']))$itemSize='Large';
			elseif(isset($sizes['Original'])) $itemSize='Original';
			elseif(isset($sizes['Medium'])) $itemSize='Medium';
			else $itemSize='Small';
			
			if($info['dates']['taken']) $item->setMediaDateCreated(new DateTime($info['dates']['taken']));
		
			$metadata->setThumbnailUrl($sizes['Small']['source']);
			$item->setUri($sizes[$itemSize]['source']);
			$item->setUri($sizes[$itemSize]['source']);
			$media->setWidth($sizes[$itemSize]['width']);
			$media->setHeight($sizes[$itemSize]['height']);
			
			$attr['sizes']=$sizes;
			$item->setDescription($info['description']);
			
			if($info['license'])$metadata->setLicense($license[$info['license']]);
			else $metadata->setLicense('All Rights Reserved');
		
			if($info['owner']['username']) $item->setMediaCreatorUsername($info['owner']['username']);
			else $item->setMediaCreatorUsername($info['owner']['realname']);
			$item->setMediaCreatorRealname($info['owner']['realname']);
			$attr['creator_nsid']=$info['owner']['nsid'];
			$item->setTitle($info['title']);
			
			
			
			if(array_key_exists ('location',$info)){
				if($info['location']['latitude']){
					$item->setMediaGeoLatitude($info['location']['latitude']);
					$item->setMediaGeoLongitude($info['location']['longitude']);
				}
			}
		
			$item->setArchive('Flickr'); 
			$item->setMediaType('Image');
			$item->setLayerType('Image');
			$metadata->setAttributes($attr);
			$item->setMedia($media);
			$item->setMetadata($metadata);
			return $item;	
		}
		else{
			return false;
		}


}



	public function parseSoundCloudSet($url){
		
		$SOUNDCLOUD_CONSUMER_KEY='lyCI2ejeGofrnVyfMI18VQ';

		$originalUrl=$url;
		$ch = curl_init();
		$timeout = 5; // set to zero for no timeout
		curl_setopt ($ch, CURLOPT_URL, $originalUrl);
		curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		$file_contents = curl_exec($ch);
		curl_close($ch);
	
		$soundcloud = '/soundcloud\.com%2Fplaylists%2F([0-9]*)/';
		
		if(preg_match($soundcloud, $file_contents, $matches)){	
	
		$originalUrl='http://api.soundcloud.com/playlists/'.$matches[1].'.xml?consumer_key='.$SOUNDCLOUD_CONSUMER_KEY;
		$ch = curl_init();
		$timeout = 5; // set to zero for no timeout
		curl_setopt ($ch, CURLOPT_URL, $originalUrl);
		curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		$file_contents = curl_exec($ch);
		curl_close($ch);
		
		$xmlSet = new SimpleXMLElement($file_contents);
		
		$tracks=$xmlSet->{'tracks'};
		$items=array();

		foreach ($xmlSet->{'tracks'}->children() as $xml){
			
			
			
		
			$item= new Item();
			$metadata= new Metadata();
			$media = new Media();
		
			$metadata->setThumbnailUrl((string)$xml->{'waveform-url'});
			
			$item->setTitle((string)$xml->{'permalink'});
			
			if(!$item->getTitle()){return false;}
			
			$item->setDescription((string)$xml->{'description'});
			$item->setDescription(str_replace('<br />','',$item->getDescription()));
			
			$item->setMediaCreatorUsername((string)$xml->{'user'}->{'username'});
			$item->setMediaCreatorRealname((string)$xml->{'user'}->{'username'});
			$item->setMediaType('Audio');
			$item->setLayerType('Audio');
			$item->setArchive('SoundCloud');
			$item->setUri((string)$xml->{'stream-url'});
			$item->setDateCreated(new DateTime((string)$xml->{'created-at'}));
			$duration=(string)$xml->{'duraton'};
			$media->setDuration(floor($duration/1000));
			if(!strpos($item->getUri(),'stream')){
				return fail;
			}
			else{
				$url=$item->getUri();
				$item->setUri($url.'?consumer_key='.$SOUNDCLOUD_CONSUMER_KEY);
			}
		
			$metadata->setLicense((string)$xml->{'license'});
			$item->setMetadata($metadata);
			$item->setMedia($media);
			
			$items[]=$item;

		
		}
		
		$collection['title'] = (string)$xmlSet->{'title'};
		$collection['creator'] = $item->getMediaCreatorUsername();
		$collection['items']=$items;
		return $collection;
		}
		else{
			return false;
		}
	
	}

	public function parseSoundCloud($url){
	
	
	$SOUNDCLOUD_CONSUMER_KEY='lyCI2ejeGofrnVyfMI18VQ';

	$originalUrl=$url;
	$ch = curl_init();
	$timeout = 5; // set to zero for no timeout
	curl_setopt ($ch, CURLOPT_URL, $originalUrl);
	curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
	$file_contents = curl_exec($ch);
	curl_close($ch);

	$soundcloud = '/soundcloud\.com%2Ftracks%2F([0-9]*)/';
	
	if(preg_match($soundcloud, $file_contents, $matches)){				

	$originalUrl='http://api.soundcloud.com/tracks/'.$matches[1].'.xml?consumer_key='.$SOUNDCLOUD_CONSUMER_KEY;
	$ch = curl_init();
	$timeout = 5; // set to zero for no timeout
	curl_setopt ($ch, CURLOPT_URL, $originalUrl);
	curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
	$file_contents = curl_exec($ch);
	curl_close($ch);
	$xml = new SimpleXMLElement($file_contents);
		
	$item= new Item();
	$metadata= new Metadata();
	$media = new Media();
	$attr=array();
	$attr['tags']=(string)$xml->{'tag-list'};
	$metadata->setThumbnailUrl((string)$xml->{'waveform-url'});
	
	$item->setTitle((string)$xml->{'permalink'});
	
	if(!$item->getTitle()){return false;}
	
	$item->setDescription((string)$xml->{'description'});
	$item->setDescription(str_replace('<br />','',$item->getDescription()));
	
	$item->setMediaCreatorUsername((string)$xml->{'user'}->{'username'});
	$item->setMediaCreatorRealname((string)$xml->{'user'}->{'username'});
	$item->setMediaType('Audio');
	$item->setLayerType('Audio');
	$item->setArchive('SoundCloud');
	$item->setUri((string)$xml->{'stream-url'});
	$item->setDateCreated(new DateTime((string)$xml->{'created-at'}));
	$duration=(string)$xml->{'duraton'};
	$media->setDuration(floor($duration/1000));
	if(!strpos($item->getUri(),'stream')){
		return false;
	}
	else{
		$uri=$item->getUri();
		$item->setUri($uri.'?consumer_key='.$SOUNDCLOUD_CONSUMER_KEY);
	}
	
	$metadata->setLicense((string)$xml->{'license'});
	$item->setMetadata($metadata);
	$item->setMedia($media);
	
	return $item;
	}
	else{
	
	return false;
	}

}
	
	public function parseBlipTv($id){	
		
		$originalUrl=$id.'?skin=json';
		$ch = curl_init();
		$timeout = 5; // set to zero for no timeout
		curl_setopt ($ch, CURLOPT_URL, $originalUrl);
		curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		$file_contents = curl_exec($ch);
		curl_close($ch);
		
		$attr=array();
		
		$first=1;
		$f=explode('"',$file_contents);
		foreach ($f as $url){
			if(strstr($url,'.png')||strstr($url,'.jpg')) $metadata->setThumbUrl($url);
		}
		$originalUrl=$id.'?skin=api';
		//$originalUrl='blip.tv/file/'.$id.'?skin=api';
		$ch = curl_init();
		$timeout = 5; // set to zero for no timeout
		curl_setopt ($ch, CURLOPT_URL, $originalUrl);
		curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		$file_contents = curl_exec($ch);
		curl_close($ch);
	
		$xml = new SimpleXMLElement($file_contents);
		
		
		$item= new Item();
		$metadata= new Metadata();
		$media = new Media();
		
		$info=$xml->{'payload'}->{'asset'};
		
		$item->setMediaCreatorUsername((string)$xml->{'payload'}->{'asset'}->{'createdBy'}->{'login'});
		$metadata->setAltCreator((string)$xml->{'payload'}->{'asset'}->{'createdBy'}->{'login'});
		$item->setArchive('blip.tv');
		$item->setMediaType('Video');
		$item->setLayerType('Video');
		$item->setTitle((string)$info->{'title'});
		$description=(string)$info->{'description'};
		$item->setDescription(str_replace('<br />','',$description));
		
		
		$tags='';
		
		
		if($info->{'tags'}->{'string'}){
				foreach($info->{'tags'}->{'string'}	as $tag)
				{
					if($tags==1){$tags=$tag;}
					else{$tags=$tags.','.$tag;}
				}
			}
			
			$mediaFound=0;
			
			if($info->{'mediaList'}->{'media'}){
				foreach($info->{'mediaList'}->{'media'}	as $blipmedia)
				{
					$att=$blipmedia->{'link'}->attributes();
					if(strstr($att['type'],'m4v')&&$blipmedia->{'role'}=='Blip SD'){
						{
						$item->setUri((string)$att['href']); $mediaFound=1;
						$item->setUri((string)$att['href']); $mediaFound=1;
						$media->setWidth((int)$blipmedia->{'width'});
						$media->setHeight((int)$blipmedia->{'height'});
						$media->setDuration((int)$blipmedia->{'duration'});
						$media->setSize((int)$blipmedia->{'size'});
					}
				}
			}
			
			if(!$mediaFound){
				foreach($info->{'mediaList'}->{'media'}	as $blipmedia){
					$att=$blipmedia->{'link'}->attributes();
					if(strstr($att['type'],'mp4')) $item->setUri((string)$att['href']); $mediaFound=1;
					$media->setWidth((int)$blipmedia->{'width'});
						$media->setHeight((int)$blipmedia->{'height'});
						$media->setDuration((int)$blipmedia->{'duration'});
						$media->setSize((int)$blipmedia->{'size'});
				}
			}
		}
		
		
		
		if(!$mediaFound||!$item->getTitle())return $false;
	
		$attr['tags']=$tags;
		$metadata->setAttr($attr);
		$metadata->setLicense((string)$info->{'license'}->{'name'});
		
		$item->setMetadata($metadata);
		$item->setMedia($media);
		
		
		return $item;


}

	public function parseDocumentCloud($url){	
		
		$originalUrl=$url;
		$ch = curl_init();
		$timeout = 5; // set to zero for no timeout
		curl_setopt ($ch, CURLOPT_URL, $originalUrl);
		curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		$file_contents = curl_exec($ch);
		curl_close($ch);
		
		$contents=json_decode($file_contents);
		$document=$contents->document;
		$item= new Item();
		$metadata= new Metadata();
		$media = new Media();
		
		if($document->source){
			$item->setMediaCreatorUsername($document->source);
			$item->setMediaCreatorRealname($document->source);
		}
		else {
			$item->setMediaCreatorUsername('Unknown');
			$item->setMediaCreatorRealname('Unknown');
		}
		
		$item->setArchive('DocumentCloud');
		$item->setMediaType('Document');
		$item->setLayerType('DocumentCloud');
		$item->setTitle($document->title);
		$item->setUri($document->id);
		
		$item->setDescription($document->description);
	
	
		$image=$document->resources->page->image;
		$image=str_replace('{page}','1',$image);
		$image=str_replace('{size}','small',$image);
		
	
		$metadata->setThumbnailUrl($image);
		$item->setMetadata($metadata);
		$item->setMedia($media);
		
		
		return $item;


}


	public function getRedirectUrl($url){
	$redirect_url = null; 
 
	$url_parts = @parse_url($url);
	if (!$url_parts) return false;
	if (!isset($url_parts['host'])) return false; //can't process relative URLs
	if (!isset($url_parts['path'])) $url_parts['path'] = '/';
 
	$sock = fsockopen($url_parts['host'], (isset($url_parts['port']) ? (int)$url_parts['port'] : 80), $errno, $errstr, 30);
	if (!$sock) return false;
 
	$request = "HEAD " . $url_parts['path'] . (isset($url_parts['query']) ? '?'.$url_parts['query'] : '') . " HTTP/1.1\r\n"; 
	$request .= 'Host: ' . $url_parts['host'] . "\r\n"; 
	$request .= "Connection: Close\r\n\r\n"; 
	fwrite($sock, $request);
	$response = '';
	while(!feof($sock)) $response .= fread($sock, 8192);
	fclose($sock);
 
	if (preg_match('/^Location: (.+?)$/m', $response, $matches)){
		if ( substr($matches[1], 0, 1) == "/" )
			return $url_parts['scheme'] . "://" . $url_parts['host'] . trim($matches[1]);
		else
			return trim($matches[1]);
 
	} else {
		return false;
	}
 
}
	




}
