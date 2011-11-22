<?php

namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


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
		if(!isset($query['contentType']))   $query['contentType'] = 'all';
		if(!isset($query['page']))          $query['page'] = 0;
		if(!isset($query['limit']))         $query['limit'] = 100;
		if(!isset($query['userId']) || $query['userId'] == -1) $query['userId'] = $user->getId();
				
        //  execute the query
		$items =$this->getDoctrine()
					 ->getRepository('ZeegaIngestBundle:Item')
					 ->searchItems($query);								

		$results[] = array('items'=>$items,'count'=>sizeof($items));

        return $this->render('ZeegaApiBundle:Default:index.html.twig', array('results' => json_encode($results)));        
		// IF ERROR return new Response(json_encode($results[0]));
		//else return new Response("Error: Query is not correctly formatted2");
    }
}
