<?php
namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Zeega\IngestBundle\Entity\Item;

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
        
        // return the results
        //return $response;
        return $this->render('ZeegaApiBundle:Collection:index.json.twig', array('name' => $response));
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

        return new Response($item->getId());
    }
    
    // post_collections_items   POST   /api/collections/items.{_format}
    public function postCollectionsItemsAction()
    {
        $em = $this->getDoctrine()->getEntityManager();
        $request_data = $this->getRequest()->request;        
        
        $new_collection = $this->populateCollectionWithRequestData($request_data);
        
        if (!$new_collection) 
        {
            throw $this->createNotFoundException('Unable to create the collection.');
        }
        
        $em->persist($new_collection);
        $em->flush();
        
        return new Response(json_encode($new_collection));
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
        
        return new Response($entity->getId());
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
        
        $logger = $this->get('logger');
        $logger->info("REQUEST DATA BELOW");
        $logger->info(json_encode($this->getRequest()));
            
        if (!isset($title)) 
            throw $this->createNotFoundException('Collection title is not defined.');

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
            foreach($new_items as $item)
            {
                $child_entity = $em->getRepository('ZeegaIngestBundle:Item')->find($item);

                if (!$child_entity) 
                {
                    throw $this->createNotFoundException('Unable to find Item entity.');
                }    

                $collection->addItem($child_entity);
            }
        }
        
        return $collection;
    }
}