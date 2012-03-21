<?php

namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Zeega\DataBundle\Entity\Media;
use Zeega\DataBundle\Entity\Metadata;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\Site;
use Zeega\DataBundle\Entity\User;
use Imagick;
use DateTime;
use SimpleXMLElement;

class WidgetController extends Controller
{
   	public function persistAction()
	{
		return $this->forward('ZeegaApiBundle:Parser:postParserPersist', array(), array());
	}
	
	public function openAction()
	{
		$em = $this->getDoctrine()->getEntityManager();
    	$request = $this->getRequest();
		$session = $request->getSession();
    	
		// get logged user
		$user = $this->get('security.context')->getToken()->getUser();
		
		// get user items and sites
		$mycollection = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findUserItems($user->getId());
		$sites = $this->getDoctrine()->getRepository('ZeegaDataBundle:Site')->findSitesByUser($user->getId());
		
		$widgetId = $request->query->get('widget-id');
		$itemUrl = $request->query->get('url');
		
		// check if the item exists on the database	
		$item = $this->getDoctrine()
					 ->getRepository('ZeegaDataBundle:Item')
					 ->findOneBy(array("attribution_uri" => $itemUrl));
		
		$mycollection = $this->forward('ZeegaApiBundle:Search:search', array(), array("limit" => 15))->getContent();
		
		if($item)
		{
			// item was imported before
			return $this->render('ZeegaCoreBundle:Widget:duplicate.widget.html.twig', array(
				'displayname' => $user->getDisplayname(),
				'item' => $item,
				'mycollection'=>$mycollection,
			));
		}
		else
		{
			$session->set('widget_url',$itemUrl);
			// new item - check if it is supported
			$parserResponse = $this->forward('ZeegaApiBundle:Parser:getParserValidate', array(), array("url" => $itemUrl))->getContent();
			//$parserResponse = substr( $parserResponse,1);
			//$parserResponse = substr( $parserResponse,0,-1);
			//return new Response($parserResponse);
			//$parserResponse = utf8_decode($parserResponse);
			
            $parserResponse = json_decode($parserResponse,true);
			//return new Response(var_dump($parserResponse));
			//$parserResponse = json_decode($parserResponse,true);
			
			if(isset($parserResponse))
			{
				
				$isUrlValid = $parserResponse["result"]["is_url_valid"];
				$isUrlCollection = $parserResponse["result"]["is_url_collection"];
				$message = $parserResponse["result"]["message"];
				$items = $parserResponse["items"];
				
				
				if($isUrlValid)
				{
					$mycollection = $this->forward('ZeegaApiBundle:Search:search', array(), array("limit" => 15))->getContent();
					if($isUrlCollection)
					{
						//return new Response(var_dump($parserResponse));
						return $this->render('ZeegaCoreBundle:Widget:single.widget.html.twig', array(
							'displayname' => $user->getDisplayname(),
							'widget_id'=>$widgetId,
							'item'=>json_encode($items), 
							'mycollection'=>$mycollection,
						));						
					}
					else
					{
						return $this->render('ZeegaCoreBundle:Widget:single.widget.html.twig', array(
							'displayname' => $user->getDisplayname(),
							'widget_id'=>$widgetId,
							'item'=>json_encode($items), 
							'mycollection'=>$mycollection,
						));
					}
				}
				else
				{
					return $this->render('ZeegaCoreBundle:Widget:fail.widget.html.twig', array(
						'displayname' => $user->getDisplayname(),
						'widget_id'=>$widgetId,
						'item'=>json_encode($items), 
						'mycollection'=>$mycollection,
						'urlmessage' => $message,
						'url'=> $itemUrl,
					));
				}
			}
			
    	}
	}	
    
/*
	public function persistAction(){
	  	$logger = $this->get('logger');
		$request=$this->getRequest();
    	$user = $this->get('security.context')->getToken()->getUser();
		$session = $request->getSession();
		$widgetId=$request->request->get('widgetId');
		$em=$this->getDoctrine()->getEntityManager();
		
		if($widgetId) {
    		$items=$session->get('items');
    		$item=$items[$widgetId];
    		
    		$user = $this->get('security.context')->getToken()->getUser();
    		
    		$item->setUser($user);
    		
    		if($session->get('siteid')) 
    			$site = $this->getDoctrine()->getRepository('ZeegaDataBundle:Site')
    							    ->find($session->get('siteid'));
    		else 
    		{
    			$sites = $this->getDoctrine()
    					            ->getRepository('ZeegaDataBundle:Site')
    							    ->findSiteByUser($user->getId());
    			$site=$sites[0];
    		}
    		//$today = date('Y-m-d h:i:s', strtotime(date('Y-m-d')));
			$item->setSite($site);
			$item->setChildItemsCount(0);
			//$item->setDateCreated($today);
			
			$em=$this->getDoctrine()->getEntityManager();
			$em->persist($item->getSite());
			$em->persist($item->getMetadata());
			$em->persist($item->getMedia());
			$em->flush();
			$em->persist($item);
			$em->flush();
    		
    		$metadata=$item->getMetadata();
    		$media=$item->getMedia();
    		
			// Create Thumbnail Image : If no thumbnail is provided, thumbnail of attribution url is created 
			
			
			$thumbUrl=false;
			$logger->err('getting thumb url');	
			if($metadata->getThumbnailUrl()){
				$thumbUrl=$metadata->getThumbnailUrl();
				@$img=file_get_contents($thumbUrl);
			}
			
			if(!$thumbUrl||$img==FALSE){
				if($item->getContentType()=='Image'){
					@$img=file_get_contents($item->getUri());
				}
				elseif($item->getContentType()=='Audio'){
					@$img=file_get_contents($this->container->getParameter('hostname') .$this->container->getParameter('directory') .'/templates/audio.jpg');
				
				}
				elseif($item->getContentType()=='Video'){
					@$img=file_get_contents($this->container->getParameter('hostname') .$this->container->getParameter('directory') .'/templates/video.jpg');
				
				}
			}
		
		
			if($img==FALSE){
				return new Response(0);	
			}
			else{		
				$name=tempnam($this->container->getParameter('path').'images/tmp/','image'.$item->getId());
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
				$logger->err("writing image");
				$square->thumbnailImage(144,0);
			
				$thumb->writeImage($this->container->getParameter('path').'content/images/items/'.$item->getId().'_t.jpg');
				$square->writeImage($this->container->getParameter('path').'content/images/items/'.$item->getId().'_s.jpg');
			
				$item->setThumbnailUrl($this->container->getParameter('hostname').$this->container->getParameter('directory').'content/images/items/'.$item->getId().'_s.jpg');
				$em->persist($item);
				$em->flush();
				$response=$this->getDoctrine()
								->getRepository('ZeegaDataBundle:Item')
								->findItemById($item->getId());					
				return new Response($this->container->getParameter('hostname') .$this->container->getParameter('directory') .'content/images/items/'.$item->getId().'_s.jpg');
    		  
	  	}
	  
	  
	  }
	  else
	  {
				return new Response(0);	

			}

	}
	
	public function urlAction(){
    	$request=$this->getRequest();
    	$user = $this->get('security.context')->getToken()->getUser();
		
		$session = $request->getSession();
		$widgetId=$request->query->get('widget-id');
		$logger = $this->get('logger');
		$em=$this->getDoctrine()->getEntityManager();
		
		if($session->get('siteid')) 
    		$site = 	$this->getDoctrine()->getRepository('ZeegaDataBundle:Site')
    							    ->find($session->get('siteid'));
    	else 
		{
			$sites = $this->getDoctrine()
								->getRepository('ZeegaDataBundle:Site')
								->findSiteByUser($user->getId());
			$site=$sites[0];
		}
		
		
	
		$mycollection=$this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findUserItemsBySite($user->getId(),$site->getId());
		
		
		$url=$request->query->get('url');
			
		$check=$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Item')
					->findItemByAttributionUrl($url);
	
		if($check){
			return $this->render('ZeegaCoreBundle:Widget:duplicate.widget.html.twig', array(
				'displayname' => $user->getDisplayname(),
				'site'=>$site,
				'title'=>$check['title'],
				'item_id'=>$check['id'],
				'content_type'=>$check['type'],
				'mycollection'=>$mycollection,
			));
		}
		else{
		
			$import = $this->get('import_widget');	
			
			//Parse url
			$logger->err($url);
			$urlInfo=$import->parseUrl($url);
			
			
			//Create item objects using API if applicable
			$logger->err($urlInfo['archive']);
			
			if($urlInfo['archive']=='Flickr') 			  	$item=$import->parseFlickr($urlInfo['id']);
			elseif($urlInfo['archive']=='SoundCloud') 	  	$item=$import->parseSoundCloud($urlInfo['id']);
			elseif($urlInfo['archive']=='blip.tv') 	  		$item=$import->parseBlipTv($urlInfo['id']);
			elseif($urlInfo['archive']=='SoundCloudSet') 	$collection=$import->parseSoundCloudSet($urlInfo['id']);
			elseif($urlInfo['archive']=='Youtube')	  		$item=$import->parseYoutube($urlInfo['id']);
			elseif($urlInfo['archive']=='Absolute')	  		$item=$import->parseAbsolute($urlInfo,$this->container);
			elseif($urlInfo['archive']=='archive.org')	  	$item=$import->parseArchiveDotOrg($urlInfo);
			elseif($urlInfo['archive']=='DocumentCloud')	$item=$import->parseDocumentCloud($urlInfo['url']);
			elseif($urlInfo['archive']=='Hollis-Group') 			$collection=$import->parseHollisGroup($urlInfo['id']);
			elseif($urlInfo['archive']=='Hollis-Work') 			$collection=$import->parseHollisWork($urlInfo['id']);
			
			elseif($urlInfo['archive']=='YoutubeChannel')	$collection=$import->parseYoutubeChannel($urlInfo['id']);
			//Store media item(s) to session and render widget

			if(isset($item)&&$item){
		
				
				if($session->get('items'))$newItems=$session->get('items');			
				
				$widgetId=rand(0,100);
				$item->setAttributionUri($url."#".$user->getId());
				$newItems[$widgetId]=$item;
				$metadata=$item->getMetadata();
    			$session->set('items',$newItems);
		    	return $this->render('ZeegaCoreBundle:Widget:single.widget.html.twig', array(
					'displayname' => $user->getDisplayname(),
					'title'=>$item->getTitle(),
					'creator'=>$item->getMediaCreatorUsername(),
					'widget_id'=>$widgetId,
					'thumb_url'=>$metadata->getThumbnailUrl(),
					'mycollection'=>$mycollection,
					'site'=>$site,
				));
			}
        	elseif(isset($collection)&&$collection){
				$thumbUrls=array();
				$widgetIds=array();
				if($session->get('items'))$newItems=$session->get('items');	
				$counter=1;
				foreach($collection['items'] as $item){
					$widgetId=rand(0,1000);
					#$item->setAttributionUri($url."#".$item->getId()); //uncommented breaks youtube group import
					$metadata=$item->getMetadata();
					$thumbUrl=$metadata->getThumbnailUrl();
					$thumbUrls[]=array('index'=>$counter,'thumbUrl'=>$thumbUrl,'widgetId'=>$widgetId);
					$counter++;
					$widgetIds[]=$widgetId;
					$newItems[$widgetId]=$item;
				}
				$session->set('items',$newItems);

				return $this->render('ZeegaCoreBundle:Widget:batch.widget.html.twig', array(
					'displayname' => $user->getDisplayname(),
					'title'=>$collection['title'],
					'creator'=>$collection['creator'],
					'widget_ids'=>$widgetIds,
					'thumb_urls'=>$thumbUrls,
					'mycollection'=>$mycollection,
					'site'=>$site,
					'count'=>count($thumbUrls),
				));
		
			}
			else{
				return $this->render('ZeegaCoreBundle:Widget:fail.widget.html.twig', array(
            		'displayname' => $user->getDisplayname(),
					'message'=>'Unable to process the media at this URL:',
					'url'=>json_encode($widgetId),
					'title'=>'temp title',
					'mycollection'=>$mycollection,
					'site'=>$site,
					));
			} 
    	}
	}
*/  	
    public function thumbAction($query="Help"){
    	 
    	 $doc= $this->getDoctrine();
    	 $loader = $this->get('item_loader');
    
    	 $loader->loadTagThumbs($doc);
    	 
    	 return $this->render('ZeegaCoreBundle:Default:index.html.twig', array('name' => $query));
   
    }
    
    public function mediadataAction($query="Help"){
    	 
    	 $doc= $this->getDoctrine();
    	 $loader = $this->get('item_loader');
    
    	 $loader->loadMediaData($doc);
    	 
    	 return $this->render('ZeegaCoreBundle:Default:index.html.twig', array('name' => $query));
   
    }
}
