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
        
        $item = new Item();
        
        $item->setTitle('My new collection');
        $item->setContentType('Collection');
        $item->setUser($user);
        $item->setItemUrl('collectionurl');
        $item->setItemUri('collectionurl');
        $item->setAttributionUrl('zeega.org');
        $item->setArchive('Collections');
        
        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($item);
        $em->flush();

        return new Response($item->getId());
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
        
        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($entity);
        $em->flush();

    }
    
    
    public function getCollectionAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('ZeegaIngestBundle:Item')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Item entity.');
        }

        $results[] = array('items'=>$entity);
        $response = new Response(json_encode($results));
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