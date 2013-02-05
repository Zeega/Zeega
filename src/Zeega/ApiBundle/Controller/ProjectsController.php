<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

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
use Zeega\DataBundle\Entity\Sequence;
use Zeega\DataBundle\Entity\Project;

use Zeega\CoreBundle\Controller\BaseController;

class ProjectsController extends BaseController
{
    //  get_collections GET    /api/collections.{_format}
    public function getProjectAction($id)
    {	
		// very inefficient method
		// needs to be indexed (i.e. SOLR indexed) for published projects; OK for the editor (only called once when the editor is loaded)
		
		$user = $this->get('security.context')->getToken()->getUser();

		$project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($id);
		$sequences = $this->getDoctrine()->getRepository('ZeegaDataBundle:Sequence')->findBy(array("project" => $project, "enabled" => true));
		$frames = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->findBy(array("project" => $project, "enabled" => true));
		$layers = $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findBy(array("project" => $project, "enabled" => true));
		
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
    
    // `delete_project`  [DELETE] /projects/{project_id}
    public function deleteProjectAction($project_id)
    {
    	$em = $this->getDoctrine()->getEntityManager();
     	$project = $em->getRepository('ZeegaDataBundle:Project')->find($project_id);
        
    	$project->setEnabled(false);

    	$em->flush();
    	return new Response('SUCCESS',200);
    }
    
    // put_collections_items   PUT    /api/collections/{project_id}/items.{_format}
    public function putProjectsAction($projectId)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $request = $this->getRequest();
        $request_data = $this->getRequest()->request;        

		$project = $em->getRepository('ZeegaDataBundle:Project')->find($projectId);

        if ( !$project ) {
            throw $this->createNotFoundException('Unable to find the Project with the id ' + $projectId);
        }

        // update date_published
		$title = $request_data->get('title');
        $tags = $request_data->get('tags');
        $coverImage = $request_data->get('cover_image');
        $authors = $request_data->get('authors');
		$published = $request_data->get('published');
        $estimatedTime = $request_data->get('estimated_time'); 
        $location = $request_data->get('location');
        $description = $request_data->get('description');
		$publishUpdate = $request_data->get('publish_update');
        $mobile = $request_data->get('mobile');

		if(isset($title) && strlen($title) > 0) $project->setTitle($title);
		if(isset($authors)) $project->setAuthors($authors);
		if(isset($coverImage)) $project->setCoverImage($coverImage);
		if(isset($tags)) $project->setTags($tags);
		if(isset($published)) $project->setPublished($published);
        if(isset($estimatedTime)) $project->setEstimatedTime($estimatedTime);
        if(isset($location)) $project->setLocation($location);
        if(isset($description)) $project->setDescription($description);
        if(isset($mobile)) $project->setMobile($mobile);

        $project->setDateUpdated(new \DateTime("now"));
 
        $em->persist($project);
        $em->flush();
		
		if ( (isset($publishUpdate)&&$publishUpdate) ) {			
			$project_http = $this->forward('ZeegaApiBundle:Projects:getProject', array("id" => $projectId));
        	
            // if this project is not represented in the item table
            if ( is_null($project->getItemId()) ) {
				// create new item
				// should this be a call to ItemsController->populateItemWithRequestData, so as not to set Item data outside the ItemsController ?
				$user = $this->get('security.context')->getToken()->getUser();
				
				$item = new Item();
				$item->setDateCreated(new \DateTime("now"));
				$item->setDateUpdated(new \DateTime("now"));
                $item->setChildItemsCount(0);
				$item->setUser($user);								
				$item->setUri($projectId);
				$item->setMediaType("project");
				$item->setLayerType("project");
				$item->setArchive("zeega");
				$item->setMediaCreatorUsername($user->getUsername());				
				$item->setAttributionUri("http://beta.zeega.org/");
				$item->setPublished(true);
                $item->setEnabled(true);
                
				$em->persist($item);
				$em->flush();
				
				$item->setAttributionUri("http://beta.zeega.org/".$item->getId());
				$em->persist($item);
				$em->flush();
				
				$project->setItemId($item->getId());
				$project->setDatePublished($project->getDateUpdated());
				$em->persist($project);
				$em->flush();
            
       		}else{ // if this project is represented in the item table
				
				// fetch associated item
				$item = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findOneById($project->getItemId());
				
				$project->setDatePublished($project->getDateUpdated());
				$em->persist($project);
				$em->flush();
			}

            $projectTags = $project->getTags();
            $itemTags = $item->getTags();
            
            if ( isset($projectTags) && is_array($projectTags) ) {

                if ( isset($itemTags) && is_array($itemTags) ) {
                    $projectTags = array_unique(array_values(array_merge($itemTags, $projectTags))); // oooo
                }

                $item->setTags($projectTags);
            }
        
        
			$item->setMediaCreatorRealname($project->getAuthors());
			$item->setDescription($project->getDescription());
			$item->setThumbnailUrl($project->getCoverImage());
			$item->setTitle($project->getTitle());
            $item->setDateUpdated(new \DateTime("now"));
			$project_json = $project_http->getContent();
			$item->setText($project_json);
			$em->persist($item);
			$em->flush();
			
        }
        
        $project_http = $this->forward('ZeegaApiBundle:Projects:getProject', array("id" => $projectId));
        return $project_http;
    }
    
    public function postProjectLayersAction($projectId)
    {
    	$em = $this->getDoctrine()->getEntityManager();
     	$project= $em->getRepository('ZeegaDataBundle:Project')->find($projectId);
    	$project->setDateUpdated(new \DateTime("now"));

    	$layer= new Layer();
    	$layer->setProject($project);
		$request = $this->getRequest();
    	
		
		if($request->request->get("type")) $layer->setType($request->request->get("type"));   	
    	if($request->request->get('text')) $layer->setText($request->request->get('text'));
		if($request->request->has('attr')) {
            $attributes = $request->request->get('attr');
            $layer->setAttr($attributes);
            if( isset($attributes["id"]) ) {
                $item = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->find($attributes["id"]);
                if ( isset($item) ) {
                    $layer->setItem($item);    
                }
            }
        } 
    	
		$em->persist($layer);
		$em->flush();
        
    	return ResponseHelper::encodeAndGetJsonResponse($layer);
    } // `post_sequence_layers`   [POST] /sequences
    
    public function postProjectSequencesAction($project_id)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $request = $this->getRequest();
        $project= $em->getRepository('ZeegaDataBundle:Project')->find($project_id);
        
        $project->setDateUpdated(new \DateTime("now"));
        
        $sequenceCount = $this->getDoctrine()->getRepository('ZeegaDataBundle:Sequence')->findSequencesCountByProject($project_id);
        $sequenceIndex = $sequenceCount + 1;

        $sequence = new Sequence();

        $frame = new Frame();
        $frame->setSequence($sequence);
        $frame->setProject($project);

        if($request->request->get('layers_to_persist'))
        {
            $layersToPersist = $request->request->get('layers_to_persist');
            $frame->setLayers($layersToPersist);
        }
        else if($request->request->get('frame_id'))
        {
            $frameId = $request->request->get('frame_id');
            $previousframe = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->find($frameId);

            $previousFrameLayers = $previousframe->getLayers();
            $frame->setLayers($previousFrameLayers);
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
        $sequence = $this->getDoctrine()->getRepository('ZeegaDataBundle:Sequence')->find($sequence->getId());

        $layers = array();

        $sequenceView = $this->renderView('ZeegaApiBundle:Sequences:show.json.twig', array('sequence' => $sequence, 'sequence_frames_complete' =>$frames, 'layers' =>$layers));
        return ResponseHelper::compressTwigAndGetJsonResponse($sequenceView);
    }
    
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
            $currFrames = $em->getRepository('ZeegaDataBundle:Frame')->findBy(array("sequence"=>$sequenceId));

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

    public function postProjectAction()
    {
        $user = $this->get('security.context')->getToken()->getUser();
        $request = $this->getRequest();
        
        if($request->request->get('title'))$title=$request->request->get('title');
        if($request->request->get('collection_id'))
        {
            $session = $this->getRequest()->getSession();
            $session->set("collection_id", $request->request->get('collection_id'));
        } else {
            $title='Untitled Zeega';    
        }
        
        $project= new Project();
        $project->setDateCreated(new \DateTime("now"));
        $project->setEnabled(true);
        $project->setPublished(false);
        $project->setAuthors($user->getDisplayName());
        
        $sequence = new Sequence();
        $frame = new Frame();
        $frame->setSequence($sequence);
        $frame->setProject($project);
        $frame->setEnabled(true);
        $project->addUser($user);
        $sequence->setProject($project);
        $sequence->setTitle('Intro Sequence');
        $sequence->setEnabled(true);
        $project->setTitle($title);
        $em=$this->getDoctrine()->getEntityManager();
        $em->persist($sequence);
        $em->persist($project);
        $em->persist($frame);
        $em->flush();
        return new Response($project->getId());
    }
}
