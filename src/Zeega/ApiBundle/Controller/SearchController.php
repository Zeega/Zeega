<?php

namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class SearchController extends Controller
{
    public function indexAction($name)
    {
        
        return $this->render('ZeegaApiBundle:Default:index.html.twig', $this->getRequest());
    }
    
    public function searchAction()
    {
        $user = $this->get('security.context')->getToken()->getUser();
        if($user == "anon.")
        {
            $em = $this->getDoctrine()->getEntityManager();
            $user = $em->getRepository('ZeegaUserBundle:User')->find(1);
        }
        
	    $request = $this->getRequest();
	    
		$query = array();

		//  api global parameters
		$query["page"]  = $request->query->get('page');      //  string
		$query["limit"] = $request->query->get('limit');     //  string
        		
		//  search specific parameters
		$query["userId"]        = $request->query->get('user');      //  int    
		$query["queryString"]   = $request->query->get('q');         //  string
		$query["contentType"]   = $request->query->get('content');   //  string
		$query["collectionId"]  = $request->query->get('collection');//  string         

		//  return types
		$query["returnMap"]     = $request->query->get('r_map');     //  bool
		$query["returnTime"]    = $request->query->get('r_time');    //  bool
		$query["returnItems"]   = $request->query->get('r_items');   //  bool
		$query["returnCollections"]   = $request->query->get('r_collections');   //  bool

		//  set defaults for missing parameters  
		if(!isset($query['returnCollections']))   $query['returnCollections'] = 1;		
		if(!isset($query['returnItems']))   $query['returnItems'] = 1;
		if(!isset($query['returnTime']))    $query['returnTime'] = 0;
		if(!isset($query['returnMap']))     $query['returnMap'] = 0;
		if(!isset($query['page']))          $query['page'] = 0;
		if(!isset($query['limit']))         $query['limit'] = 100;
		if($query['limit'] > 100) 	        $query['limit'] = 100;
	
		if(isset($query['userId']) && $query['userId'] == -1) $query['userId'] = $user->getId();
				
        //  execute the query
		$queryResults = $this->getDoctrine()
					        ->getRepository('ZeegaIngestBundle:Item')
					        ->searchItems($query);								
		
		$results[]=array('items'=>$queryResults,'count'=>sizeof($queryResults));
/*		
                        	$response = new Response(json_encode($results));
                    		$response->headers->set('Content-Type', 'application/json');

                            // return the results
                            return $response;
*/
        // separate query results by type - this is O(n) and won't scale well for huge collections
        $items = array();
        $collections = array();

        foreach ($queryResults as $res)
        {
            if ((strtoupper($res["type"]) == "COLLECTION"))
            { 
                $res["item_count"] = rand(0, 15);
                array_push($collections, $res);
            }
            else
                array_push($items, $res);
        }
        
        // populate the results object
        $results = array();
        
        if($query['returnItems'] == 1)
        {
            $results['items'] = $items;
            $results['items_count'] = sizeof($items);
        }
        
        if($query['returnCollections'] == 1)
        {
            $results['collections'] = $collections;
            $results['collections_count'] = sizeof($collections);
        }
        
        // create and configure the response type
        // TO-DO: multiple response types (xml, etc)
		$response = new Response(json_encode($results));
		$response->headers->set('Content-Type', 'application/json');
        
        // return the results
        return $response;
        
        //DEV HELPERS
        //return $qb->getQuery()->getSQL();
        //return $this->render('ZeegaApiBundle:Default:index.html.twig', array('results' => json_encode($results)));        
		// IF ERROR return new Response(json_encode($results[0]));
		//else return new Response("Error: Query is not correctly formatted2");
    }
}
