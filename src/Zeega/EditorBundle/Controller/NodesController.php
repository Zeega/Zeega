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
    	$node=$em->getRepository('ZeegaEditorBundle:Node')
					->find($node_id);
    	
    	$request = $this->getRequest();
    	
		if($request->request->get('thumb_url')!=0){
			$node->setThumbUrl($request->request->get('thumb_url'));
		}
		else{
			exec('/opt/webcapture/webpage_capture -t 50x50 -crop ' .$this->container->getParameter('hostname') .$this->container->getParameter('directory') .'gamma/node.html#'.$node_id.' /var/www/'.$this->container->getParameter('directory').'images/nodes',$output);
			$url=explode(':/var/www/',$output[4]);
			$node->setThumbUrl($this->container->getParameter('hostname').$url[1]);
			
		}
		
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
        	
        	$l=$this->getDoctrine()
        				->getRepository('ZeegaEditorBundle:Layer')
        				->findLayerById($layer_id);
        	$layers[]=$l[0];
        	}
    		return new Response(json_encode($layers));
    } 
	
	
 

}


