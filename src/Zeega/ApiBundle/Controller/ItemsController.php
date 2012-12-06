<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\ApiBundle\Controller;

use Symfony\Component\HttpFoundation\Response;

use Zeega\DataBundle\Entity\Item;
use Zeega\CoreBundle\Controller\BaseController;

class ItemsController extends BaseController
{
    public function getItemsSearchAction()
    {
        $queryParser = $this->get('zeega_query_parser');
        $query = $queryParser->parseRequest($this->getRequest()->query);

        if(isset($query["data_source"]) && $query["data_source"] == "db") {
            $results = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->searchItems($query);                      
            $resultsCount = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->getTotalItems($query);        
        } else {
            $solr = $this->get('zeega_solr');
            $queryResults = $solr->search($query);
            $results = $queryResults["items"];
            $resultsCount = $queryResults["total_results"];
        }

        $recursiveResults = $query["result_type"] == "recursive" ? true : false;
        $itemView = $this->renderView('ZeegaApiBundle:Items:index.json.twig', array('items' => $results, 'items_count' => $resultsCount, 'load_children' => $recursiveResults, 'request' => array('query'=>$query)));
        return new Response($itemView);
    }

    /**
     * Parses a url and creates a Zeega item if the url is valid and supported.
     * - Path: GET items/parser
     * - Query string parameters:
     *     - url -  URL to be parsed
     *     - Boolean  $loadChildItems  If true the child item of the item will be loaded. Should be used for large collections if only the collection description is wanted.
     * @return Array|response
     */    
    public function getItemsParserAction()
    {
        $request = $this->getRequest();
        $url  = $request->query->get('url');

        if(!isset($url)) {
            $itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => new Item(), 'request' => $response["details"]));
        } else {           
            $loadChildren = $request->query->get('load_children');
            $loadChildren = (isset($loadChildren) && (strtolower($loadChildren) === "true" || $loadChildren === true)) ? true : false;
            $parser = $this->get('zeega_parser');
            $response = $parser->load($url, $loadChildren);
            $itemView = $this->renderView('ZeegaApiBundle:Items:index.json.twig', array('items' => $response["items"], 'request' => $response["details"], 'load_children' => $loadChildren));
        }
        
        return new Response($itemView);
    }

    //  get_collections GET    /api/items.{_format}
    public function getItemsRejectedAction()
    {
        $user = $this->get('security.context')->getToken()->getUser();
        $query = $this->getRequest()->query->all();
        $query["enabled"] = 0;
        $query["user"] = $user->getId();
        $query["type"] = "-project AND -Collection";

        return $this->forward('ZeegaApiBundle:Items:getItemsSearch', array(), $query);         
    }

    //  get_collections GET    /api/items.{_format}
    public function getItemsUnmoderatedAction()
    {
        $user = $this->get('security.context')->getToken()->getUser();
        $query = $this->getRequest()->query->all();
        $query["published"] = 0;
        $query["enabled"] = 1;
        $query["user"] = $user->getId();
        $query["type"] = "-project AND -Collection";

        return $this->forward('ZeegaApiBundle:Items:getItemsSearch', array(), $query);         
    }
    
    // get_collection GET    /api/item/{id}.{_format}
    public function getItemAction($id)
    {
        $queryParser = $this->get('zeega_query_parser');
        $query = $queryParser->parseRequest($this->getRequest()->query);
        $recursiveResults = $query["result_type"] == "recursive" ? true : false;

        $userIsAdmin = $this->get('security.context')->isGranted('ROLE_ADMIN');
        $userIsAdmin = (isset($userIsAdmin) && (strtolower($userIsAdmin) === "true" || $userIsAdmin === true)) ? true : false;
        $user = $this->get('security.context')->getToken()->getUser();
        
        if(isset($query["data_source"]) && $query["data_source"] == "db") {
            $em = $this->getDoctrine()->getEntityManager();
            $item = $em->getRepository('ZeegaDataBundle:Item')->findOneByIdWithUser($id);
            $itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => $item, 'user' => $user, 'user_is_admin' => $userIsAdmin, 'load_children' => true));
        } else {
            $solr = $this->get('zeega_solr');

            $query = $this->getRequest()->query->all();
            $query["id"] = $id;
            $query = $queryParser->parseRequest($query);
            $queryResults = $solr->search($query);
            $parentItem = $queryResults["items"][0];

            if(true === $recursiveResults) {
                $query = $this->getRequest()->query->all();
                $query["collection"] = $id;
                $query = $queryParser->parseRequest($query);
                $queryResults = $solr->search($query);

                $parentItem["child_items"] = $queryResults["items"];        
            }

            $itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => $parentItem, 'user' => $user, 'user_is_admin' => $userIsAdmin, 'load_children' => true));
        }

        return new Response($itemView);
    }
    
    //  get_collections GET    /api/items.{_format}
    public function getItemsAction()
    {
        $query = $this->getRequest()->query->all();
        $query["sort"] = "date-desc";
        
        return $this->forward('ZeegaApiBundle:Items:getItemsSearch', array(), $query);
    }

    // get_collection_items GET /api/collections/{id}/items.{_format}
    public function getItemItemsAction($id)
    {
        $item = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findOneById($id);    

        if(null !== $item) {
            $query = $this->getRequest()->query->all();
        
            if($item->getMediaType() == 'Collection' && $item->getLayerType() == 'Dynamic') {
                $itemAttributes = $item->getAttributes();

                if(isset($itemAttributes["tags"])) {
                    if(is_array($itemAttributes["tags"])) {
                        $query["tags"] = implode(" AND ", $itemAttributes["tags"]);    
                    } else {
                        $query["tags"] = $itemAttributes["tags"];
                    }
                }
            } else {
                $query["collection"] = $item->getId();
            }

            return $this->forward('ZeegaApiBundle:Items:getItemsSearch', array(), $query); 
        }

        return new Response($this->renderView('ZeegaApiBundle:Items:show.json.twig'));
    }

    // delete_collection   DELETE /api/items/{collection_id}.{_format}
    public function deleteItemAction($item_id)
    {
        // TO-DO - error handling; missing item, etc
        $em = $this->getDoctrine()->getEntityManager();
        $item = $em->getRepository('ZeegaDataBundle:Item')->find($item_id);
        $item->setEnabled(false);
        $item->setDateUpdated(new \DateTime("now"));
        $em->flush();
        $itemView = $this->renderView('ZeegaApiBundle:Items:delete.json.twig', array('item_id' => $item_id, 'status' => "Success"));
        
        return new Response($itemView);
    }

    // delete_collection   DELETE /api/items/{collection_id}.{_format}
    public function deleteItemItemAction($itemId,$childItemId)
    {
        // TO-DO - error handling; missing item, etc
        $em = $this->getDoctrine()->getEntityManager();
        $item = $em->getRepository('ZeegaDataBundle:Item')->findBy(array("id"=>$itemId,"enabled"=>1));
        $childItem = $em->getRepository('ZeegaDataBundle:Item')->findBy(array("id"=>$childItemId,"enabled"=>1));
        $item->getChildItems()->removeElement($childItem);
        $item->setChildItemsCount($item->getChildItems()->count());
        $item->setDateUpdated(new \DateTime("now"));
        $em->flush();
        $itemView = $this->renderView('ZeegaApiBundle:Collections:show.json.twig', array('item' => $item));
        
        return new Response($itemView);
    }

    public function postItemsAction()
    {
        $requestData = $this->getRequest()->request;
        if($requestData->has('id') && $requestData->get('id') !== null && $requestData->get('child_items') && $requestData->get('child_items') !== null) {
            $requestData->set('new_items', $requestData->get('child_items'));
            $requestData->set('child_items', null);

            return $this->forward('ZeegaApiBundle:Items:putItemItems', array("itemId"=>$requestData->get('id')), array());
        }

        $user = $this->get('security.context')->getToken()->getUser();
        $itemService = $this->get('zeega.item');
        $item = $itemService->parseItem($requestData->all(), $user);
        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($item);
        $em->flush();
        $itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => $item));

        return new Response($itemView);
    }
    
    // delete_items_tags  DELETE   /api/items/{itemId}/tags/{tagName}.{_format}
    public function deleteItemTagsAction($itemId, $tagName)
    {
        // TO-DO - error handling; missing item, etc
        $user = $this->get('security.context')->getToken()->getUser();
        $em = $this->getDoctrine()->getEntityManager();

        $item = $em->getRepository('ZeegaDataBundle:Item')->find($itemId);
        $tags = $item->getTags();
        if(isset($tags)) {
            if (in_array($tagName,$tags)) {
                unset($tags["$tagName"]);
                $item->setTags($tags);
                $item->setDateUpdated(new \DateTime("now"));
                $em->persist($item);
                $em->flush();
            }
        }

        return new Response($itemsView);
    }
    
    // put_collections_items   PUT    /api/collections/{project_id}/items.{_format}
    public function putItemsAction($item_id)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $request = $this->getRequest();
        $requestData = $this->getRequest()->request;        
        $user = $this->get('security.context')->getToken()->getUser();
        $itemService = $this->get('zeega.item');
        $item = $itemService->parseItem($requestData->all(), $user);
        $em->persist($item);
        $em->flush();
        $itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => $item));
        
        return new Response($itemView);
    }
    
    // put_collections_items   PUT    /api/collections/{project_id}/items.{_format}
    public function putItemItemsAction($itemId)
    {
        if($this->container->get('security.context')->isGranted('IS_AUTHENTICATED_FULLY'))
        {
            $em = $this->getDoctrine()->getEntityManager();
    
            $newItems = $this->getRequest()->request->get('new_items');
            $itemsToRemoveString = $this->getRequest()->request->get('items_to_remove'); 
            if(isset($itemsToRemoveString)) {  
                $itemsToRemove = array();
                $itemsToRemove = explode(",",$itemsToRemoveString);
            }
            
            $item = $em->getRepository('ZeegaDataBundle:Item')->find($itemId);
    
            if (isset($newItems)) {
                $item->setChildItemsCount(count($newItems));
                $item->setDateUpdated(new \DateTime("now"));
        
                $first = True;
                $thumbnailUrl = $item->getThumbnailUrl();
                
                $itemService = $this->get('zeega.item');
                $user = $this->get('security.context')->getToken()->getUser();

                foreach($newItems as $newItem) {
                    if(!is_array($newItem)) {    
                        $childItem = $em->getRepository('ZeegaDataBundle:Item')->find($newItem);
                        if (!$childItem) {
                            throw $this->createNotFoundException('Unable to find Item entity.');
                        }    
                        
                        $childItem->setDateUpdated(new \DateTime("now"));                        
                    } else {
                        $existingItem = $em->getRepository('ZeegaDataBundle:Item')->findOneBy(array("uri" => $newItem['uri'], "enabled" => 1, "user_id" => $user->getId()));
                        if(isset($existingItem) && count($existingItem) > 0) {
                            // the item is a duplicate; skip the rest of the current loop iteration and continue execution at the condition evaluation
                            continue;
                        } else {
                            $childItem = $itemService->parseItem($newItem, $user);
                            $item->addChildItem($childItem);
                        }
                    }
                }

                $item->setChildItemsCount($item->getChildItems()->count() + count($newItems));

                $em->persist($item);
                $em->flush();
            }
            
            if(isset($itemsToRemove)) {
                foreach($itemsToRemove as $itemToRemoveId) {
                    $childItem = $em->getRepository('ZeegaDataBundle:Item')->find($itemToRemoveId);
                    if (isset($childItem))  {
                        $item->getChildItems()->removeElement($childItem);
                    }
                }
                $item->setChildItemsCount($item->getChildItems()->count());
        
                $item->setDateUpdated(new \DateTime("now"));
        
                $em->flush();
            }
    
            $itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => $item));
            return new Response($itemsView);
        }
        else
        {
            return new Response("Unauthorized", 401);
        }
    }
   
    // get_collection_project GET    /api/collections/{id}/project.{_format}
    public function getItemProjectAction($id)
    {
        $item = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findOneById($id);
        
        if(null !== $item) {
            $i=1;
            $frameOrder=array();
            $frames=array();
            $layers=array();

            $queryParser = $this->get('zeega_query_parser');
            $query = $this->getRequest()->query->all();
            $query["type"] = "-project";

            if($item->getMediaType() == 'Collection' && $item->getLayerType() == 'Dynamic') {
                if(isset($itemAttributes["tags"])) {
                    if(is_array($itemAttributes["tags"])) {
                        $query["tags"] = implode(" AND ", $itemAttributes["tags"]);    
                    } else {
                        $query["tags"] = $itemAttributes["tags"];
                    }
                }
            } else {
                $query["collection"]  = $id;
            }

            $query = $queryParser->parseRequest($this->getRequest()->query);

            $solr = $this->get('zeega_solr');
            $queryResults = $solr->search($query);
            $queryResults = $queryResults["items"];
            
            foreach($queryResults as $childItem) {
                if($childItem['media_type']!='Collection' && $childItem['media_type']!='Pdf') {
                    $i++;
                    $frameId = (int)$childItem['id'];
                    $frameOrder[]=$frameId;
                    $frames[]=array("id"=>$frameId,"sequence_index"=>0,"layers"=>array($i),"attr"=>array("advance"=>0));
                    
                    $layer = array("id"=>$i,"media_type"=>$childItem['media_type'],"layer_type"=>$childItem['layer_type']);
                    
                    if(isset($childItem['text'])) {
                        $layer["text"] = $childItem['text'];
                    }

                    $layer["attr"] = array();
                    $layer["attr"]["user_id"] = $childItem['user_id'];
                    $layer["attr"]["uri"] = $childItem['uri'];
                    $layer["attr"]["attribution_uri"] =$childItem['attribution_uri'];
                    
                    if(isset($childItem['title_i'])) {
                        $layer["attr"]["title"] = $childItem['title_i'];
                    }

                    if(isset($childItem['description_i'])) {
                        $layer["attr"]["description"] = $childItem['description_i'];
                    }

                    if(isset($childItem['thumbnail_url'])) {
                        $layer["attr"]["thumbnail_url"] = $childItem['thumbnail_url'];
                    }

                    if(isset($childItem['media_creator_username'])) {
                        $layer["attr"]["media_creator_username"] = $childItem['media_creator_username'];
                    }

                    if(isset($childItem['media_creator_realname'])) {
                        $layer["attr"]["media_creator_realname"] = $childItem['media_creator_realname'];
                    }

                    if(isset($childItem['media_date_created'])) {
                        $layer["attr"]["media_date_created"] = $childItem['media_date_created'];
                    }

                    if(isset($childItem['date_created'])) {
                        $layer["attr"]["date_created"] = $childItem['date_created'];
                    }

                    if(isset($childItem['tags'])) {
                        $layer["attr"]["tags"] = $childItem['tags'];
                    }

                    if(isset($childItem['media_geo_latitude'])) {
                        $layer["attr"]["media_geo_latitude"] = $childItem['media_geo_latitude'];
                    }

                    if(isset($childItem['media_geo_longitude'])) {
                        $layer["attr"]["media_geo_longitude"] = $childItem['media_geo_longitude'];
                    }

                    if(isset($childItem['archive'])) {
                        $layer["attr"]["archive"] = $childItem['archive'];
                    }

                    $layers[] = $layer;
                }
            }               
            

            $project = array("id"=>$item->getId(),
                  "title"=>$item->getTitle(),
                  "estimated_time"=>"Some time", 
                  "sequences"=>array(array('id'=>1,'frames'=>$frameOrder,"title"=>'none', 'attr'=>array("persistLayers"=>array()))),
                  'frames'=>$frames,
                  'layers'=>$layers,
                );

            return new Response(json_encode($project));
        }
    }
}
