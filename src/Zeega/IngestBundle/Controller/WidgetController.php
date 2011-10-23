<?php

namespace Zeega\IngestBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Zeega\IngestBundle\Entity\Media;
use Zeega\IngestBundle\Entity\Metadata;
use Zeega\IngestBundle\Entity\Tag;
use Zeega\IngestBundle\Entity\Item;
use Zeega\UserBundle\Entity\User;
use Imagick;
use DateTime;
use SimpleXMLElement;

class WidgetController extends Controller
{
    
  

	
	
	public function urlAction()
    {
    	$request=$this->getRequest();
    	$user = $this->get('security.context')->getToken()->getUser();
		$session = $request->getSession();
		$widgetId=$request->query->get('widget-id');
		$em=$this->getDoctrine()->getEntityManager();
		
		if($widgetId) {
    	
    		
    		$playgroundId=$request->query->get('playground-id');
    		$itemId=$session->get($widgetId);
    		
    		
    		$item=$em
				->getRepository('ZeegaIngestBundle:Item')
				->find($itemId);
			$playground=$em
				->getRepository('ZeegaEditorBundle:Playground')
				->find($playgroundId);
				
			
			if(	$request->query->get('geo-lat')&&$item->getGeoLat()!=$request->query->get('geo-lat')) $item->setGeoLat(	$request->query->get('geo-lat'));
			if(	$request->query->get('geo-lng')&&$item->getGeoLng()!=$request->query->get('geo-lng')) $item->setGeoLng(	$request->query->get('geo-lng'));
			if(	$request->query->get('title')&&$item->getTitle()!=$request->query->get('title')) $item->setTitle(	$request->query->get('title'));
			if(	$request->query->get('creator')&&$item->getCreator()!=$request->query->get('creator')) $item->setCreator(	$request->query->get('creator'));
			
			
			$metadata=$item->getMetadata();
			$attr=$metadata->getAttr();
			if(	$request->query->get('description')) $metadata->setDescription(	$request->query->get('description'));
			if(	$request->query->get('tags')) $attr['tags']=$request->query->get('tags');
			
			
			$metadata->setAttr($attr);
			
		
			$item->setPlayground($playground);
    		$item->setUser($user);
    		$em->flush();
    	
    		//Create Thumb
		
			$img=file_get_contents($metadata->getThumbUrl());
			
			$name=tempnam("images/tmp/","image".$item->getId());
			file_put_contents($name,$img);


			$square = new Imagick($name);
			
			if($square->getImageWidth()>$square->getImageHeight()){
				$x=(int) floor(($square->getImageWidth()-$square->getImageHeight())/2);
				$h=$square->getImageHeight();
				$square->chopImage($x, 0, 0, 0);
				$square->chopImage($x, 0, $h, 0);
			} 
			else{
				$y=(int) floor(($square->getImageHeight()-$square->getImageWidth())/2);
				$w=$square->getImageWidth();
				$square->chopImage(0, $y, 0, 0);
				$square->chopImage(0, $y, 0, $w);
			}
			
			$square->thumbnailImage(75,0);
			$square->writeImage('images/thumbs/'.$item->getId().'_s.jpg');
		
			unlink($name);
							
    		return new Response('Successfully uploaded '.$item->getTitle());
    	}
    	
    	
    	else{
    	
			$playgrounds=$this->getDoctrine()
							->getRepository('ZeegaEditorBundle:Playground')
							->findPlaygroundsByUser($user->getId());
							
			$url=$request->query->get('url');
			
			$check=$this->getDoctrine()
					->getRepository('ZeegaIngestBundle:Item')
					->findItemByAttributionUrl($url);

			if($check){
				return $this->render('ZeegaIngestBundle:Widget:duplicate.widget.html.twig', array(
						'displayname' => $user->getDisplayname(),
						'playground'=>$playgrounds[0],
						'title'=>$check['title'],
						 strtolower($check['content_type'])=>true,
						'item_url'=>$check['item_url'],
						'content_type'=>$check['content_type'],
				));
				
			}
			else{
				$batch=false;
	
				$import = $this->get('import_widget');

		    	$urlParse=$import->parseUrl($url);
    			
    			if($urlParse['archive']=='Flickr') 			$item=$import->parseFlickr($urlParse['id']);
    			elseif($urlParse['archive']=='SoundCloud') 	$item=$import->parseSoundCloud($urlParse['id']);
    			elseif($urlParse['archive']=='blip.tv') 	$item=$import->parseBlipTv($urlParse['id']);
    			elseif($urlParse['archive']=='SoundCloudSet'){
    				$item=$import->parseSoundCloudSet($urlParse['id']);
    				$batch=true;
    			}
    			elseif($urlParse['archive']=='Absolute'){
    				$item=new Item();
    				$item->setContentType($urlParse['contentType']);
    				$item->setItemUrl($urlParse['itemUrl']);
    				$item->setTitle($urlParse['title']);
    				$item->setCreator('Unknown');
    				$metadata=new Metadata();
    				$metadata->setDescription('None');
    				$item->setArchive($urlParse['archive']);
    				$metadata->setAltCreator('');
    				if($urlParse['contentType']=='Image') $metadata->setThumbUrl($urlParse['itemUrl']);
    				//else $metadata->setThumbUrl(???);
    				$metadata->setAltCreator('');
    				$metadata->setTagList('');
    				$media=new Media();
    				$media->setFileFormat($urlParse['fileFormat']);
    				$item->setMedia($media);
    				$item->setMetadata($metadata);
    			}
		if(!isset($item)) {
			return $this->render('ZeegaIngestBundle:Widget:fail.widget.html.twig', array(
            'displayname' => $user->getDisplayname(),
            'message'=>'Unable to process the media at this URL:',
            'url'=>json_encode($widgetId),
            'title'=>'temp title',
            ));
		}
		
    	else{
    	
    	
    	
    	$playgrounds=$this->getDoctrine()
						->getRepository('ZeegaEditorBundle:Playground')
						->findPlaygroundsByUser($user->getId());
						
		if(count($playgrounds)>1) $multiuser=true;
		else $multiuser=false;

    	if(!$batch){
    	
    	
    	
    	
    	$item->setAttributionUrl($url);
    	$em=$this->getDoctrine()->getEntityManager();
    	$em->persist($item->getMetadata());
    	$em->persist($item->getMedia());
		$em->flush();
		$em->persist($item);
		$em->flush();
		$widgetId=rand(0,100000);
		$session->set($widgetId,$item->getId());
    	
    	
    	
    	$metadata=$item->getMetadata();
    	$media=$item->getMedia();
    	//$attr=$metadata->getAttr();
    	$attr['tags']="none";
    	//return new Response($archive.': '.$url);
    	return $this->render('ZeegaIngestBundle:Widget:single.widget.html.twig', array(
       
            'displayname' => $user->getDisplayname(),
            'title'=>$item->getTitle(),
            'tags'=>$attr['tags'],
            'description'=>$metadata->getDescription(),
            'creator'=>$metadata->getAltCreator(),
            'alt_creator'=>$item->getCreator(),
            'content_type'=>$item->getContentType(),
            'geo_lat'=>$item->getGeoLng(),
            'geo_lng'=>$item->getGeoLat(),
            'playground'=>$playgrounds[0],
            'license'=>$metadata->getLicense(),
            'item_url'=>$item->getItemUrl(),
            'widget_id'=>$widgetId,
            strtolower($item->getContentType())=>true,
        ));
        
        }
        else{
		
		$thumbs=array();
		
		$data=count($item);
		foreach($item as $i){
		
		
		$i->setAttributionUrl($url);
		$m=$i->getMetadata();
		$thumb=$m->getThumbUrl();
		array_push($thumbs,$thumb);
		
		
		}
		
    	  return $this->render('ZeegaIngestBundle:Widget:batch.widget.html.twig', array(
       
            'displayname' => $user->getDisplayname(),
            'playground'=>$playgrounds[0],
            'data'=>$data,
            'thumbs'=>$thumbs,
            'batch'=>$batch,
        ));
		
		}
        }
       }
       }
    }
	 
  	  
    
     public function thumbAction($query="Help")
    {
    	 
    	 $doc= $this->getDoctrine();
    	 $loader = $this->get('item_loader');
    
    	 $loader->loadTagThumbs($doc);
    	 
    	 return $this->render('ZeegaIngestBundle:Default:index.html.twig', array('name' => $query));
   
    }
    
     public function mediadataAction($query="Help")
    {
    	 
    	 $doc= $this->getDoctrine();
    	 $loader = $this->get('item_loader');
    
    	 $loader->loadMediaData($doc);
    	 
    	 return $this->render('ZeegaIngestBundle:Default:index.html.twig', array('name' => $query));
   
    }
    
    
}
