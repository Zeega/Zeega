<?php

namespace Zeega\IngestBundle;

use Zeega\IngestBundle\Entity\Media;
use Zeega\IngestBundle\Entity\Tag;
use Zeega\IngestBundle\Entity\Item;
use Zeega\IngestBundle\Entity\Metadata;

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
				$id=$split[3];
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
		
		
		 /** UNSUPPORTED **************************************/ 
		
		else{
			$archive='Not Found';
			$id="";
		}
		
		
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
		
		$attr['tags']=str_replace("; ",",",(string)$mdata->subject[0]);
	
		$item->setTitle((string)$mdata->title[0]);
	
		if(!$item->getTitle()){return false;}
	
		$item->setDescription((string)$mdata->description[0]);
		$item->setDescription(str_replace('<br />','',$metadata->getDescription()));
		$metadata->setThumbUrl(urldecode($misc->image));
		if(isset($mdata->creator))$item->setMediaCreatorUsername((string)$mdata->creator[0]);
		
	
	
	
	
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
			$item->setType('Video');
			$item->setSource('Video');
			$item->setUri($newUrl.$fileKeys[$index]);
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
			$item->setType('Audio');
			$item->setSource('Audio');
			$item->setUri($newUrl.$fileKeys[$index]);
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
			$item->setType('Image');
			$item->setSource('Image');
			$item->setUri($newUrl.$fileKeys[$index]);
			$item->setUri($newUrl.$fileKeys[$index]);
		}
		
		else return false;	
		
		$metadata->setArchive('archive.org');
		$metadata->setAttr($attr);
		$item->setMetadata($metadata);
		$item->setMedia($media);
		
		return $item;
		
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
		$item->setType('Video');
		$item->setSource('Youtube');
		$metadata->setArchive('Youtube');
		$item->setDescription((string)$xml->mediagroup->mediadescription);
		$metadata->setThumbnailUrl((string)$xml->mediagroup->mediathumbnail['url']);
		$item->setMedia($media);
		$item->setMetadata($metadata);
		
		return($item);
	}
	
	public function parseAbsolute($urlInfo,$container){
	
		$item=new Item();
		$item->setType($urlInfo['contentType']);
		$item->setSource($urlInfo['contentType']);
		$item->setUri($urlInfo['itemUrl']);
		$item->setUri($urlInfo['itemUrl']);
		$item->setTitle($urlInfo['title']);
		$item->setMediaCreatorUsername('Unknown');
		$metadata=new Metadata();
		$item->setDescription('None');
		$metadata->setArchive($urlInfo['archive']);
		$metadata->setAltCreator('');
		if($urlInfo['contentType']=='Image') $metadata->setThumbUrl($urlInfo['itemUrl']);
		elseif($urlInfo['contentType']=='Audio') $metadata->setThumbUrl($container->getParameter('hostname').$container->getParameter('directory') . 'images/templates/audio.jpg');
		elseif($urlInfo['contentType']=='Video') $metadata->setThumbUrl($container->getParameter('hostname') .$container->getParameter('directory') . 'images/templates/video.jpg');
		$metadata->setAltCreator('');
		
		$media=new Media();
		$media->setFileFormat($urlInfo['fileFormat']);
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
			else $itemSize='Medium';
			
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
		
			$metadata->setArchive('Flickr'); 
			$item->setType('Image');
			$item->setSource('Image');
			$metadata->setAttributes($attr);
			$item->setMedia($media);
			$item->setMetadata($metadata);
			return $item;	
		}
		else{
			return false;
		}


}



	public function parseSoundCloudSet($id){
		
		$SOUNDCLOUD_CONSUMER_KEY='lyCI2ejeGofrnVyfMI18VQ';
	
		$originalUrl='http://api.soundcloud.com/playlists/'.$id.'.xml?consumer_key='.$SOUNDCLOUD_CONSUMER_KEY;
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
			$item->setType('Audio');
			$item->setSource('Audio');
			$metadata->setArchive('SoundCloud');
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
		$collection['creator'] = $item->getCreator();
		$collection['items']=$items;
		return $collection;
		
	
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
	$item->setType('Audio');
	$item->setSource('Audio');
	$metadata->setArchive('SoundCloud');
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
		$metadata->setArchive('blip.tv');
		$item->setType('Video');
		$item->setSource('Video');
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
		
		$item->setMediaCreatorUsername($document->source);
		$item->setMediaCreatorRealname($document->source);
		$metadata->setArchive('DocumentCloud');
		$item->setType('Document');
		$item->setSource('DocumentCloud');
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







}
