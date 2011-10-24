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
    
	  public function persistAction(){
	  
		$request=$this->getRequest();
    	$user = $this->get('security.context')->getToken()->getUser();
		$session = $request->getSession();
		$widgetId=$request->request->get('widgetId');
		$em=$this->getDoctrine()->getEntityManager();
		
		if($widgetId) {
    		
    		
    		$items=$session->get('items');
    		$item=$items[$widgetId];
    		
			$em=$this->getDoctrine()->getEntityManager();
			$em->persist($item->getMetadata());
			$em->persist($item->getMedia());
			$em->flush();
			$em->persist($item);
			$em->flush();
    		
    		$metadata=$item->getMetadata();
    		$media=$item->getMedia();
    		
			/*  Create Thumbnail Image : If no thumbnail is provided, thumbnail of attribution url is created */
			
			
			$thumbUrl=false;
			
			if($metadata->getThumbUrl()){
				$thumbUrl=$metadata->getThumbUrl();
				@$img=file_get_contents($thumbUrl);
			}
			
			
			
			if(!$thumbUrl||$img==FALSE){
				exec('/opt/webcapture/webpage_capture -t 50x50 -crop '.$item->getAttributionUrl().' /var/www/images/items',$output);
				$url=explode(":/var/www/",$output[4]);
				$thumbUrl='http://core.zeega.org/'.$url[1];
				@$img=file_get_contents($thumbUrl);
			}
		
		
			if($img==FALSE){
				return new Response(json_encode('Failed to Add'));	

			}
			else{		
			
				$name=tempnam("/var/www/images/tmp/","image".$item->getId());
				file_put_contents($name,$img);
				$square = new Imagick($name);
				$thumb = $square->clone();

				if($square->getImageWidth()>$square->getImageHeight()){
					$thumb->thumbnailImage(144, 0);
					$x=(int) floor(($square->getImageWidth()-$square->getImageHeight())/2);
					$h=$square->getImageHeight();		
					$square->chopImage($x, 0, 0, 0);
					$square->chopImage($x, 0, $h, 0);
				} 
				else{
					$thumb->thumbnailImage(0, 144);
					$y=(int) floor(($square->getImageHeight()-$square->getImageWidth())/2);
					$w=$square->getImageWidth();
					$square->chopImage(0, $y, 0, 0);
					$square->chopImage(0, $y, 0, $w);
				}
			
				$square->thumbnailImage(144,0);
			
				$thumb->writeImage('/var/www/images/items/'.$item->getId().'_t.jpg');
				$square->writeImage('/var/www/images/items/'.$item->getId().'_s.jpg');
			
		
		
				$response=$this->getDoctrine()
								->getRepository('ZeegaIngestBundle:Item')
								->findItemById($item->getId());					
				return new Response(json_encode($item->getId()));
    		  
	  	}
	  
	  
	  }
	  else
	  {
				return new Response(json_encode('Failed to Add:'.$widgetId));	

			}

	}
	
	public function urlAction()
    {
    	$request=$this->getRequest();
    	$user = $this->get('security.context')->getToken()->getUser();
		$session = $request->getSession();
		$widgetId=$request->query->get('widget-id');
		$em=$this->getDoctrine()->getEntityManager();
		
		
    	
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
    		$widgetId=rand(0,100000);
			if($session->get('items'))$newItems=$session->get('items');
		
			$newItems[$widgetId]=$item;
			$session->set('items',$newItems);
    	
    	
    	
    	$metadata=$item->getMetadata();
    	$media=$item->getMedia();
    	//$attr=$metadata->getAttr();
    	$attr['tags']="none";
    	//return new Response($archive.': '.$url);
    	return $this->render('ZeegaIngestBundle:Widget:single.widget.html.twig', array(
       
            'displayname' => $user->getDisplayname(),
            'title'=>$item->getTitle(),
            'creator'=>$item->getCreator(),
            'widget_id'=>$widgetId,
            'thumb_url'=>$metadata->getThumbUrl(),
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
