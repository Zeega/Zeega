<?php
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
		
		$query = array();
		if(!isset($page))                   $query['page'] = 0;
		if(!isset($limit))                  $query['limit'] = 100;
		if(isset($content))                 $query['content'] = $content;
		if(isset($excludeContent))          $query['exclude_content'] = $excludeContent;
		if(isset($site))                    $query['site'] = $site;
		
        if(isset($user))
        {
            if($user == -1) 
    		{
    			$user = $this->get('security.context')->getToken()->getUser();
    			$query['user'] = $user->getId();
    		}
            else
            {
                $query['user'] = $user->getId();
            }
        }
         //  execute the query
 		$queryResults = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findItems($query,false);								
        /*
        $logger = $this->get('logger');
        $logger->err(implode(",",$queryResults->getParameters()));
        $logger->err($queryResults->getSQL());
        */
        //return null;
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
        $itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => $item, 'user' => $user, 'userIsAdmin' => $userIsAdmin));
        
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
		if($query['limit'] > 100) 	        $query['limit'] = 100;
        
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
    
    // get_item_tags GET    /api/collections/{collectionId}/tags.{_format}
    public function getItemTagsAction($itemId)
    {
        $em = $this->getDoctrine()->getEntityManager();
        
        $item = $em->getRepository('ZeegaDataBundle:Item')->findOneById($itemId);

        $tags = $collection->getTags();
        
        $tagsView = $this->renderView('ZeegaApiBundle:Collections:tags.json.twig', 
            array('tags' => $tags, 'item_id' => $itemId));
            
        return ResponseHelper::compressTwigAndGetJsonResponse($tagsView);
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

        $query["collection_id"] = $id;
        $query["page"] = $request->query->get('page'); // string
        $query["limit"] = $request->query->get('limit'); // string

        // set defaults for missing parameters
        if(!isset($query['page'])) $query['page'] = 0;
        if(!isset($query['limit'])) $query['limit'] = 100;
        if($query['limit'] > 100) $query['limit'] = 100;

        $queryResults = $this->getDoctrine()
        ->getRepository('ZeegaDataBundle:Item')
        ->searchCollectionItems($query);	

        // populate the results object
        $resultsCount = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->getTotalItems($query);	

        $itemsView = $this->renderView('ZeegaApiBundle:Items:items.json.twig', array('items' => $queryResults, 'collection_id' => $id, 'items_count' => $resultsCount));

        return ResponseHelper::compressTwigAndGetJsonResponse($itemsView);
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
		
    		// parse the url with the ExtensionsBundle\Parser\ParserService
    		$response = $parser->load($url, $loadChildren);

    		$itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => $response["items"], 'request' => $response["details"]));
	    }
        
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
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
        $dateUpdated = new \DateTime("now");
        $dateUpdated->add(new \DateInterval('PT2M'));
        $item->setDateUpdated($dateUpdated);

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
	    //return $item;

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
                $dateUpdated = new \DateTime("now");
		        $dateUpdated->add(new \DateInterval('PT2M'));
                
                $item->setDateUpdated($dateUpdated);
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
				$dateUpdated = new \DateTime("now");
		        $dateUpdated->add(new \DateInterval('PT2M'));
				
				$item->setDateUpdated($dateUpdated);
		
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
			}
			
	
			$em->persist($item);
			$em->flush();
        	
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
		
			    $dateUpdated = new \DateTime("now");
		        $dateUpdated->add(new \DateInterval('PT2M'));
			    $item->setDateUpdated($dateUpdated);
        
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
		if($query['limit'] > 100) 	        $query['limit'] = 100;

        $queryResults = $this->getDoctrine()
         					 ->getRepository('ZeegaDataBundle:Item')
         					 ->searchCollectionItems($query);
         
         $i=1;
         $frameOrder=array();
         $frames=array();
         $layers=array();
         foreach($queryResults as $item){
         	if($item['media_type']!='Collection' )
         	{
				$i++;
				
				$frameOrder[]=$i;
				$frames[]=array( "id"=>$i,"sequence_index"=>0,"layers"=>array($i),"attr"=>array("advance"=>0));
				$layers[]=array("id"=>$i,"type"=>$item['layer_type'],"text"=>$item['text'],"attr"=>array("description"=>$item['description'],"title"=>$item['title'],"url"=>$item['uri'],"uri"=>$item['uri'],"thumbnail_url"=>$item['thumbnail_url'],"attribution_uri"=>$item['attribution_uri']));
         	}
         }
         
         $project = array("id"=>1,
                          "title"=>"Collection",
                          "estimated_time"=>"Some time", 
                          "sequences"=>array(array('id'=>1,'frames'=>$frameOrder,"title"=>'none', 'attr'=>array("persistLayers"=>array()))),
                          'frames'=>$frames,
                          'layers'=>$layers
                          );
         return new Response(json_encode(array('project'=>$project)));
    }
    
   
    // Private methods     
    private function populateItemWithRequestData($request_data)
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
        $newItems = $request_data->get('new_items');
        $tags = $request_data->get('tags');
		$published = $request_data->get('published');
        
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
		    	if(isset($sites))
		    	{
	    			$site = $sites[0];
	    		}
			}
		}
		
        $item = new Item();

        if(isset($id))
        {
            $item = $em->getRepository('ZeegaDataBundle:Item')->find($id);
        }
        else
        {
            $item->setDateCreated(new \DateTime("now"));
            $item->setChildItemsCount(0);
            $item->setUser($user);
        }
        
        $dateUpdated = new \DateTime("now");
        $dateUpdated->add(new \DateInterval('PT2M'));
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
		if(isset($published)) $item->setPublished($published);
        
        $item->setEnabled(true);
        $item->setIndexed(false);
        
        $dateUpdated = new \DateTime("now");
		$dateUpdated->add(new \DateInterval('PT2M'));    
        
        if (isset($newItems))
        {
            $item->setChildItemsCount(count($newItems));
            $first = True;
            foreach($newItems as $newItem)
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
        }
        
        return $item;
    }
}
