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

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

use Zeega\DataBundle\Entity\Item;
use Zeega\CoreBundle\Helpers\ItemCustomNormalizer;
use Zeega\CoreBundle\Helpers\ResponseHelper;
use Zeega\CoreBundle\Controller\BaseController;

class ItemsController extends BaseController
{
    public function getItemsSearchAction()
    {
        // parse the query
        $queryParser = $this->get('zeega_query_parser');
        $query = $queryParser->parseRequest($this->getRequest()->query);
        echo '<pre>'; print_r($query); echo '</pre>';
        return new Response();

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

        $itemView = $this->renderView('ZeegaApiBundle:Items:index.json.twig', array('items' => $results, 'items_count' => $resultsCount, 'load_children' => $recursiveResults));

        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
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

        if(!isset($url))
        {
            $itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => new Item(), 'request' => $response["details"]));
        }
        else
        {           
            $loadChildren = $request->query->get('load_children');
            $loadChildren = (isset($loadChildren) && (strtolower($loadChildren) === "true" || $loadChildren === true)) ? true : false;
            $parser = $this->get('zeega_parser');
        
            // parse the url with the IngestionBundle\Parser\ParserService
            $response = $parser->load($url, $loadChildren);

            $itemView = $this->renderView('ZeegaApiBundle:Items:index.json.twig', array('items' => $response["items"], 'request' => $response["details"], 'load_children' => $loadChildren));
        }
        
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
    }

    //  get_collections GET    /api/items.{_format}
    public function getItemsRejectedAction()
    {
        $query = array();
        $user = $this->get('security.context')->getToken()->getUser();

        $request = $this->getRequest();
        //  api global parameters
        $query["page"]  = $request->query->get('page');      //  string
        $query["limit"] = $request->query->get('limit');     //  string
        $query["enabled"] = False;
        $query["userId"] = $user->getId();
        $query["notContentType"] = array("project", "Collection");
                
        //  set defaults for missing parameters  
        if(!isset($query['page']))          $query['page'] = 0;
        if(!isset($query['limit']))         $query['limit'] = 100;
        
        $queryResults = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->searchItems($query);     

        $resultsCount = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->getTotalItems($query);             
        
        $itemsView = $this->renderView('ZeegaApiBundle:Items:index.json.twig', array('items' => $queryResults, 'items_count' => $resultsCount));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($itemsView);
    }

    //  get_collections GET    /api/items.{_format}
    public function getItemsUnmoderatedAction()
    {
        $query = array();
        $user = $this->get('security.context')->getToken()->getUser();

        $request = $this->getRequest();
        //  api global parameters
        $query["page"]  = $request->query->get('page');      //  string
        $query["limit"] = $request->query->get('limit');     //  string
        $query["published"] = 0;
        $query["enabled"] = True;
        $query["userId"] = $user->getId();
        $query["notContentType"] = array("project", "Collection");
                
        //  set defaults for missing parameters  
        if(!isset($query['page']))          $query['page'] = 0;
        if(!isset($query['limit']))         $query['limit'] = 100;
        
        $queryResults = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->searchItems($query);     

        $resultsCount = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->getTotalItems($query);             
        
        $itemsView = $this->renderView('ZeegaApiBundle:Items:index.json.twig', array('items' => $queryResults, 'items_count' => $resultsCount));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($itemsView);
    }
    
    // get_collection GET    /api/item/{id}.{_format}
    public function getItemAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();
        
        $user = $this->get('security.context')->getToken()->getUser();
        $userIsAdmin = $this->get('security.context')->isGranted('ROLE_ADMIN');
        $userIsAdmin = (isset($userIsAdmin) && (strtolower($userIsAdmin) === "true" || $userIsAdmin === true)) ? true : false;
        
        $item = $em->getRepository('ZeegaDataBundle:Item')->findOneByIdWithUser($id);
        $itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => $item, 'user' => $user, 'user_is_admin' => $userIsAdmin, 'load_children' => true));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
    }
    
    //  get_collections GET    /api/items.{_format}
    public function getItemsAction()
    {
        $query = array();
        
        $request = $this->getRequest();
        //  api global parameters
        $query["page"]  = $request->query->get('page');      //  string
        $query["limit"] = $request->query->get('limit');     //  string
                
        //  set defaults for missing parameters  
        if(!isset($query['page']))          $query['page'] = 0;
        if(!isset($query['limit']))         $query['limit'] = 100;
        if($query['limit'] > 100)           $query['limit'] = 100;
        $query["arrayResults"] = true;

         //  execute the query
        $queryResults = $this->getDoctrine()
                             ->getRepository('ZeegaDataBundle:Item')
                             ->searchItems($query);                             
        //return new Response(var_dum$queryResults);
        $resultsCount = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->getTotalItems($query);             
        
        $itemsView = $this->renderView('ZeegaApiBundle:Items:index.json.twig', array('items' => $queryResults, 'items_count' => $resultsCount));
        //$response = new Response($itemsView);
        //$response->headers->set('Content-Type', 'text');
        //return $response;
        
        return ResponseHelper::compressTwigAndGetJsonResponse($itemsView);
    }

    // get_item_tags GET /api/items/{itemId}/tags.{_format}
    public function getItemCollectionsAction($itemId)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $items = $em->getRepository('ZeegaDataBundle:Item')->searchItemsParentsById($itemId);
        $itemView = $this->renderView('ZeegaApiBundle:Items:index.json.twig', array('items' => $items));
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
    }
        
    // get_collection_items GET /api/collections/{id}/items.{_format}
    public function getItemItemsAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $query = array();
        $request = $this->getRequest();

        $page = $request->query->get('page'); // string
        $limit = $request->query->get('limit'); // string
        $returnCounts = $request->query->get('r_counts'); // string
        
        // set defaults for missing parameters
        if(!isset($page)) $page = 0;
        if(!isset($limit)) $limit = 100;
        if(!isset($returnCounts)) {
            $returnCounts = 0;
        }

        $item = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findOneById($id);    
        
        if(null !== $item) {
            if($item->getMediaType() == 'Collection' && $item->getLayerType() == 'Dynamic') {
                $itemAttributes = $item->getAttributes();

                $attributes = array();

                if(isset($itemAttributes["tags"])) {
                    $attributes["tags"] = $itemAttributes["tags"];
                }

                if(isset($itemAttributes["tags"])) {
                    $attributes["tags"] = $itemAttributes["tags"];
                }

                $attributes["r_itemswithcollections"] = 1;                
                $attributes["user"] = $item->getUserId();
                $attributes["page"] = $page;
                $attributes["limit"] = $limit;
                $attributes["r_counts"] = $returnCounts;

                return $this->forward('ZeegaApiBundle:Search:search', array(), $attributes); 
            } else {
                return $this->forward('ZeegaApiBundle:Search:search', array(), array("r_items" => 1, "collection" => $item->getId(), "page" => $page, "limit" => $limit)); 
            }
        }
    }

    // delete_collection   DELETE /api/items/{collection_id}.{_format}
    public function deleteItemAction($item_id)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $item = $em->getRepository('ZeegaDataBundle:Item')->find($item_id);
        
        if (!$item) 
        {
            throw $this->createNotFoundException('Unable to find a Collection with the id ' . $item_id);
        }
        
        $item->setEnabled(false);
        $item->setDateUpdated(new \DateTime("now"));
        $em->flush();
        
        $itemView = $this->renderView('ZeegaApiBundle:Items:delete.json.twig', array('item_id' => $item_id, 'status' => "Success"));
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);  
    }

    // delete_collection   DELETE /api/items/{collection_id}.{_format}
    public function deleteItemItemAction($itemId,$childItemId)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $item = $em->getRepository('ZeegaDataBundle:Item')->findBy(array("id"=>$itemId,"enabled"=>1));
        $childItem = $em->getRepository('ZeegaDataBundle:Item')->findBy(array("id"=>$childItemId,"enabled"=>1));

        if (!$item) 
        {
            throw $this->createNotFoundException("The item $item does not exist");
        }

        if (!$childItem) 
        {
            throw $this->createNotFoundException("The item $childItem does not exist");
        }

        $item->getChildItems()->removeElement($childItem);
        $item->setChildItemsCount($item->getChildItems()->count());
        $item->setDateUpdated(new \DateTime("now"));

        $em->flush();

        $itemView = $this->renderView('ZeegaApiBundle:Collections:show.json.twig', array('item' => $item));
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
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

        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
    }
    
    // delete_items_tags  DELETE   /api/items/{itemId}/tags/{tagName}.{_format}
    public function deleteItemTagsAction($itemId, $tagName)
    {
        $user = $this->get('security.context')->getToken()->getUser();
        $em = $this->getDoctrine()->getEntityManager();

        $item = $em->getRepository('ZeegaDataBundle:Item')->find($itemId);
           
        if (!$item)
        {
            throw $this->createNotFoundException('Unable to find the Item with the id . $itemId');
        }

        $tags = $item->getTags();
        if(isset($tags))
        {
            if (in_array($tagName,$tags))
            {
                unset($tags["$tagName"]);
                $item->setTags($tags);
                $item->setDateUpdated(new \DateTime("now"));
                $em->persist($item);
                $em->flush();
            }
        }

        return ResponseHelper::encodeAndGetJsonResponse($item);
    }
    
    // put_collections_items   PUT    /api/collections/{project_id}/items.{_format}
    public function putItemsAction($item_id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $request = $this->getRequest();
        $requestData = $this->getRequest()->request;        
        
        $item = $this->populateItemWithRequestData($requestData);
        $em->persist($item);
        $em->flush();

        $itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => $item));
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);       
    }
    
    // put_collections_items   PUT    /api/collections/{project_id}/items.{_format}
    public function putItemItemsAction($itemId)
    {
        if($this->container->get('security.context')->isGranted('IS_AUTHENTICATED_FULLY'))
        {
            $em = $this->getDoctrine()->getEntityManager();
    
            $newItems = $this->getRequest()->request->get('new_items');
            $itemsToRemoveString = $this->getRequest()->request->get('items_to_remove'); 
            if(isset($itemsToRemoveString))
            {  
                $itemsToRemove = array();
                $itemsToRemove = explode(",",$itemsToRemoveString);
            }
            
            $item = $em->getRepository('ZeegaDataBundle:Item')->find($itemId);
    
            if (isset($newItems))
            {
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
            
            if(isset($itemsToRemove))
            {
                foreach($itemsToRemove as $itemToRemoveId)
                {
                    $childItem = $em->getRepository('ZeegaDataBundle:Item')->find($itemToRemoveId);
                    if (isset($childItem)) 
                    {
                        
                        $item->getChildItems()->removeElement($childItem);
                    }
                }
                $item->setChildItemsCount($item->getChildItems()->count());
        
                $item->setDateUpdated(new \DateTime("now"));
        
                $em->flush();
            }
    
            $itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => $item));
            return ResponseHelper::compressTwigAndGetJsonResponse($itemView);       
        }
        else
        {
            return new Response("Unauthorized", 401);
        }
    }
    
   
    // get_collection_project GET    /api/collections/{id}/project.{_format}
    public function getItemProjectAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();
        
        $query = array();
        $request = $this->getRequest();
        
        $query["collection_id"]  = $id;
        $query["page"]  = $request->query->get('page');      //  string
        $query["limit"] = $request->query->get('limit');     //  string
        
        //  set defaults for missing parameters  
        if(!isset($query['page']))          $query['page'] = 0;
        if($query['page'] > 0) {
            $query['page'] = $query['page'] - 1;
        }    
        if(!isset($query['limit']))         $query['limit'] = 100;
        if($query['limit'] > 100)           $query['limit'] = 100;

        $item = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findOneById($id);
        
        //HAMMER
        if(null !== $item) {
            $i=1;
            $frameOrder=array();
            $frames=array();
            $layers=array();

            if($item->getMediaType() == 'Collection' && $item->getLayerType() == 'Dynamic') {
                $itemAttributes = $item->getAttributes();

                $attributes = $query;
			
                if(isset($itemAttributes["tags"])) {
                    $attributes["tags"] = $itemAttributes["tags"];
                }

                $attributes["r_itemswithcollections"] = 1;                
                $attributes["user"] = $item->getUserId();

                $queryResults = $this->forward('ZeegaApiBundle:Search:search', array(), $attributes)->getContent(); 
                $queryResults = json_decode($queryResults,true);
                $queryResults = $queryResults["items"];
            } else {
                $queryResults = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->searchCollectionItems($query);
            }

            foreach($queryResults as $childItem) {
                if($childItem['media_type']!='Collection' && $childItem['media_type']!='Pdf') {
                    $i++;
                    $frameId = (int)$childItem['id'];
                    $frameOrder[]=$frameId;
                    $frames[]=array("id"=>$frameId,"sequence_index"=>0,"layers"=>array($i),"attr"=>array("advance"=>0));
                    $layers[]=array("id"=>$i,"type"=>$childItem['layer_type'],"text"=>$childItem['text'],
                        "attr"=>array(
                            "user_id"=>$childItem['user_id'],
                            "description"=>$childItem['description'],
                            "title"=>$childItem['title'],
                            "uri"=>$childItem['uri'],
                            "thumbnail_url"=>$childItem['thumbnail_url'],
                            "attribution_uri"=>$childItem['attribution_uri'],
                            "media_creator_username"=>$childItem['media_creator_username'],
                            "media_creator_realname"=>$childItem['media_creator_realname'],
                            "media_date_created"=>$childItem['media_date_created'],
                            "date_created"=>$childItem['date_created'],
                            "tags"=>$childItem['tags'],
                            "media_geo_latitude"=>$childItem['media_geo_latitude'],
                            "media_geo_longitude"=>$childItem['media_geo_longitude'],
                            "archive"=>$childItem['archive'],
                            "media_type"=>$childItem['media_type'],
                            "layer_type"=>$childItem['layer_type'] 
                        ));
                }
            }               
            

            $project = array("id"=>$item->getId(),
                  "title"=>$item->getTitle(),
                  "estimated_time"=>"Some time", 
                  "sequences"=>array(array('id'=>1,'frames'=>$frameOrder,"title"=>'none', 'attr'=>array("persistLayers"=>array()))),
                  'frames'=>$frames,
                  'layers'=>$layers,
                );
            return ResponseHelper::getJsonResponse($project);
        }
    }
}
