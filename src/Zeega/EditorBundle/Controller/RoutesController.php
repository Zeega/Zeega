<?php

namespace Zeega\EditorBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\EditorBundle\Entity\Node;
use Zeega\EditorBundle\Entity\Layer;
use Zeega\EditorBundle\Entity\Route;
use Zeega\UserBundle\Entity\User;

class RoutesController extends Controller
{
    
      public function getRoutesAction()
    {

    /*
    	$route= new Route();
    	
    	
    	$route->setTitle('Untitled');
		$em=$this->getDoctrine()->getEntityManager();
		$em->persist($route);
		$em->flush();
    	return new Response(json_encode($this->getDoctrine()
        ->getRepository('ZeegaEditorBundle:Route')
        ->findRouteById($route->getId())));
       */
    
    
    
    } // `get_routes`    [GET] /routes



    public function postRoutesAction()
    {
    
    	$em=$this->getDoctrine()->getEntityManager();
		$request = $this->getRequest();


		//$title=$request->request->get('title');
		$route= new Route();
		$request = $this->getRequest();
    	if($request->request->get('title')) $route->setTitle($request->request->get('title'));
    	else $route->setTitle('Untitled: '.date('l F j, Y h:i:s A'));
    	$em->persist($route);
    	$em->flush();
		$output=$this->getDoctrine()
			->getRepository('ZeegaEditorBundle:Node')
			->findRouteById($route->getId());
			return new Response(json_encode($output[0]));
        
    } // `post_routes`   [POST] /routes


    public function getRouteAction($route_id)
    {
    	$routes=$this->getDoctrine()
        ->getRepository('ZeegaEditorBundle:Route')
        ->findRouteById($route_id);
    	return new Response(json_encode($routes[0]));
        
    
    } // `get_route`     [GET] /routes/{route_id}



    public function putRouteAction($route_id)
    {
    	$request = $this->getRequest();
      	$em = $this->getDoctrine()->getEntityManager();
     	$route= $em->getRepository('ZeegaEditorBundle:Route')->find($route_id);
    	if($request->request->get('title'))$route->setTitle($request->request->get('title'));
		$em->flush();
		
		if($request->request->get('nodesOrder')){

		$nodes=$request->request->get('nodesOrder');

		$i=0;
		$s=count($nodes);
		foreach($nodes as $nodeId){
			
			$node=$em->getRepository('ZeegaEditorBundle:Node')
        		->find($nodeId);
        		
        		
        	$node->setRouteIndex($i);
        	$em->persist($node);
			$i++;
		}
		
		$em->flush();
		
		}
		
    	return new Response('SUCCESS',200);
    } // `put_route`     [PUT] /routes/{route_id}



    public function deleteRouteAction($route_id)
    {
    
    	$em = $this->getDoctrine()->getEntityManager();
     	$route= $em->getRepository('ZeegaEditorBundle:Route')->find($route_id);
    	$em->remove($route);
    	$em->flush();
    	return new Response('SUCCESS',200);
    
    
    } // `delete_route`  [DELETE] /routes/{route_id}

    public function getRouteNodesAction($route_id)
    {
    		
    		return new Response(json_encode($this->getDoctrine()
        				->getRepository('ZeegaEditorBundle:Node')
        				->findNodesByRouteId($route_id)));
    
    } // `get_route_nodes`    [GET] /routes/{route_id}/Nodes


    public function postRouteNodesAction($route_id)
    {
    	
		
		
		$em=$this->getDoctrine()->getEntityManager();
		$request = $this->getRequest();
		$route= $em->getRepository('ZeegaEditorBundle:Route')->find($route_id);
		
    	
		$node= new Node();
		$node->setRoute($route);
		if($request->request->get('thumb_url')){
		$node->setThumbUrl($request->request->get('thumb_url'));
		
		}
		if($request->request->get('link_right')){
        $linkRight=$this->getDoctrine()
        		->getRepository('ZeegaEditorBundle:Node')
        		->findById($request->request->get('link_right'));
    	$node->setLinkRight($linkRight);
    	
    	}
    	if($request->request->get('link_left')){
    	$linkLeft=$this->getDoctrine()
        		->getRepository('ZeegaEditorBundle:Node')
        		->findById($request->request->get('link_left'));

    	
    	$node->setLinkLeft($linkLeft);
    	}
    	
    	
		$em=$this->getDoctrine()->getEntityManager();
		$em->persist($node);
		$em->flush();
		$output=$this->getDoctrine()
        ->getRepository('ZeegaEditorBundle:Node')
        ->findNodeById($node->getId());
        
    	return new Response(json_encode($output[0]));
   

    
    
    } // `post_route_nodes`   [POST] /routes/{route_id}/nodes



/** `get_route_layers`    [GET] /routes/{route_id}/layers */

    public function getRouteLayersAction($route_id)
    {
    	$output=array();
    	$route=$this->getDoctrine()
        				->getRepository('ZeegaEditorBundle:Route')
        				->find($route_id);
        				
        if($route){
        
        	$layers=$route->getLayers()->toArray();
        	foreach($layers as $layer){
        	
        	$l=$this->getDoctrine()
        				->getRepository('ZeegaEditorBundle:Layer')
        				->findLayerById($layer->getId());
        	$output[]=$l[0];
        	}
        
        }
        
		return new Response(json_encode($output));
	}

	  public function postRouteLayersAction($route_id)
    {
    	$em = $this->getDoctrine()->getEntityManager();
     	$route= $em->getRepository('ZeegaEditorBundle:Route')->find($route_id);
    	
    	$layer= new Layer();
    	
		$request = $this->getRequest();
    	
    	$route->addLayers($layer);
    	
    	
    	
    	if($request->request->get('item_id')){
    		$layer->setItemUri($this->getDoctrine()
			->getRepository('ZeegaItemBundle:Item')
			->findItemById($request->request->get('item_id'))->getUrl());
			$layer->setItem($this->getDoctrine()
			->getRepository('ZeegaItemBundle:Item')
			->find($request->request->get('item_id')));
			
		}
		
		if($request->request->get('type')) $layer->setType($request->request->get('type'));   	
    	
    	if($request->request->get('text')) $layer->setText($request->request->get('text'));
    	
    	if($request->request->get('zIndex')) $layer->setZIndex($request->request->get('zIndex'));

		if($request->request->get('attr')) $layer->setAttr($request->request->get('attr'));
    	
    	
		$em->persist($layer);
		$em->persist($route);
		$em->flush();
    	$output=$this->getDoctrine()
        ->getRepository('ZeegaEditorBundle:Layer')
        ->findLayerById($layer->getId());
        
        
    	return new Response(json_encode($output[0]));
    
    
    
    } // `post_route_layers`   [POST] /routes/{route_id}/layers

	
	

}
