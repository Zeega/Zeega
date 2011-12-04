<?php
//test
namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Zeega\IngestBundle\Entity\Item;

//
//use Doctrine\ORM\EntityRepository;
//use Zeega\UserBundle\Entity\User;
//use Zeega\EditorBundle\Entity\Playground;

class CollectionsController extends Controller
{
    private function populateQueryGlobalParameters($request, $query)
    {
        $query["page"]  = $request->query->get('page');      //  string
		$query["limit"] = $request->query->get('limit');     //  string
		
		//  set defaults for missing parameters  
		if(!isset($query['page']))          $query['page'] = 0;
		if(!isset($query['limit']))         $query['limit'] = 100;
		if($query['limit'] > 100) 	        $query['limit'] = 100;
    }
    
    //  "get_collections"    [GET] /collections
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
        return $response;
    }    

    // "new_collections"    [POST] /api/collections
    public function postCollectionsAction()
    {
        $user = $this->get('security.context')->getToken()->getUser();
        if($user == "anon.")
        {
            $em = $this->getDoctrine()->getEntityManager();
            $user = $em->getRepository('ZeegaUserBundle:User')->find(21);
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
    
    public function postCollectionsItemsAction()
    {
        $user = $this->get('security.context')->getToken()->getUser();
        if($user == "anon.")
        {
            $em = $this->getDoctrine()->getEntityManager();
            $user = $em->getRepository('ZeegaUserBundle:User')->find(21);
        }
        
        $em = $this->getDoctrine()->getEntityManager();
        $request = $this->getRequest();        
        $new_items = $request->request->get('new_items');
        $new_items = explode(",", $new_items);
        
        $collection_item = new Item();
        
        foreach($new_items as $item)
        {
            $child_entity = $em->getRepository('ZeegaIngestBundle:Item')->find($item);

            if (!$child_entity) 
            {
                throw $this->createNotFoundException('Unable to find Item entity.');
            }    
            
            $collection_item->addItem($child_entity);
        }
        $em->persist($collection_item);
        $em->flush();
        return new Response(json_encode($collection_item));
    }
    
    
    // "vote_user_comment"    [PUT] /users/{slug}/comments/{id}/vote
    public function putCollectionsItemsAction($project_id, $items_id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('ZeegaIngestBundle:Item')->find($project_id);
        
        if (!$entity) 
        {
            throw $this->createNotFoundException('Unable to find Collection entity.');
        }

        $items_list = explode(",", $items_id);
        
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
        
        $items_list->setTitle('My new collection');
        $items_list->setType('Collection');
        $items_list->setSource('Collection');
        $items_list->setUser($user);
        $items_list->setUri('collectionurl');
        $items_list->setAttributionUri('zeega.org');
        $items_list->setChildItemsCount(0);
        $items_list->setMediaCreatorUsername($user->getUsername());
        $items_list->setMediaCreatorRealname($user->getDisplayName());

        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($items_list);
        $em->flush();
    }
    
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
}