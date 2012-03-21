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
