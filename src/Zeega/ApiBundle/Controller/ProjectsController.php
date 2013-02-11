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
use Zeega\DataBundle\Document\Project as MongoProject;
use Zeega\DataBundle\Document\Sequence as MongoSequence;
use Zeega\DataBundle\Document\Frame as MongoFrame;
use Zeega\DataBundle\Document\Layer as MongoLayer;

use Zeega\CoreBundle\Controller\BaseController;

class ProjectsController extends BaseController
{
    //  get_collections GET    /api/collections.{_format}
    public function getProjectAction($id)
    {	
		$user = $this->get('security.context')->getToken()->getUser();
        $dm = $this->get('doctrine_mongodb')->getManager();

		$project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($id);
		$projectView = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project));
		
    	return ResponseHelper::compressTwigAndGetJsonResponse($projectView);
    } 
    
    // `delete_project`  [DELETE] /projects/{project_id}
    public function deleteProjectAction($project_id)
    {
    	$dm = $this->get('doctrine_mongodb')->getManager();
     	$project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($id);        
    	$project->setEnabled(false);
    	$dm->flush();
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
    	$dm = $this->get('doctrine_mongodb')->getManager();
     	$project= $dm->getRepository('ZeegaDataBundle:Project')->find($projectId);
    	$project->setDateUpdated(new \DateTime("now"));

    	$layer= new MongoLayer();
    	
        $request = $this->getRequest();    			
		if($request->request->has("type")) {
            $layer->setType($request->request->get("type"));      
        } 
    	
        if($request->request->has('text')) {
            $layer->setText($request->request->get('text'));   
        }

		if($request->request->has('attr')) {
            $attributes = $request->request->get('attr');
            $layer->setAttr($attributes);
            if( isset($attributes["id"]) ) {
                /*
                $item = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->find($attributes["id"]);
                if ( isset($item) ) {
                    $layer->setItem($item);    
                }
                */
            }
        }

        $layer = new MongoLayer();        
        $layer->setEnabled(true);

        $project->addLayers($layer);
    	
		$dm->persist($layer);
		$dm->flush();
        
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
    
    public function postProjectSequencesFramesAction($projectId, $sequenceId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        
        $project = $dm->createQueryBuilder('ZeegaDataBundle:Project')
                        ->field('id')->equals($projectId)
                        ->field('sequences.id')->equals($sequenceId)
                        ->select('sequences.$')
                        ->getQuery()
                        ->getSingleResult();
        
        if ( !isset($project) || !$project instanceof MongoProject) {
            return new Response("Document does not exist");
        } 

        $sequences = $project->getSequences();

        if ( !isset($sequences) || $sequences->count() != 1) {
            return new Response("Sequence does not exist");  
        }

        $sequence = $sequences[0];

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
            $frame = new MongoFrame();
        	$frame->setSequenceIndex(count($sequence->getFrames()));
            
       		if($request->request->get('thumbnail_url')) {
                $frame->setThumbnailUrl($request->request->get('thumbnail_url'));  
            } 

       		if($request->request->get('attr')) {
                $frame->setAttr($request->request->get('attr'));  
            } 

       		if($request->request->get('layers')) {
                $frame->setLayers($request->request->get('layers'));  
            } 

            if($request->request->get('layers_to_persist')) {
                $frame->setLayers($request->request->get('layers_to_persist'));    
            }
        }
        
        $project->setDateUpdated(new \DateTime("now"));
        $project->addFrames($frame);

        $dm->persist($sequence);
   		$dm->persist($project);
   		$dm->persist($frame);
        $dm->flush();

        $currFrames = $sequence->getFrames();
        if( is_array($currFrames) ) {            
            array_push($currFrames, $frame->getId());
            $sequence->setFrames($currFrames);
        } else {
            $sequence->setFrames(array($frame->getId()));
        }

        $dm->persist($sequence);
        $dm->flush();        

        $frameView = $this->renderView('ZeegaApiBundle:Frames:show.json.twig', array('frame' => $frame));

    	return ResponseHelper::compressTwigAndGetJsonResponse($frameView);
    } // `post_sequence_layers`   [POST] /sequences

    /* TO-DO: check the double flush */
    public function postProjectAction()
    {
        $user = $this->get('security.context')->getToken()->getUser();
        $request = $this->getRequest();
        
        if( $request->request->has('title') ) {
            $title = $request->request->get('title');
        } else {
            $title='Untitled Zeega';    
        }

        $frame = new MongoFrame();        
        $frame->setEnabled(true);
        $frame->setThumbnailUrl("bananas");

        $layer = new MongoLayer();        
        $layer->setEnabled(true);
        $layer->setText("bananas");

        $sequence = new MongoSequence();
        $sequence->setTitle('Intro Sequence');
        $sequence->setEnabled(true);
        
        $project= new MongoProject();
        $project->setDateCreated(new \DateTime("now"));
        $project->setEnabled(true);
        $project->setPublished(false);
        $project->setAuthors($user->getDisplayName());
        $project->setTitle($title);
        
        $project->addSequences($sequence);
        $project->addFrames($frame);
        $project->addLayers($layer);
        
        $dm = $this->get('doctrine_mongodb')->getManager();

        $dm->persist($project);
        $dm->flush();

        $sequence->setFrames(array($frame->getId()));
        $dm->persist($sequence);
        $dm->flush();

        return new Response($project->getId());
    }

    public function getProjectSequencesFramesAction($projectId,$sequenceId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        
        $project = $dm->createQueryBuilder('ZeegaDataBundle:Project')
                    ->field('id')->equals($projectId)
                    ->field('sequences.id')->equals($sequenceId)
                    ->select('sequences.$')
                    ->getQuery()
                    ->getSingleResult();
        
        $projectView = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($projectView);
    } 

}
