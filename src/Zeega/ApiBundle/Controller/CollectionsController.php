<?php
namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

use Zeega\DataBundle\Entity\Item;
use Zeega\CoreBundle\Helpers\ItemCustomNormalizer;
use Zeega\CoreBundle\Helpers\ResponseHelper;

class CollectionsController extends Controller
{
    //  get_collections GET    /api/collections.{_format}
    public function getCollectionsAction()
    {
        $query = array();
        
        $request = $this->getRequest();
        //  api global parameters
		$query["page"]  = $request->query->get('page');      //  string
		$query["limit"] = $request->query->get('limit');     //  string
		
		//  collection specific parameters
        $query["contentType"] = 'Collection';   //  string
        $query['returnCollections'] = 1;
        
        //  set defaults for missing parameters  
		if(!isset($query['page']))          $query['page'] = 0;
		if(!isset($query['limit']))         $query['limit'] = 100;
		if($query['limit'] > 100) 	        $query['limit'] = 100;
        
         //  execute the query
 		$queryResults = $this->getDoctrine()
 					        ->getRepository('ZeegaDataBundle:Item')
 					        ->searchItems($query);								

        // populate the results object
        $resultsCount = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->getTotalCollections($query);				
        
		$itemsView = $this->renderView('ZeegaApiBundle:Collections:index.json.twig', array('items' => $queryResults, 'items_count' => $resultsCount));
        return ResponseHelper::compressTwigAndGetJsonResponse($itemsView);
    }    
    
    // get_collection GET    /api/collections/{id}.{_format}
    public function getCollectionAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();
        
        $collection = $em->getRepository('ZeegaDataBundle:Item')->findOneById($id);
        
        $tags = array();
        
        $collectionView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => $collection));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($collectionView);
    }
    
    // get_collection_project GET    /api/collections/{id}/project.{_format}
    public function getCollectionProjectAction($id)
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
         	if($item['type']=='Audio'||$item['type']=='Video'||$item['type']=='Image'){
				$i++;
				
				$frameOrder[]=$i;
				$frames[]=array( "id"=>$i,"sequence_index"=>0,"layers"=>array($i),"attr"=>array("advance"=>0));
				$layers[]=array("id"=>$i,"type"=>$item['source'],"text"=>null,"zindex"=>null,"attr"=>array("title"=>$item['title'],"url"=>$item['uri'],"uri"=>$item['uri'],"thumbnail_url"=>$item['thumbnail_url'],"attribution_url"=>$item['attribution_uri'],"left"=>0,"top"=>0,"height"=>100,"width"=>100,"opacity"=>1,"aspect"=>1.33,"volume"=>50,"in"=>0,"out"=>0));
         	}
         }
         
         $project=array	("id"=>1,"title"=>"Collection","sequences"=>array(array('id'=>1,'frameOrder'=>$frameOrder,"title"=>'none', 'frames'=>$frames,'layers'=>$layers,'attr'=>array("persistLayers"=>array()))));
         return new Response(json_encode(array('project'=>$project)));
         
         
         
    }

    // get_collection_items     GET   /api/collections/{id}/items.{_format}
    public function getCollectionItemsAction($id)
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
        
        // populate the results object
		$resultsCount = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->getTotalItems($query);				
        
        $itemsView = $this->renderView('ZeegaApiBundle:Collections:items.json.twig', array('items' => $queryResults, 'collection_id' => $id, 'items_count' => $resultsCount));
            
        return ResponseHelper::compressTwigAndGetJsonResponse($itemsView);
    }   
    
    // get_item_tags GET    /api/collections/{collectionId}/tags.{_format}
    public function getCollectionTagsAction($collectionId)
    {
        $em = $this->getDoctrine()->getEntityManager();
        
        $collection = $em->getRepository('ZeegaDataBundle:Item')->findOneById($collectionId);

        $tags = $collection->getTags();
        
        $tagsView = $this->renderView('ZeegaApiBundle:Collections:tags.json.twig', 
            array('tags' => $tags, 'collection_id' => $collectionId));
            
        return ResponseHelper::compressTwigAndGetJsonResponse($tagsView);
    }
    
    // post_collections POST   /api/collections.{_format}
    public function postCollectionsAction()
    {
        $user = $this->get('security.context')->getToken()->getUser();
    
        $item = new Item();
        
        $item->setTitle('My new collection');
        $item->setMediaType('Collection');
        $item->setLayerType('Collection');
        $item->setUser($user);
        $item->setUri('collectionurl');
        $item->setAttributionUri('zeega.org');
        $item->setChildItemsCount(0);
        $item->setMediaCreatorUsername($user->getUsername());
        $item->setMediaCreatorRealname($user->getDisplayName());
        
        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($item);
        $em->flush();
        
        $itemView = $this->renderView('ZeegaApiBundle:Collections:show.json.twig', array('item' => $item));
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
    }
    
    // post_collections_items   POST   /api/collections/items.{_format}
    public function postCollectionsItemsAction()
    {
        $em = $this->getDoctrine()->getEntityManager();
        $request = $this->getRequest();
        $request_data = $this->getRequest()->request;        
        
        $new_collection = $this->populateCollectionWithRequestData($request_data);
        
        if (!$new_collection) 
        {
            throw $this->createNotFoundException('Unable to create the collection.');
        }
        $new_collection->setArchive('Zeega');
        
		$new_collection->setEnabled(true);
		$new_collection->setPublished(true);
        
        $em->persist($new_collection);
        $em->flush();

        $tagsView = $this->renderView('ZeegaApiBundle:Collections:show.json.twig', array('item' => $new_collection));
        return ResponseHelper::compressTwigAndGetJsonResponse($tagsView);
    }
    
    // put_collections_items   PUT    /api/collections/{project_id}/items.{_format}
    public function putCollectionsItemsAction($project_id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('ZeegaDataBundle:Item')->find($project_id);

        if (!$entity) 
        {
            throw $this->createNotFoundException('Unable to find Collection entity.');
        }
        
        $items_list = $this->getRequest()->request->get('newItemIDS');

		//Screen item list for duplicates

		$childItems=$entity->getChildItems();
		foreach($childItems as $childItem){
			$existing_items[]=$childItem->getId();
		}
		if(isset($existing_items))
			$items_list=array_diff($items_list,$existing_items);

        // this is terrible...
        foreach($items_list as $item)
        {
            $child_entity = $em->getRepository('ZeegaDataBundle:Item')->find($item);

            if (!$child_entity) 
            {
                throw $this->createNotFoundException('Unable to find Item entity.');
            }    
            
            $entity->addItem($child_entity);            
        }
        $count=$entity->getChildItemsCount() + count($items_list);
        $entity->setChildItemsCount($count);
        
        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($entity);
        $em->flush();
        
        $itemView = $this->renderView('ZeegaApiBundle:Collections:show.json.twig', array('item' => $entity));
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);       
    }

    // put_collections_items   PUT    /api/collections/{project_id}/items.{_format}
    public function putCollectionsAction($collection_id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $request = $this->getRequest();
        $request_data = $this->getRequest()->request;        
        
        $collection = $this->populateCollectionWithRequestData($request_data, $em);

        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($collection);
        $em->flush();
        
        $itemView = $this->renderView('ZeegaApiBundle:Collections:show.json.twig', array('item' => $collection));
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);       
    }
   
   	// delete_collection    DELETE /api/collections/{collection_id}.{_format}
    public function deleteCollectionAction($collection_id)
    {
    	$em = $this->getDoctrine()->getEntityManager();
     	$collection = $em->getRepository('ZeegaDataBundle:Item')->find($collection_id);

     	if (!$collection) 
        {
            throw $this->createNotFoundException('Unable to find a Collection with the id ' . $collection_id);
        }
        
    	$collection->setEnabled(false);

    	$em->flush();

    	$itemView = $this->renderView('ZeegaApiBundle:Collections:delete.json.twig', array('item_id' => $collection_id, 'status' => "Success"));
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);  
    }
    
    public function deleteCollectionItemAction($collection_id, $item_id)
    {
    	$em = $this->getDoctrine()->getEntityManager();
     	$collection = $em->getRepository('ZeegaDataBundle:Item')->findBy(array("id"=>$collection_id,"enabled"=>1));
     	$item = $em->getRepository('ZeegaDataBundle:Item')->findBy(array("id"=>$item_id,"enabled"=>1));
     	
     	if (!$collection) 
        {
            throw $this->createNotFoundException("The collection $collection_id does not exist");
        }
        
        if (!$item) 
        {
            throw $this->createNotFoundException("The item $item_id does not exist");
        }
        
        $collection->getChildItems()->removeElement($item);
        $collection->setChildItemsCount($collection->getChildItems()->count());

        $em->flush();
        
        $itemView = $this->renderView('ZeegaApiBundle:Collections:show.json.twig', array('item' => $collection));
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);              
    }
   
    // Private methods 
    
    private function populateCollectionWithRequestData($request_data)
    {    
        $user = $this->get('security.context')->getToken()->getUser();
        $em = $this->getDoctrine()->getEntityManager();
        
        if (!$request_data) 
            throw $this->createNotFoundException('Collection object is not defined.');
        
        $collection_id = $request_data->get('id');
        $description = $request_data->get('description');
        $text = $request_data->get('text');
        $attribution_url = $request_data->get('attribution_uri');
        $thumbnail_url = $request_data->get('thumbnail_url');
        $title = $request_data->get('title');
        $new_items = $request_data->get('newItemIDS');
        
        $collection = new Item();
        if(isset($collection_id))
        {
            $collection = $em->getRepository('ZeegaDataBundle:Item')->find($collection_id);
            // if(!$collection) throw error - something went wrong
        }

        $collection->setMediaType('Collection');
        $collection->setLayerType('Collection');
        $collection->setUri('http://zeega.org');
        $collection->setDescription($description);
        $collection->setText($text);
        
        if(isset($attribution_url))
            $collection->setAttributionUri($attribution_url);
        else
            $collection->setAttributionUri("http://zeega.org");
            
        $collection->setThumbnailUrl($thumbnail_url);
        $collection->setUser($user);
        if(!isset($collection_id))
            $collection->setChildItemsCount(0);
        $collection->setMediaCreatorUsername($user->getUsername());
        $collection->setMediaCreatorRealname($user->getDisplayName());
        $collection->setTitle($title);
        
        $session = $this->getRequest()->getSession();
        $site = $session->get('site');
        if(!isset($site))
        {
            $sites = $user->getSites();
    		$site = $sites[0];
		}
        
		$collection->setSite($site);
        
        if (isset($new_items) && !isset($collection_id))
        {
            $collection->setChildItemsCount(count($new_items));
            $first = True;
            foreach($new_items as $item)
            {
                
                $child_entity = $em->getRepository('ZeegaDataBundle:Item')->find($item);

                if (!$child_entity) 
                {
                    throw $this->createNotFoundException('Unable to find Item entity.');
                }    

                $collection->addItem($child_entity);
                if($first == True)
                {
                    $collection->setThumbnailUrl($child_entity->getThumbnailUrl());
                    $first = False;
                }
            }
        }
        
        return $collection;
    }
}
