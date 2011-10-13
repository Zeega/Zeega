<?php

namespace Zeega\EditorBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\EditorBundle\Entity\Node;
use Zeega\EditorBundle\Entity\Layer;
use Zeega\UserBundle\Entity\User;


class NodesController extends Controller
{
    
     public function getNodesAction()
    {
    

    
    } // `get_nodes`    [GET] /nodes



    public function postNodesAction()
    {
    
    
    	
        
    } // `post_nodes`   [POST] /nodes

 
    public function getNodeAction($node_id)
    {
    
    	return new Response(json_encode($this->getDoctrine()
        		->getRepository('ZeegaEditorBundle:Node')
        		->findNodeById($node_id)));
        
    
    } // `get_node`     [GET] /nodes/{node_id}



    public function putNodeAction($node_id)
    {
    	$em=$this->getDoctrine()->getEntityManager();
		$request = $this->getRequest();
    	$node=$em->getRepository('ZeegaEditorBundle:Node')
					->find($node_id);
    	
    	/*
    	
      	
  		
    	$linkUp=$this->getDoctrine()
        		->getRepository('ZeegaEditorBundle:Node')
        		->findNodeById($request->request->get('link_up'));
        $linkDown=$this->getDoctrine()
        		->getRepository('ZeegaEditorBundle:Node')
        		->findNodeById($request->request->get('link_down'));
        $linkRight=$this->getDoctrine()
        		->getRepository('ZeegaEditorBundle:Node')
        		->findNodeById($request->request->get('link_right'));
    	$linkLeft=$this->getDoctrine()
        		->getRepository('ZeegaEditorBundle:Node')
        		->findNodeById($request->request->get('link_left'));
    	

    	if($linkUp){
    		$node->setLinkUp($linkUp);
    	
    	}
    	if($linkDown) $node->setLinkDown($linkDown);
    	if($linkRight) $node->setLinkRight($linkRight);
    	if($linkLeft) $node->setLinkLeft($linkLeft);
    	
    	if($request->request->get('advance'))$node->setAdvance($request->request->get('advance'));
     	if($request->request->get('advance_time'))$node->setAdvanceTime($request->request->get('advance_time'));
     	
     	
		$em=$this->getDoctrine()->getEntityManager();
		$em->persist($node);
		$em->flush();
		*/
		
		
		if($request->request->get('thumb_url'))$node->setThumbUrl($request->request->get('thumb_url'));
		if($request->request->get('layers'))$node->setLayers($request->request->get('layers'));
     	
		
		if($request->request->get('attr')){		
			
					
			$node->setAttr($request->request->get('attr'));
			$em->persist($node);
			$em->flush();
		}
		
		
		$em->flush();
		
		
		
		
    	return new Response(json_encode($em->getRepository('ZeegaEditorBundle:Node')
        		->findNodeById($node_id)));
        		
        
    } // `put_node`     [PUT] /nodes/{node_id}




	/** `delete_node`  [DELETE] /nodes/{node_id}  */

    public function deleteNodeAction($node_id){
    
    	$em = $this->getDoctrine()->getEntityManager();
     	$node= $em->getRepository('ZeegaEditorBundle:Node')->find($node_id);
     	
    	$em->remove($node);
    	$em->flush();
    	return new Response('SUCCESS',200);
    } 

	

	 public function getNodeLayersAction($node_id)
    {
    		
    		$node=$this->getDoctrine()
        				->getRepository('ZeegaEditorBundle:Node')
        				->find($node_id);
        	
        	$layerList=$node->getLayers();
        	
        	foreach($layerList as $layer_id){
        	
        	$layers=$node=$this->getDoctrine()
        				->getRepository('ZeegaEditorBundle:Layer')
        				->findLayerById($layer_id);
        	
        	}
    		return new Response(json_encode($layers));
    } 
	
	
 

}


