<?php

namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\DataBundle\Entity\Frame;
use Zeega\DataBundle\Entity\Layer;
use Zeega\DataBundle\Entity\Sequence;
use Zeega\DataBundle\Entity\Project;
use Zeega\DataBundle\Entity\Site;
use Zeega\DataBundle\Entity\User;
use Zeega\CoreBundle\Helpers\ResponseHelper;

class ProjectsController extends Controller
{
	// `get_project`     [GET] /projects/{project_id}
    public function getProjectAction($project_id)
    {
    
    	$project=$this->getDoctrine()
        ->getRepository('ZeegaDataBundle:Sequence')
        ->findById($project_id);
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
     	$project = $em->getRepository('ZeegaDataBundle:Project')->find($project_id);
        
    	$project->setEnabled(false);

    	$em->flush();
    	return new Response('SUCCESS',200);
    } 

	// `get_project_sequences`    [GET] /projects/{project_id}/sequences
    public function getProjectSequencesAction($project_id)
    {
    		
    		return new Response(json_encode($this->getDoctrine()
        				->getRepository('ZeegaDataBundle:Sequence')
        				->findSequencesByProjectId($project_id)));
    
    } 
    
    
    	// `get_project_sequences`    [GET] /projects/{project_id}/all
    public function getProjectAllAction($project_id)
    {
    		
    		$projects=$this->getDoctrine()
        			->getRepository('ZeegaDataBundle:Sequence')
        			->findById($project_id);
    	
    		$project=$projects[0];
    
    		$sequences=$this->getDoctrine()
        				->getRepository('ZeegaDataBundle:Sequence')
        				->findSequencesByProject($project_id);
        				
        	for($i=0;$i<sizeof($sequences);$i++){
        		$sequences[$i]['frames']=$this->getDoctrine()
        				->getRepository('ZeegaDataBundle:Frame')
        				->findFramesBySequenceId($sequences[$i]['id']);
        	
        		$order=array();
			foreach($sequences[$i]['frames'] as $frame){
			
				$order[]=$frame['id'];
			
			
			}
			$sequences[$i]['frameOrder']=$order;
			
        		$output=array();
    			$sequence=$this->getDoctrine()
        				->getRepository('ZeegaDataBundle:Sequence')
        				->find($sequences[$i]['id']);
        				
        		$layers=$sequence->getLayers()->toArray();
        			foreach($layers as $layer){
        				$l=$this->getDoctrine()
        					->getRepository('ZeegaDataBundle:Layer')
        					->findLayerById($layer->getId());
        				$output[]=$l[0];
        		}
        		
        		$sequences[$i]['layers']=$output;
	        }
        	$project['sequences']=$sequences;
        	
			return new Response(json_encode(array('project'=>$project)));
    
    } 
    

	 // `post_project_sequences`   [POST] /sequences/{project_id}/frames

    public function postProjectSequencesAction($project_id)
    {
		$em = $this->getDoctrine()->getEntityManager();
		$request = $this->getRequest();
		$project= $em->getRepository('ZeegaDataBundle:Project')->find($project_id);
		
		$sequenceCount = $this->getDoctrine()->getRepository('ZeegaDataBundle:Sequence')->findSequencesCountByProject($project_id);
		$sequenceIndex = $sequenceCount + 1;
		
		$sequence = new Sequence();
		
		$frame = new Frame();
		$frame->setSequence($sequence);
		$frame->setProject($project);

		if($request->request->get('frame_id')) 
		{
		    $frameId = $request->request->get('frame_id');
		    $previousframe = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->find($frameId);
		    
		    $previousFrameLayers = $previousframe->getLayers();
			foreach($previousFrameLayers as $layer)
			{
				if(isset($layer))
				{
					if(!isset($currLayers) || !$currLayers->contains($layer))
					{
						$layer->setProject($project);
						$frame->addLayer($layer);
					}
				}
			}
    	}
    	
		$sequence->setProject($project);
		$sequence->setTitle('Sequence '.$sequenceIndex);

		$em = $this->getDoctrine()->getEntityManager();
		$em->persist($sequence);
		$em->persist($frame);
		$em->flush();
		
		$layers = array();
		// auch - should work for now, but won't scale for sure
		$sequenceId = $sequence->getId();
		$frames = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->findFramesBySequenceId($sequenceId);
		//return new Response(json_encode(var_dump($frames)));
		$sequence = $this->getDoctrine()->getRepository('ZeegaDataBundle:Sequence')->find($sequence->getId());
		
        //$layers = $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findBy(array('project_id' => $project_id));
		$layers = array();
		
		$sequenceView = $this->renderView('ZeegaApiBundle:Sequences:show.json.twig', array('sequence' => $sequence, 'frames' =>$frames, 'layers' =>$layers));
        return ResponseHelper::compressTwigAndGetJsonResponse($sequenceView);
   }
}
