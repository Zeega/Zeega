<?php

namespace Zeega\EditorBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\EditorBundle\Entity\Node;
use Zeega\EditorBundle\Entity\Layer;
use Zeega\EditorBundle\Entity\Route;
use Zeega\EditorBundle\Entity\Playground;
use Zeega\EditorBundle\Entity\Project;
use Zeega\UserBundle\Entity\User;

class PlaygroundsController extends Controller
{
    
     
	 // `post_playground`   [POST] /playgrounds
    public function postPlaygroundAction()
    {
    	if($request->request->get('title')){
    	
    		$playground= new Playground();
    		$playground->setTitle($request->request->get('title'));
    		$em=$this->getDoctrine()->getEntityManager();
			$em->persist($playground);
			return new Response(json_encode($playground));
    	}
    	else{
    	
    	return new Response('Failure');
    	}
    }

	// `get_playground`     [GET] /playgrounds/{playground_id}
    public function getPlaygroundAction($playground_id)
    {
    	$playground=$this->getDoctrine()
        ->getRepository('ZeegaEditorBundle:Playground')
        ->findPlaygroundById($playground_id);
    	return new Response(json_encode($playground[0]));
        
    
    } 
    
    public function deletePlaygroundUserAction($playground_id,$user_id){
    
    	
    	$playground=$this->getDoctrine()
        ->getRepository('ZeegaEditorBundle:Playground')
        ->find($playground_id);
        $user=$this->getDoctrine()
        ->getRepository('ZeegaUserBundle:User')
        ->find($user_id);
        $playground->removeUsers($user);
        $em=$this->getDoctrine()->getEntityManager();
		$em->persist($playground);
    	return new Response('Success');
    
    }
    
    
     // `post_playground`   [POST] playground/{playground_id}/project
    public function postPlaygroundProjectAction($playground_id)
    {
    	$user = $this->get('security.context')->getToken()->getUser();
    	$request = $this->getRequest();
		if($request->request->get('title'))$title=$request->request->get('title');
		else $title='click here to change title';
    	$playground=$this->getDoctrine()
        ->getRepository('ZeegaEditorBundle:Playground')
        ->find($playground_id);
    	$project= new Project();
		$route = new Route();
		$node = new Node();
		$node->setRoute($route);
		$project->setPlayground($playground);
		$project->addUsers($user);
		$route->setProject($project);
		$route->setTitle($title);
		$project->setTitle($title);
		$em=$this->getDoctrine()->getEntityManager();
		$em->persist($route);
		$em->persist($project);
		$em->persist($node);
		$em->flush();
		return new Response($project->getId());
    }
    
        
    /*

	// `put_playground`     [PUT] /playgrounds/{playground_id}
    public function putPlaygroundAction($playground_id)
    {
    	$request = $this->getRequest();
      	$em =$this->getDoctrine()->getEntityManager();
     	$playground= $this->getDoctrine()->getRepository('ZeegaEditorBundle:Playground')->findOneById($playground_id);
    	if($request->request->get('title'))$playground->setTitle($request->request->get('title'));
		$em->flush();
    	return new Response('SUCCESS',200);
    } 


	// `delete_playground`  [DELETE] /playgrounds/{playground_id}
    public function deletePlaygroundAction($playground_id)
    {
    
    	$em = $this->getDoctrine()->getEntityManager();
     	$playground= $em->getRepository('ZeegaEditorBundle:Playground')->find($playground_id);
    
    	$em->remove($playground);
    	$em->flush();
    	return new Response('SUCCESS',200);
    
    
    } 

	// `get_playground_routes`    [GET] /playgrounds/{playground_id}/routes
    public function getPlaygroundRoutesAction($playground_id)
    {
    		
    		return new Response(json_encode($this->getDoctrine()
        				->getRepository('ZeegaEditorBundle:Node')
        				->findRoutesByPlaygroundId($playground_id)));
    
    } 

	*/
	

}
