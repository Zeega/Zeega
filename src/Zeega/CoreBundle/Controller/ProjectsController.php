<?php

namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\DataBundle\Entity\Node;
use Zeega\DataBundle\Entity\Layer;
use Zeega\DataBundle\Entity\Route;
use Zeega\DataBundle\Entity\Project;
use Zeega\DataBundle\Entity\Playground;
use Zeega\DataBundle\Entity\User;

class ProjectsController extends Controller
{
    
     
	 // `post_project`   [POST] /projects
    public function postProjectAction()
    {

        
    }

	// `get_project`     [GET] /projects/{project_id}
    public function getProjectAction($project_id)
    {
    
    	$project=$this->getDoctrine()
        ->getRepository('ZeegaDataBundle:Route')
        ->findProjectById($project_id);
    	return new Response(json_encode($project[0]));
        
    
    } 


	// `put_project`     [PUT] /projects/{project_id}
    public function putProjectAction($project_id)
    {
    	$request = $this->getRequest();
      	$em =$this->getDoctrine()->getEntityManager();
     	$project= $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($project_id);
    	if($request->request->get('title'))$project->setTitle($request->request->get('title'));
		$em->flush();
    	return new Response('SUCCESS',200);
    } 


	// `delete_project`  [DELETE] /projects/{project_id}
    public function deleteProjectAction($project_id)
    {
    
    	$em = $this->getDoctrine()->getEntityManager();
     	$project= $em->getRepository('ZeegaDataBundle:Project')->find($project_id);
     	/*
     	$routes=$em->getRepository('ZeegaDataBundle:Route')
        				->findRoutesByProject($project_id);
     	foreach($routes as $route){
     	
     		$r=$em->getRepository('ZeegaDataBundle:Route')
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
        				->getRepository('ZeegaDataBundle:Route')
        				->findRoutesByProjectId($project_id)));
    
    } 
    
    
    	// `get_project_routes`    [GET] /projects/{project_id}/all
    public function getProjectAllAction($project_id)
    {
    		
    		$projects=$this->getDoctrine()
        			->getRepository('ZeegaDataBundle:Route')
        			->findProjectById($project_id);
    	
    		$project=$projects[0];
    
    		$routes=$this->getDoctrine()
        				->getRepository('ZeegaDataBundle:Node')
        				->findRoutesByProject($project_id);
        				
        	for($i=0;$i<sizeof($routes);$i++){
        		$routes[$i]['nodes']=$this->getDoctrine()
        				->getRepository('ZeegaDataBundle:Node')
        				->findNodesByRouteId($routes[$i]['id']);
        	
        		$order=array();
			foreach($routes[$i]['nodes'] as $node){
			
				$order[]=$node['id'];
			
			
			}
			$routes[$i]['nodeOrder']=$order;
			
        		$output=array();
    			$route=$this->getDoctrine()
        				->getRepository('ZeegaDataBundle:Route')
        				->find($routes[$i]['id']);
        				
        		$layers=$route->getLayers()->toArray();
        			foreach($layers as $layer){
        				$l=$this->getDoctrine()
        					->getRepository('ZeegaDataBundle:Layer')
        					->findLayerById($layer->getId());
        				$output[]=$l[0];
        		}
        		
        		$routes[$i]['layers']=$output;
	        }
        	$project['routes']=$routes;
        	
			return new Response(json_encode(array('project'=>$project)));
    
    } 
    

	 // `post_project_routes`   [POST] /routes/{project_id}/nodes

    public function postProjectRoutesAction($project_id)
    {
    	
		
		
		$em=$this->getDoctrine()->getEntityManager();
		$request = $this->getRequest();
		$project= $em->getRepository('ZeegaDataBundle:Project')->find($project_id);
		$route = new Route();
		$node = new Node();
		$node->setRoute($route);
		$project->setPlayground($playground);
		$project->addUsers($user);
		$route->setProject($project);
		
		$route->setTitle('Untitled Project '.$project_id);
		$project->setTitle('Untitled Project '.$project_id);
		/*
		$route->setTitle('Untitled: '.date('l F j, Y h:i:s A'));
		$project->setTitle('Untitled: '.date('l F j, Y h:i:s A'));
		*/
		$em=$this->getDoctrine()->getEntityManager();
		$em->persist($route);
		$em->persist($project);
		$em->persist($node);
		$em->flush();
    	return new Response("Success");
   

    
    
   
}

	

}
