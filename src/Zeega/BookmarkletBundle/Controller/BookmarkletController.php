<?php

namespace Zeega\BookmarkletBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Zeega\DataBundle\Document\Item;
use Zeega\CoreBundle\Controller\BaseController;
use Imagick;
use DateTime;
use SimpleXMLElement;

/**
 * Bookmarklet controller
 */
class BookmarkletController extends BaseController
{
	/**
     * Persists the results of a Zeega parser call. Gets a JSON file in the request variable and saves it on the Zeega database.
     *
     * @return Response
     *
     */
	public function persistAction()
    {
        $request = $this->getRequest();

        $itemUrl = $request->request->get('attribution_uri');
        $mediaType = strtolower($request->request->get('media_type'));
        $layerType = strtolower($request->request->get('layer_type'));

		$itemWithChildren = $this->forward('ZeegaApiBundle:Items:getItemsParser', array(), array("load_children" => true,"url" => $itemUrl))->getContent();
        $itemWithChildren = json_decode($itemWithChildren,true);

        if(isset($itemWithChildren)) {
            $request->request->set('child_items', $itemWithChildren["items"][0]["child_items"]);
        }
		
		return $this->forward('ZeegaApiBundle:Items:postItems', array(), array());
    }


	/**
     * Renders the bookmarklet when it is opened. Gets the URL of the item being ingested through the Request container,
     * sends it to the parser and renders the result on the bookmarklet if it can be ingested or an error otherwise. 
     *
     * @return Response
     *
     */    
    public function openAction()
    {
        $em = $this->getDoctrine()->getEntityManager();
        $request = $this->getRequest();
        $session = $request->getSession();
        
        // get logged user
        $user = $this->get('security.context')->getToken()->getUser();
        
        $widgetId = $request->query->get('widget-id');
        $itemUrl = $request->query->get('url');
        
        $parserResponse = $this->forward('ZeegaApiBundle:Items:getItemsParser', array(), array("url" => $itemUrl))->getContent();
        $parserResponse = json_decode($parserResponse,true);
        $message = "SORRY! We can't add this item.";
        
        if(isset($parserResponse))
        {
            $isUrlValid = $parserResponse["request"]["success"];
            $isUrlCollection = $parserResponse["request"]["is_set"];
            $message = $parserResponse["request"]["message"];
            $items = $parserResponse["items"];
            
            if($isUrlValid && count($items) > 0)
            {    
                $parsedItem = $items[0];
                
                // check if the item exists on the database    
                $item = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findOneBy(array("user"=>$user->getId(),"attributionUri" => $parsedItem["attribution_uri"], "enabled" => 1));
                
                if(isset($item)) {
                    $update = 1;
                    $parsedItem["id"] = $item->getId();
                } else {
                    $update = 0;
                }    
                
                if($parsedItem["archive"] == "Dropbox")
                {                    
                    if(!$update && $parsedItem["child_items_count"]==0)
                    {
                        // Dropbox - welcome screen for the initial connection with dropbox

                        return $this->render(
                            'ZeegaBookmarkletBundle:Bookmarklet:dropboxwelcome.widget.html.twig', 
                            array(
                                'displayname' => $user->getDisplayname(),
                                'widget_id'=>$widgetId,
                                'item'=>json_encode($parsedItem), 
                                'update'=>$update,
                                'child_items_count'=>$parsedItem["child_items_count"],
                                'archive'=>$parsedItem["archive"],
                            )
                        );
                    }
                }
                else if($parsedItem["archive"] == "Facebook")
                {
                    // Facebook - needs to be loaded in a pop-up

                    if($parsedItem["child_items_count"]==-1){ // no access token.  overloading child_items_count is a hack.  Find cleaner way soon.
                        //header('X-Frame-Options: Allow'); 
                        $requirePath = __DIR__ . '/../../../../vendor/facebook/facebook.php';
                        require_once $requirePath;
                        $facebook = new \Facebook(array(
                          'appId'  => '459848834048078',
                          'secret' => 'f5b344b91bff03ace4df454e35fca4e4',
                        ));
                        $loginUrlParams = array(
                        'scope'   => 'user_photos,friends_photos',
                        'display' => 'popup'
                        );
                        $loginUrl = $facebook->getLoginUrl($loginUrlParams);
                        return $this->render(
                            'ZeegaBookmarkletBundle:Bookmarklet:facebookWelcome.widget.html.twig', 
                            array(
                                'displayname' => $user->getDisplayname(),
                                'widget_id'=>$widgetId,
                                'item'=>json_encode($parsedItem), 
                                'update'=>$update,
                                'archive'=>$parsedItem["archive"],
                                'child_items_count'=>$parsedItem["child_items_count"],
                                'login_url' => $loginUrl,
                            )
                        );    
                    }else{ // access token
                        return $this->render(
                            'ZeegaBookmarkletBundle:Bookmarklet:widget.html.twig', 
                            array(
                                'displayname' => $user->getDisplayname(),
                                'widget_id'=>$widgetId,
                                'item'=>json_encode($parsedItem), 
                                'update'=>$update,
                                'archive'=>$parsedItem["archive"],
                                'thumbnail_url'=>$parsedItem["thumbnail_url"],    
                                'child_items_count'=>$parsedItem["child_items_count"],
                            )
                        );    
                    }
                }
                else if($update)
                {
                    return $this->render(
                        'ZeegaBookmarkletBundle:Bookmarklet:duplicate.widget.html.twig', array(
                            'displayname' => $user->getDisplayname(),
                            'widget_id'=>$widgetId,
                            'item'=>$item, 
                            'update'=>$update,
                            'archive'=>$parsedItem["archive"],
                        )
                    );    
                }

                // for all other cases
                return $this->render(
                    'ZeegaBookmarkletBundle:Bookmarklet:widget.html.twig', array(
                        'displayname' => $user->getDisplayname(),
                        'widget_id'=>$widgetId,
                        'item'=>json_encode($parsedItem), 
                        'update'=>$update,
                        'archive'=>$parsedItem["archive"],
                        'thumbnail_url'=>$parsedItem["thumbnail_url"],
                        'child_items_count'=>$parsedItem["child_items_count"],
                    )
                );                        
            }
        }
        return $this->render('ZeegaBookmarkletBundle:Bookmarklet:fail.widget.html.twig', array(
            'displayname' => $user->getDisplayname(),
            'widget_id'=>$widgetId,
            'item'=>json_encode(array()), 
            'urlmessage' => $message,
            'url'=> $itemUrl,
            'archive'=>"",
        ));
    }    
}
