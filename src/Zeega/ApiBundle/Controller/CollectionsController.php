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
    //  GET api/collections - returns all collections
    public function listAction()
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
    
    //  POST api/collections - creates a new collections
    public function createAction()
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
    
    //  PUT api/collections - add items to a collection
    public function updateAction($items)
    {
        return new Response($item->getId());
    }
    
    /**
     * Finds and displays a Item entity.
     *
     * @Route("/{id}/show", name="newitem_show")
     * @Template()
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('ZeegaIngestBundle:Item')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Item entity.');
        }

        $response = new Response(json_encode($results));
 		$response->headers->set('Content-Type', 'application/json');
        
        // return the results
        return $response;
    }   
    
}