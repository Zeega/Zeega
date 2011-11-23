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

		//  set defaults for missing parameters  
		if(!isset($query['page']))          $query['page'] = 0;
		if(!isset($query['limit']))         $query['limit'] = 100;
		if($query['limit'] > 100) 	        $query['limit'] = 100;
	
		if(isset($query['userId']) && $query['userId'] == -1) $query['userId'] = $user->getId();
				
        //  execute the query
		$queryResults = $this->getDoctrine()
					        ->getRepository('ZeegaIngestBundle:Item')
					        ->searchItems($query);								

        // objects to return
        $items = array();
        $collections = array();

        foreach ($queryResults as $res)
        {
            if (isset($res["content_type"]) and (strtoupper($res["content_type"]) == "COLLECTION")) 
                array_push($collections, $res);
            else
                array_push($items, $res);
        }
        
        $results[] = array( 'items'=>$items,'items_count'=>sizeof($items), 
                            'collections'=>$collections, 'collections_count'=>sizeof($collections));

		$response = new Response(json_encode($results));
		$response->headers->set('Content-Type', 'application/json');
        
        return $response;
        
        //return $qb->getQuery()->getSQL();
        //return $this->render('ZeegaApiBundle:Default:index.html.twig', array('results' => json_encode($results)));        
		// IF ERROR return new Response(json_encode($results[0]));
		//else return new Response("Error: Query is not correctly formatted2");
    }
}
