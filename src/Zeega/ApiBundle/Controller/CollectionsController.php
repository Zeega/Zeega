<?php
namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

use Zeega\IngestBundle\Entity\Item;
use Zeega\ApiBundle\Helpers\ItemCustomNormalizer;

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
 					        ->getRepository('ZeegaIngestBundle:Item')
 					        ->searchItems($query);								

        // populate the results object
        $results[] = array('collections'=>$queryResults, 'collections_count'=>sizeof($queryResults));

 		$response = new Response(json_encode($results));
 		$response->headers->set('Content-Type', 'application/json');
        return $response;
    }    
    
    // get_collection GET    /api/collections/{id}.{_format}
    public function getCollectionAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $queryResults = $this->getDoctrine()
         					 ->getRepository('ZeegaIngestBundle:Item')
         					 ->searchCollectionById($id);

        $response = new Response(json_encode($queryResults));
 		$response->headers->set('Content-Type', 'application/json');
        
        // return the results
        return $response;
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
         					 ->getRepository('ZeegaIngestBundle:Item')
         					 ->searchCollectionItems($query);								
        
        // populate the results object
        $results[] = array('items'=>$queryResults, 'items_count'=>sizeof($queryResults));
        
  		$response = new Response(json_encode($results));
  		$response->headers->set('Content-Type', 'application/json');

        // return the results
        return $response;
    }   
        
    // post_collections POST   /api/collections.{_format}
    public function postCollectionsAction()
    {
        $user = $this->get('security.context')->getToken()->getUser();
        if($user == "anon.")
        {
            $em = $this->getDoctrine()->getEntityManager();
            $user = $em->getRepository('ZeegaUserBundle:User')->find(1);
        }
            
        $item = new Item();
        
        $item->setTitle('My new collection');
        $item->setType('Collection');
        $item->setSource('Collection');
        $item->setUser($user);
        $item->setUri('collectionurl');
        $item->setAttributionUri('zeega.org');
        $item->setChildItemsCount(0);
        $item->setMediaCreatorUsername($user->getUsername());
        $item->setMediaCreatorRealname($user->getDisplayName());
        
        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($item);
        $em->flush();
        
        $serializer = new Serializer(array(new ItemCustomNormalizer()),array('json' => new JsonEncoder()));
        $json = $serializer->serialize($item, 'json');
        
        $response = new Response($json);
        $response->headers->set('Content-Type', 'application/json');
        return $response;
        //$json = $serializer->serialize($item, 'json');
        //return new Response(json_encode($item));
        
        //return new Response($item->getId());
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
        
        $em->persist($new_collection);
        $em->flush();
        
        $serializer = new Serializer(array(new ItemCustomNormalizer()),array('json' => new JsonEncoder()));
        $json = $serializer->serialize($new_collection, 'json');
        
        $response = new Response($json);
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }
    
    // put_collections_items   PUT    /api/collections/{project_id}/items.{_format}
    public function putCollectionsItemsAction($project_id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('ZeegaIngestBundle:Item')->find($project_id);

        if (!$entity) 
        {
            throw $this->createNotFoundException('Unable to find Collection entity.');
        }
        $items_list = $this->getRequest()->request->get('newItemIDS');
        
        // this is terrible...
        foreach($items_list as $item)
        {
            
            
            $child_entity = $em->getRepository('ZeegaIngestBundle:Item')->find($item);

            if (!$child_entity) 
            {
                throw $this->createNotFoundException('Unable to find Item entity.');
            }    
            
            $entity->addItem($child_entity);            
        }
        
        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($entity);
        $em->flush();
        
        $serializer = new Serializer(array(new ItemCustomNormalizer()),array('json' => new JsonEncoder()));
        $json = $serializer->serialize($entity, 'json');
        
        $response = new Response($json);
        $response->headers->set('Content-Type', 'application/json');
        return $response;
       
    }
   
   	// delete_collection    DELETE /api/collections/{collection_id}.{_format}
    public function deleteCollectionAction($collection_id)
    {
    	$em = $this->getDoctrine()->getEntityManager();
     	$collection = $em->getRepository('ZeegaIngestBundle:Item')->find($collection_id);
     	
     	if (!$collection) 
        {
            throw $this->createNotFoundException('Unable to find a Collection with the id ' . $collection_id);
        }
        
    	$em->remove($collection);
    	$em->flush();
    	
    	return new Response('SUCCESS',200);
    }
   
    // Private methods 
    
    private function populateCollectionWithRequestData($request_data)
    {    
        $user = $this->get('security.context')->getToken()->getUser();
        if($user == "anon.")
        {
            $em = $this->getDoctrine()->getEntityManager();
            $user = $em->getRepository('ZeegaUserBundle:User')->find(1);
        }
        
        if (!$request_data) 
            throw $this->createNotFoundException('Collection object is not defined.');
        
        $title = $request_data->get('title');
        $new_items = $request_data->get('newItemIDS');
        
        $collection = new Item();
        $collection->setType('Collection');
        $collection->setSource('Collection');
        $collection->setUri('http://zeega.org');
        $collection->setAttributionUri("http://zeega.org");
        $collection->setUser($user);
        $collection->setChildItemsCount(0);
        $collection->setMediaCreatorUsername($user->getUsername());
        $collection->setMediaCreatorRealname($user->getDisplayName());
        $collection->setTitle($title);
        
        if (isset($new_items))
        {
            $collection->setChildItemsCount(count($new_items));
            $first = True;
            foreach($new_items as $item)
            {
                
                $child_entity = $em->getRepository('ZeegaIngestBundle:Item')->find($item);

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
