<?php
namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

use Zeega\DataBundle\Entity\Item;
use Zeega\CoreBundle\Helpers\ItemCustomNormalizer;
use Zeega\CoreBundle\Helpers\ResponseHelper;
use Zeega\DataBundle\Entity\Layer;
use Zeega\DataBundle\Entity\Frame;

class ProjectsController extends Controller
{
    //  get_collections GET    /api/collections.{_format}
    public function getProjectAction($id)
    {	
		// very inefficient method
		// needs to be indexed (i.e. SOLR indexed) for published projects; OK for the editor (only called once when the editor is loaded)
		
		$user = $this->get('security.context')->getToken()->getUser();

		$project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($id);
		$sequences = $this->getDoctrine()->getRepository('ZeegaDataBundle:Sequence')->findBy(array("project_id" => $id));
		$frames = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->findBy(array("project_id" => $id));
		$layers = $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findBy(array("project_id" => $id));
		
		$sequenceFrames = array();
		
		foreach($sequences as $sequence)
		{
			$sequenceId = $sequence->getId();
			$sequenceFrames[$sequenceId] = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->findIdBySequenceId($sequenceId);
		}
		
		$projectView = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project, 
			'sequences' => $sequences, 'sequence_frames' => $sequenceFrames, 'layers' => $layers, 'frames' => $frames));
		
    	return ResponseHelper::compressTwigAndGetJsonResponse($projectView);
    } 
    
    // put_collections_items   PUT    /api/collections/{project_id}/items.{_format}
    public function putProjectsAction($projectId)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $request = $this->getRequest();
        $request_data = $this->getRequest()->request;        
        
		$project = $em->getRepository('ZeegaDataBundle:Project')->find($projectId);

        if (!$project) 
        {
            throw $this->createNotFoundException('Unable to find the Project with the id ' + $projectId);
        }

		$title = $request_data->get('title');
        $tags = $request_data->get('tags');
        $coverImage = $request_data->get('cover_image');
        $authors = $request_data->get('authors');
		$published = $request_data->get('published');
        $estimatedTime = $request_data->get('estimated_time');        
		if(isset($title)) $project->setTitle($title);
		if(isset($authors)) $project->setAuthors($authors);
		if(isset($coverImage)) $project->setCoverImage($coverImage);
		if(isset($tags)) $project->setTags($tags);
		if(isset($published)) $project->setPublished($published);
        if(isset($estimatedTime)) $project->setEstimatedTime($estimatedTime);
        
        $project->setDateUpdated(new \DateTime("now"));
        
        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($project);
        $em->flush();
        
        //$projectView = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project));
        //return ResponseHelper::compressTwigAndGetJsonResponse($projectView);
        return $this->forward('ZeegaApiBundle:Projects:getProject', array("id" => $projectId));       
    }
    
    public function postProjectLayersAction($projectId)
    {
    	$em = $this->getDoctrine()->getEntityManager();
     	$project= $em->getRepository('ZeegaDataBundle:Project')->find($projectId);
    	$project->setDateUpdated(new \DateTime("now"));

    	$layer= new Layer();
    	$layer->setProject($project);
		$request = $this->getRequest();
    	
    	if($request->request->get('item_id'))
    	{
    	    $item = $this->getDoctrine()->getRepository('ZeegaItemBundle:Item')->find($request->request->get('item_id'));
			$layer->setItem($item);
		}
		
		if($request->request->get("type")) $layer->setType($request->request->get("type"));   	
    	if($request->request->get('text')) $layer->setText($request->request->get('text'));
		if($request->request->get('attr')) $layer->setAttr($request->request->get('attr'));
    	
		$em->persist($layer);
		$em->flush();
        
    	return ResponseHelper::encodeAndGetJsonResponse($layer);
    } // `post_sequence_layers`   [POST] /sequences

    public function postProjectSequencesFramesAction($projectId,$sequenceId)
    {
    	$em = $this->getDoctrine()->getEntityManager();
     	$project = $em->getRepository('ZeegaDataBundle:Project')->find($projectId);
     	$sequence = $em->getRepository('ZeegaDataBundle:Sequence')->find($sequenceId);
     	
     	$frame = new Frame();
    	$frame->setProject($project);
    	$frame->setSequence($sequence);
     	
     	$request = $this->getRequest();
     	
     	if($request->request->get('duplicate_id'))
        {
            $layersToPersist = $request->request->get('layers_to_persist');
            $original_frame = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->find($request->request->get('duplicate_id'));

			if($request->request->get('layers'))
			{
				$original_layers = $request->request->get('layers');
        		foreach($original_layers as $original_layer_id)
        		{
       	 				$layer= new Layer();
    					$layer->setProject($project);
        				$original_layer=$this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->find($original_layer_id);
        				
						if($original_layer->getItem()) $layer->setItem($original_layer->getItem());
						if($original_layer->getType()) $layer->setType($original_layer->getType());
						if($original_layer->getText()) $layer->setText($original_layer->getText());
						if($original_layer->getAttr()) $layer->setAttr($original_layer->getAttr());
						
						$em->persist($layer);
						$em->flush();
        				$frame_layers[]=$layer->getId();	
        		}
        		$frame->setLayers($frame_layers);
			}
            if($original_frame->getThumbnailUrl()) $frame->setThumbnailUrl($original_frame->getThumbnailUrl());
            if($original_frame->getAttr()) $frame->setAttr($original_frame->getAttr());
            //if($original_frame->getLayers()) $frame->setLayers($original_frame->getLayers());
            //if(isset($layersToPersist)) $frame->setLayers($layersToPersist);
        }
        else
        {
            $currFrames = $em->getRepository('ZeegaDataBundle:Frame')->findBy(array("sequence_id"=>$sequenceId));

        	$frame = new Frame();
        	$frame->setProject($project);
        	$frame->setSequence($sequence);
        	$frame->setSequenceIndex(count($currFrames));
            $frame->setEnabled(true);

    		$request = $this->getRequest();

       		if($request->request->get('thumbnail_url')) $frame->setThumbnailUrl($request->request->get('thumbnail_url'));
       		if($request->request->get('attr')) $frame->setAttr($request->request->get('attr'));
       		if($request->request->get('layers')) $frame->setLayers($request->request->get('layers'));
                if($request->request->get('layers_to_persist')) $frame->setLayers($request->request->get('layers_to_persist'));
        }
        
        $project->setDateUpdated(new \DateTime("now"));
        
   		$em->persist($project);
   		$em->persist($frame);
   		$em->flush();
        
        $frameLayers = $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findByMultipleIds($frame->getLayers());
    	$frameView = $this->renderView('ZeegaApiBundle:Frames:show.json.twig', array('frame' => $frame, 'layers' => $frameLayers));

    	return ResponseHelper::compressTwigAndGetJsonResponse($frameView);
        
     	
    } // `post_sequence_layers`   [POST] /sequences
}
