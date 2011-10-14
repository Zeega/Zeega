<?php

namespace Zeega\EditorBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\EditorBundle\Entity\Node;
use Zeega\EditorBundle\Entity\Layer;
use Zeega\EditorBundle\Entity\Route;
use Zeega\EditorBundle\Entity\Project;
use Zeega\UserBundle\Entity\User;

class ProjectsController extends Controller
{
    
     
	 // `post_project`   [POST] /projects
    public function postProjectAction()
    {
		$project= new Project();
		$route = new Route();
		$node = new Node();
		$node->setRoute($route);
		$project->setPlayground($playground);
		$project->addUsers($user);
		$route->setProject($project);
		$route->setTitle('Untitled: '.date('l F j, Y h:i:s A'));
		$project->setTitle('Untitled: '.date('l F j, Y h:i:s A'));
		$em=$this->getDoctrine()->getEntityManager();
		$em->persist($route);
		$em->persist($project);
		$em->persist($node);
		$em->flush();
		return new Response(json_encode($project->getId()));
        
    }

	// `get_project`     [GET] /projects/{project_id}
    public function getProjectAction($project_id)
    {
    	$project=$this->getDoctrine()
        ->getRepository('ZeegaEditorBundle:Route')
        ->findProjectById($project_id);
    	return new Response(json_encode($project[0]));
        
    
    } 


	// `put_project`     [PUT] /projects/{project_id}
    public function putProjectAction($project_id)
    {
    	$request = $this->getRequest();
      	$em =$this->getDoctrine()->getEntityManager();
     	$project= $this->getDoctrine()->getRepository('ZeegaEditorBundle:Project')->findOneById($project_id);
    	if($request->request->get('title'))$project->setTitle($request->request->get('title'));
		$em->flush();
    	return new Response('SUCCESS',200);
    } 


	// `delete_project`  [DELETE] /projects/{project_id}
    public function deleteProjectAction($project_id)
    {
    
    	$em = $this->getDoctrine()->getEntityManager();
     	$project= $em->getRepository('ZeegaEditorBundle:Project')->find($project_id);
     	/*
     	$routes=$em->getRepository('ZeegaEditorBundle:Route')
        				->findRoutesByProject($project_id);
     	foreach($routes as $route){
     	
     		$r=$em->getRepository('ZeegaEditorBundle:Route')
        				->find($route['id']);
     		$em->remove($r);
     	
     	}
     	*/
    	$em->remove($project);
    	$em->flush();
    	return new Response('SUCCESS',200);
    
    
    } 

	// `get_project_routes`    [GET] /projects/{project_id}/routes
    public function getProjectRoutesAction($project_id)
    {
    		
    		return new Response(json_encode($this->getDoctrine()
        				->getRepository('ZeegaEditorBundle:Node')
        				->findRoutesByProjectId($project_id)));
    
    } 

	 // `post_project_routes`   [POST] /routes/{project_id}/nodes

    public function postProjectRoutesAction($project_id)
    {
    	
		
		
		$em=$this->getDoctrine()->getEntityManager();
		$request = $this->getRequest();
		$project= $em->getRepository('ZeegaEditorBundle:Route')->find($project_id);
		$route = new Route();
		$node = new Node();
		$node->setRoute($route);
		$project->setPlayground($playground);
		$project->addUsers($user);
		$route->setProject($project);
		$route->setTitle('Untitled: '.date('l F j, Y h:i:s A'));
		$project->setTitle('Untitled: '.date('l F j, Y h:i:s A'));
		$em=$this->getDoctrine()->getEntityManager();
		$em->persist($route);
		$em->persist($project);
		$em->persist($node);
		$em->flush();
    	return new Response("Success");
   

    
    
   
}

	

}
