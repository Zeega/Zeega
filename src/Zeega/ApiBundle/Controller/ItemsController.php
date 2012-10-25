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

class ItemsController extends Controller
{
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
        
            // parse the url with the ExtensionsBundle\Parser\ParserService
            $response = $parser->load($url, $loadChildren);

            $itemView = $this->renderView('ZeegaApiBundle:Items:index.json.twig', array('items' => $response["items"], 'request' => $response["details"], 'load_children' => $loadChildren));
        }
        
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
    }
    
    //  get_collections GET    /api/items.{_format}
    public function getItemsFilterAction()
    {
        $request = $this->getRequest();
        
        $page  = $request->query->get('page');          //  string
        $limit = $request->query->get('limit');         //  string
        $user = $request->query->get('user');           //  string
        $content = $request->query->get('content');     //  string
        $site = $request->query->get('site');     //  string
        $excludeContent = $request->query->get('exclude_content');     //  string
        $loadChildItems = $request->query->get('load_children');     //  string
        
        $query = array();

        if(isset($page))                    $query['page'] = $page;
        if(isset($limit))                   $query['limit'] = $limit;
        if(isset($loadChildItems))          $query['load_children'] = $loadChildItems;
        if(isset($content))                 $query['content'] = $content;
        if(isset($excludeContent))          $query['exclude_content'] = $excludeContent;
        if(isset($site))                    $query['site'] = $site;

        if(!isset($page))                   $query['page'] = 0;
        if(!isset($limit))                  $query['limit'] = 100;
        if(!isset($loadChildItems))         $query['load_children'] = false;
        
        if(isset($user))
        {
            if($user == -1) 
            {
                $user = $this->get('security.context')->getToken()->getUser();
                $query['user'] = $user->getId();
            }
            else
            {
                $query['user'] = $user;
            }
        }
         //  execute the query
        $queryResults = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findItems($query,false);
        
        $itemsView = $this->renderView('ZeegaApiBundle:Items:index.json.twig', array('items' => $queryResults["items"], 'items_count' => $queryResults["total_items"]));        
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
        if($limit > 100) $limit = 100;
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


    // post_collections POST   /api/collections.{_format}
    public function postItemsAction()
    {
        $em = $this->getDoctrine()->getEntityManager();
        
        $requestData = $this->getRequest()->request;      

        $item = $this->populateItemWithRequestData($requestData);

        $em->persist($item);
        $em->flush();
        
        // create a thumbnail
        $this->forward('ZeegaCoreBundle:Thumbnails:getItemThumbnail', array("itemId" => $item->getId()));
        
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
                
                foreach($newItems as $newItem)
                {
                    $childItem = $em->getRepository('ZeegaDataBundle:Item')->find($newItem);

                    if (!$childItem) 
                    {
                        throw $this->createNotFoundException('Unable to find Item entity.');
                    }    
                    
                    $childItem->setDateUpdated(new \DateTime("now"));
                    $childItem->setIndexed(false);
                    $item->setIndexed(false);
                    $item->addItem($childItem);
                    
                    if($first == True && !isset($thumbnailUrl))
                    {
                        $item->setThumbnailUrl($childItem->getThumbnailUrl());
                        $first = False;
                    }
                }
                $item->setChildItemsCount($item->getChildItems()->count());

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

                $attributes = array();

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
    
   
    // Private methods     
    private function populateItemWithRequestData($request_data, $persistChildItems = false)
    {   
        $em = $this->getDoctrine()->getEntityManager(); 
        $user = $this->get('security.context')->getToken()->getUser();
        
        $id = $request_data->get('id');
        $title = $request_data->get('title');
        $description = $request_data->get('description');
        $text = $request_data->get('text');
        $uri = $request_data->get('uri');
        $attributionUri = $request_data->get('attribution_uri');
        $mediaType = $request_data->get('media_type');
        $layerType = $request_data->get('layer_type');
        $thumbnailUrl = $request_data->get('thumbnail_url');
        $mediaGeoLatitude = $request_data->get('media_geo_latitude');
        $mediaGeoLongitude = $request_data->get('media_geo_longitude');
        $mediaDateCreated = $request_data->get('media_date_created');
        $mediaCreatorUsername = $request_data->get('media_creator_username');
        $mediaCreatorRealname = $request_data->get('media_creator_realname');
        $archive = $request_data->get('archive');
        $location = $request_data->get('location');
        $license = $request_data->get('license');
        $attributes = $request_data->get('attributes');
        $tags = $request_data->get('tags');
        $published = $request_data->get('published');
        $user_id = $request_data->get('user_id');
        
        $session = $this->getRequest()->getSession();
        $site = $session->get('site');
        if(isset($site))
        {
            $site = $em->getRepository('ZeegaDataBundle:Site')->find($site->getId());
        }
        
        if($this->container->get('security.context')->isGranted('IS_AUTHENTICATED_FULLY'))
        {
            if(!isset($site) && isset($user))
            {
                $sites = $user->getSites();
                if(isset($sites) && count($sites) > 0)
                {
                    $site = $sites[0];

                }
                else
                {
                    $site = $em->getRepository('ZeegaDataBundle:Site')->findOneByShort('home');
                }
            }
        } else if(isset($user_id) && $user_id == 760) {
            $user = $em->getRepository('ZeegaDataBundle:User')->findOneById($user_id);
        }
        
        $checkForDuplicateItems = true;
        
        if(isset($id))
        {
            $item = $em->getRepository('ZeegaDataBundle:Item')->find($id);
        }
        else if(isset($attributionUri) && $attributionUri != 'default')
        {
            $item = $em->getRepository('ZeegaDataBundle:Item')->findOneBy(array("attribution_uri" => $attributionUri, "enabled" => 1, "user_id" => $user->getId()));
        }
        
        if(!isset($item))
        {
            $item = new Item();
            $item->setDateCreated(new \DateTime("now"));
            $item->setChildItemsCount(0);
            $item->setUser($user);
            $checkForDuplicateItems = false;
        }
        
        $dateUpdated = new \DateTime("now");
        $item->setDateUpdated($dateUpdated);
        
        if(isset($site)) $item->setSite($site); 
        if(isset($title)) $item->setTitle($title);
        if(isset($description)) $item->setDescription($description);
        if(isset($text)) $item->setText($text);
        if(isset($uri)) $item->setUri($uri);
        if(isset($attributionUri)) $item->setAttributionUri($attributionUri);
        if(isset($mediaType)) $item->setMediaType($mediaType);
        if(isset($layerType)) $item->setLayerType($layerType);
        if(isset($thumbnailUrl)) $item->setThumbnailUrl($thumbnailUrl);
        if(isset($mediaGeoLatitude)) $item->setMediaGeoLatitude($mediaGeoLatitude);
        if(isset($mediaGeoLongitude)) $item->setMediaGeoLongitude($mediaGeoLongitude);
        
        if(isset($mediaDateCreated)) 
        {
            $parsedDate = strtotime($mediaDateCreated);
            if($parsedDate)
            {
                $d = date("Y-m-d h:i:s",$parsedDate);
                $item->setMediaDateCreated(new \DateTime($d));
            }
        }

        if(isset($mediaCreatorUsername))
        {
            $item->setMediaCreatorUsername($mediaCreatorUsername);
        }
        else
        {
            $item->setMediaCreatorUsername($user->getUsername());
        }
        if(isset($mediaCreatorRealname))
        {
            $item->setMediaCreatorRealname($mediaCreatorRealname);
        }
        else
        {
            $item->setMediaCreatorRealname($user->getDisplayname());
        }
            
        if(isset($archive)) $item->setArchive($archive);
        if(isset($location)) $item->setLocation($location);
        if(isset($license)) $item->setLicense($license);
        if(isset($attributes)) $item->setAttributes($attributes);
        if(isset($tags)) $item->setTags($tags);
        if(isset($published)) {
            $item->setPublished($published);  
        } else {
            $item->setPublished(false);  
        }
        
        $item->setEnabled(true);
        $item->setIndexed(false);
        
        // new items from the variable "new_items" - used when adding new items to a collection
        $newItems = $request_data->get('new_items');
        $childItems = $request_data->get('child_items');
        
        if(!isset($newItems) && isset($childItems))
        {
            $newItems = $childItems;
        }
        
        if (isset($newItems))
        {
            $first = True;
            foreach($newItems as $newItem)
            {
                if(!is_array($newItem))
                {
                    $childItem = $em->getRepository('ZeegaDataBundle:Item')->find($newItem);

                    if (!$childItem) 
                    {
                        throw $this->createNotFoundException('Unable to find Item entity.');
                    }
                    $childItem->setDateUpdated($dateUpdated);
                    $childItem->setIndexed(false);
                
                    $item->addItem($childItem);

                    if($first == True)
                    {
                        $item->setThumbnailUrl($childItem->getThumbnailUrl());
                        $first = False;
                    }
                }
                else
                {
                    if($checkForDuplicateItems)
                    {
                        $existingItem = $em->getRepository('ZeegaDataBundle:Item')->findOneBy(array("attribution_uri" => $newItem['attribution_uri'], "enabled" => 1, "user_id" => $user->getId()));
                        if(isset($existingItem) && count($existingItem) > 0)
                        {
                            // the item is a duplicate; skip the rest of the current loop iteration and continue execution at the condition evaluation
                            continue;
                        }
                    }
                    
                    $childItem = new Item();
                    
                    $childItem->setSite($site);     
                    $childItem->setTitle($newItem['title']);
                    $childItem->setDescription($newItem['description']);
                    $childItem->setMediaType($newItem['media_type']);
                    $childItem->setDateCreated(new \DateTime("now"));
                    $childItem->setArchive($newItem['archive']);
                    $childItem->setLayerType($newItem['layer_type']);
                    $childItem->setUser($user);
                    $childItem->setUri($newItem['uri']);
                    $childItem->setAttributionUri($newItem['attribution_uri']);
                    $childItem->setThumbnailUrl($newItem['thumbnail_url']);
                    $childItem->setEnabled(true);
                    $childItem->setPublished(true);
                    $childItem->setChildItemsCount(0);
                    $childItem->setMediaCreatorUsername($newItem['media_creator_username']);
                    $childItem->setMediaCreatorRealname($newItem['media_creator_realname']);
                    $childItem->setTags($newItem['tags']);
                    if(isset($newItem['media_geo_latitude'])) $childItem->setMediaGeoLatitude($newItem['media_geo_latitude']);
                    if(isset($newItem['media_geo_longitude'])) $childItem->setMediaGeoLongitude($newItem['media_geo_longitude']);
                    $mediaDateCreated = $newItem['media_date_created'];
                    if(isset($mediaDateCreated)) 
                    {
                        $parsedDate = strtotime($mediaDateCreated);
                        if($parsedDate)
                        {
                            $d = date("Y-m-d h:i:s",$parsedDate);
                            $childItem->setMediaDateCreated(new \DateTime($d));
                        }
                    }
                    $item->addItem($childItem);
                    
                    // persist the child item, get the id and generate a thumbnail
                    $em->persist($childItem);
                    $em->flush();
                    
                    $this->forward('ZeegaCoreBundle:Thumbnails:getItemThumbnail', array("itemId" => $childItem->getId()));
                }
            }
            $item->setChildItemsCount(count($newItems));
        }
        
        return $item;
    }
}
