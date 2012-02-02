<?php

namespace Zeega\IngestBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Zeega\IngestBundle\Entity\Media;
use Zeega\IngestBundle\Entity\Metadata;
use Zeega\IngestBundle\Entity\Tag;
use Zeega\IngestBundle\Entity\Item;
use Zeega\EditorBundle\Entity\Playground;
use Zeega\UserBundle\Entity\User;
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
		
		// get user items and playgrounds
		$mycollection = $this->getDoctrine()->getRepository('ZeegaIngestBundle:Item')->findUserItems($user->getId());
		$playgrounds = $this->getDoctrine()->getRepository('ZeegaEditorBundle:Playground')->findPlaygroundsByUser($user->getId());
		
		$widgetId = $request->query->get('widget-id');
		$itemUrl = $request->query->get('url');
		
		// check if the item exists on the database	
		$item = $this->getDoctrine()
					 ->getRepository('ZeegaIngestBundle:Item')
					 ->findItemByAttributionUrl($itemUrl);
		
		$mycollection = $this->forward('ZeegaApiBundle:Search:search', array(), array("limit" => 15))->getContent();
		
		if($item)
		{
			// item was imported before
			/*
			return $this->render('ZeegaIngestBundle:Widget:duplicate.widget.html.twig', array(
				'displayname' => $user->getDisplayname(),
				'playground'=>$playgrounds[0],
				'title'=>$item['title'],
				'item_id'=>$item['id'],
				'content_type'=>$item['type'],
				'mycollection'=>$mycollection,
			));
			*/
			return $this->render('ZeegaIngestBundle:Widget:single.widget.html.twig', array(
				'displayname' => $user->getDisplayname(),
				'widget_id'=>$widgetId,
				'item'=>json_encode($item), 
				'mycollection'=>$mycollection,
			));
		}
		else
		{
			$session->set('widget_url',$itemUrl);
			// new item - check if it is supported
			$parserResponse = $this->forward('ZeegaApiBundle:Parser:getParserValidate', array(), array("url" => $itemUrl))->getContent();
			//return new Response($parserResponse);
			$parserResponse = json_decode($parserResponse,true);
			//return new Response($parserResponse);
			if(isset($parserResponse))
			{
				$isUrlValid = $parserResponse["result"]["is_url_valid"];
				$isUrlCollection = $parserResponse["result"]["is_url_collection"];
				$items = $parserResponse["items"];
				
				if($isUrlValid)
				{
					
					
					$mycollection = $this->forward('ZeegaApiBundle:Search:search', array(), array("limit" => 15))->getContent();
					if($isUrlCollection)
					{
						//return new Response(var_dump($parserResponse));
						return $this->render('ZeegaIngestBundle:Widget:single.widget.html.twig', array(
							'displayname' => $user->getDisplayname(),
							'widget_id'=>$widgetId,
							'item'=>json_encode($items), 
							'mycollection'=>$mycollection,
						));						
					}
					else
					{
						return $this->render('ZeegaIngestBundle:Widget:single.widget.html.twig', array(
							'displayname' => $user->getDisplayname(),
							'widget_id'=>$widgetId,
							'item'=>json_encode($items), 
							'mycollection'=>$mycollection,
						));
					}
				}
				else
				{
				}
			}

    	}
	}	
	
	public function urlAction()
	{
    	$request=$this->getRequest();
    	$user = $this->get('security.context')->getToken()->getUser();
		$mycollection=$this->getDoctrine()->getRepository('ZeegaIngestBundle:Item')->findUserItems($user->getId());
		$session = $request->getSession();
		$widgetId=$request->query->get('widget-id');
		$logger = $this->get('logger');
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
		    	return $this->render('ZeegaIngestBundle:Widget:single.widget.html.twig', array(
					'displayname' => $user->getDisplayname(),
					'title'=>$item->getTitle(),
					'creator'=>$item->getMediaCreatorUsername(),
					'widget_id'=>$widgetId,
					'thumb_url'=>$metadata->getThumbnailUrl(),
					'mycollection'=>$mycollection,
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

				return $this->render('ZeegaIngestBundle:Widget:batch.widget.html.twig', array(
					'displayname' => $user->getDisplayname(),
					'title'=>$collection['title'],
					'creator'=>$collection['creator'],
					'widget_ids'=>$widgetIds,
					'thumb_urls'=>$thumbUrls,
					'mycollection'=>$mycollection,
					'count'=>count($thumbUrls),
				));
		
			}
			else{
				return $this->render('ZeegaIngestBundle:Widget:fail.widget.html.twig', array(
            		'displayname' => $user->getDisplayname(),
					'message'=>'Unable to process the media at this URL:',
					'url'=>json_encode($widgetId),
					'title'=>'temp title',
					'mycollection'=>$mycollection,
					));
			} 
    	}
	}
}
