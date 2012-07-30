<?php

namespace Zeega\BookmarkletBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Zeega\DataBundle\Entity\Media;
use Zeega\DataBundle\Entity\Metadata;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\Site;
use Zeega\DataBundle\Entity\User;
use Zeega\CoreBundle\Helpers\ResponseHelper;
use Imagick;
use DateTime;
use SimpleXMLElement;

class BookmarkletController extends Controller
{
   	public function persistAction()
	{
	    $request = $this->getRequest();
	    $itemUrl = $request->request->get('attribution_uri');
	    $mediaType = strtolower($request->request->get('media_type'));

        // if it is a collection load the collection items
	    if($mediaType == "collection")
	    {
	        $itemWithChildren = $this->forward('ZeegaApiBundle:Items:getItemsParser', array(), array("load_children" => true,"url" => $itemUrl))->getContent();
			$itemWithChildren = json_decode($itemWithChildren,true);

	        if(isset($itemWithChildren))
	        {
	            $request->request->set('new_items', $itemWithChildren["items"][0]["child_items"]);
	            $newItems = $request->request->get('new_items');
	        }
	    }
	    
	    return $this->forward('ZeegaApiBundle:Items:postItems', array(), array());
	}
	
	public function openAction()
	{
		$em = $this->getDoctrine()->getEntityManager();
    	$request = $this->getRequest();
		$session = $request->getSession();
    	
		// get logged user
		$user = $this->get('security.context')->getToken()->getUser();
		
		// get user items and sites
		$mycollection = $this->forward('ZeegaApiBundle:Items:getItemsFilter', array("limit" => 15, "user" => $user->getId()))->getContent();
		$sites = $user->getSites();
		
		$widgetId = $request->query->get('widget-id');
		$itemUrl = $request->query->get('url');
		
		$parserResponse = $this->forward('ZeegaApiBundle:Items:getItemsParser', array(), array("url" => $itemUrl))->getContent();
        $parserResponse = json_decode($parserResponse,true);
		if(isset($parserResponse))
		{
			// quick fix - try / catch will be removed
			try
			{
				$isUrlValid = $parserResponse["request"]["success"];
				$isUrlCollection = $parserResponse["request"]["is_set"];
				$message = $parserResponse["request"]["message"];
				$items = $parserResponse["items"];
            
				if($isUrlValid && count($items) > 0)
				{
				    $parsedItem = $items[0];
					// check if the item exists on the database	
	        		$item = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findOneBy(array("attribution_uri" => $parsedItem["attribution_uri"], "enabled" => 1));
                	
	        		if(isset($item))
	        		{
	        		    // item was imported before
						if($isUrlCollection){
							return $this->render('ZeegaBookmarkletBundle:Bookmarklet:batchUpdate.widget.html.twig', array(
								'displayname' => $user->getDisplayname(),
								'widget_id'=>$widgetId,
								'item'=>json_encode($parsedItem), 
								'mycollection'=>$mycollection,
								'child_items_count'=>$parsedItem["child_items_count"],
							));						
						}
						else
						{	
							return $this->render('ZeegaBookmarkletBundle:Bookmarklet:singleUpdate.widget.html.twig', array(
								'displayname' => $user->getDisplayname(),
								'widget_id'=>$widgetId,
								'item'=>json_encode($parsedItem), 
								'mycollection'=>$mycollection,
							));
						}
	        		 	// item was imported before
	        			//return $this->render('ZeegaCoreBundle:Widget:duplicate.widget.html.twig', array(
	        			//	'displayname' => $user->getDisplayname(),
	        			//	'media_type' => $item->getMediaType(),
	        			//	'widget_id'=>$widgetId,
	        			//	'item' => ResponseHelper::serializeEntityToJson($item),
	        			//	'mycollection'=>$mycollection,
	        			//));
	        		}
					else if($isUrlCollection)
					{
						return $this->render('ZeegaBookmarkletBundle:Bookmarklet:batch.widget.html.twig', array(
							'displayname' => $user->getDisplayname(),
							'widget_id'=>$widgetId,
							'item'=>json_encode($parsedItem), 
							'mycollection'=>$mycollection,
							'child_items_count'=>$parsedItem["child_items_count"],
						));						
					}
					else
					{
						return $this->render('ZeegaBookmarkletBundle:Bookmarklet:single.widget.html.twig', array(
							'displayname' => $user->getDisplayname(),
							'widget_id'=>$widgetId,
							'item'=>json_encode($parsedItem), 
							'mycollection'=>$mycollection,
						));
					}
				}
			}
			catch(Exception $e)
			{
				return $this->render('ZeegaBookmarkletBundle:Bookmarklet:fail.widget.html.twig', array(
					'displayname' => $user->getDisplayname(),
					'widget_id'=>$widgetId,
					'item'=>json_encode($items), 
					'mycollection'=>$mycollection,
					'urlmessage' => $message,
					'url'=> $itemUrl,
				));
			}
		}
<<<<<<< HEAD:src/Zeega/BookmarkletBundle/Controller/BookmarkletController.php
		
		return $this->render('ZeegaBookmarkletBundle:Bookmarklet:fail.widget.html.twig', array(
=======
		return $this->render('ZeegaCoreBundle:Widget:fail.widget.html.twig', array(
>>>>>>> dropbox:src/Zeega/CoreBundle/Controller/WidgetController.php
			'displayname' => $user->getDisplayname(),
			'widget_id'=>$widgetId,
			'item'=>json_encode(array()), 
			'mycollection'=>$mycollection,
			'urlmessage' => '',
			'url'=> $itemUrl,
		));
	}	
}
