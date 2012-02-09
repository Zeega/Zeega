<?php

namespace Zeega\ApiBundle\Controller;
use Zeega\UserBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Zeega\ApiBundle\Helpers\ResponseHelper;

use DateTime;

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
	    //return new Response(var_dump($request))''
		$query = array();

		//  api global parameters
		$query["page"]  = $request->query->get('page');      //  string
		$query["limit"] = $request->query->get('limit');     //  string
        		
		//  search specific parameters
		$query["userId"]        = $request->query->get('user');      //  int
		$query["playgroundId"]  = $request->query->get('playground'); //  int
		$query["queryString"]   = $request->query->get('q');         //  string
		$query["contentType"]   = $request->query->get('content');   //  string
		$query["collection_id"]  = $request->query->get('collection');//  string
		$query["tags"]          = $request->query->get('tags');      //  string
		$query["tagsName"]   = $request->query->get('tags_name');      //  string
		$query["dateIntervals"] = $request->query->get('dtintervals');     //  string
		
		
		//Match tag type searches
		
		if(preg_match('/tag\:(.*)/', $query["queryString"] , $matches)){
			$query["queryString"] =NULL;
			$query["tagsName"]=$matches[1];
		}
		
	
		
		
		
		$query["geo"] = array();
		$query["geo"]["north"] = $request->query->get('geo_n');
		$query["geo"]["south"] = $request->query->get('geo_s');
		$query["geo"]["east"] = $request->query->get('geo_e');
		$query["geo"]["west"] = $request->query->get('geo_w');
		
        $earliestDate = $request->query->get('dtstart');
        $latestDate = $request->query->get('dtend');
        
        if(isset($earliestDate))
        {
            $query["earliestDate"] = new DateTime();
            $query["earliestDate"]->setTimestamp($earliestDate);
        }
        
        if(isset($latestDate))
        {
            $query["latestDate"] = new DateTime();
            $query["latestDate"]->setTimestamp($latestDate);;
        }
    	
		//  return types
		$query["returnMap"]     = $request->query->get('r_map');    				//  bool
		$query["returnTime"]    = $request->query->get('r_time');   				//  bool
		$query["returnItems"]   = $request->query->get('r_items');   				//  bool
		$query["returnItems"]   = $request->query->get('r_items');   				//  bool
		$query["returnCollections"]   = $request->query->get('r_collections');   	//  bool
		$query["returnCollectionsWithItems"] = $request->query->get('r_itemswithcollections'); //  bool

		//  set defaults for missing parameters  
		if(!isset($query['returnCollections']))     		$query['returnCollections'] = 0;		
		if(!isset($query['returnItems']))           		$query['returnItems'] = 1;
		if(!isset($query['returnTime']))           			$query['returnTime'] = 0;
		if(!isset($query['returnMap']))             		$query['returnMap'] = 0;
		if(!isset($query['returnCollectionsWithItems'])) 	$query['returnCollectionsWithItems'] = 1;
		if(!isset($query['page']))                  		$query['page'] = 0;
		if(!isset($query['limit']))                 		$query['limit'] = 100;
		if($query['limit'] > 100) 	                		$query['limit'] = 100;
	    
	    if( !isset($query["geo"]["north"]) || !isset($query["geo"]["south"]) ||
	        !isset($query["geo"]["east"]) || !isset($query["geo"]["west"]))
	    {
		    $query["geo"] = null;
		}
        
		if(isset($query["contentType"]) && strtoupper($query["contentType"]) == "ALL") $query["contentType"] = null;
	   
	   	if(isset($query["tagsName"]))
	   	{
	   	
			$query["tagsName"] = array_map('trim',explode(",",$query["tagsName"] ));
	   	}
	   
	    //  filter results for the logged user
		if(isset($query['userId']) && $query['userId'] == -1) $query['userId'] = $user->getId();
		
		// prepare an array for the results
        $results = array();
		
		// regular search - return items and/or collections
		if($query['returnCollections'] || $query['returnItems'] || $query['returnCollectionsWithItems'])
		{
		    $queryResults = $this->getDoctrine()->getRepository('ZeegaIngestBundle:Item')->searchItems($query);
			
			
			if($query['returnCollectionsWithItems'])
			{
				// return collections mixed with items
				 $results['items_and_collections'] = $queryResults;
				 $results['returned_items_and_collections_count'] = sizeof($queryResults);
	             $results['items_and_collections_count'] = $this->getDoctrine()->getRepository('ZeegaIngestBundle:Item')->getTotalItemsAndCollections($query);
			}
			
			if($query['returnCollections'] || $query['returnItems'])
			{
		    	$items = array();
	            $collections = array();
            
	            // separate items from collections - this is O(n) and won't scale well for huge collections
			    foreach ($queryResults as $res)
	            {
	                if ((strtoupper($res["type"]) == "COLLECTION"))
	                    array_push($collections, $res);
	                else
	                    array_push($items, $res);
	            }
           
	            // populate the results object
	            if($query['returnItems'] == 1)
	            {
	                $results['items'] = $items;
					$results['returned_items_count'] = sizeof($items);
	                $results['items_count'] = $this->getDoctrine()->getRepository('ZeegaIngestBundle:Item')->getTotalItems($query);
	            }

	            if($query['returnCollections'] == 1)
	            {
	                $results['collections'] = $collections;
					$results['returned_collections_count'] = sizeof($collections);
	                $results['collections_count'] = $this->getDoctrine()->getRepository('ZeegaIngestBundle:Item')->getTotalCollections($query);
           	}
			}
	    }
		
		if($query['returnTime'])
		{
		    $queryResults = $this->getDoctrine()->getRepository('ZeegaIngestBundle:Item')->searchItemsByTimeDistribution($query);
		    $results['time_distribution'] = $queryResults["results"];
		    $results['time_distribution_info'] = array("min_date" => $queryResults["min_date"], 
													   "max_date" => $queryResults["max_date"], "time_intervals" => sizeof($queryResults["results"]));
	    }
		
		// create and configure the response type
        // TO-DO: multiple response types (xml, etc)

		$response = ResponseHelper::getJsonResponse($results);
        
        // return the results
        return $response;
        
        //DEV HELPERS
        //return $qb->getQuery()->getSQL();
        //return $this->render('ZeegaApiBundle:Default:index.html.twig', array('results' => json_encode($results)));        
		// IF ERROR return new Response(json_encode($results[0]));
		//else return new Response("Error: Query is not correctly formatted2");
    }
}
