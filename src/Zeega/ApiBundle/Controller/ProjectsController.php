<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.com>
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
    // GET api/projects/:id
    public function getProjectAction($id)
    {   
        $user = $this->get('security.context')->getToken()->getUser();
        $dm = $this->get('doctrine_mongodb')->getManager();

        $project = $dm->getRepository('ZeegaDataBundle:Project')->find($id);
        /*
        $project = $dm->createQueryBuilder('ZeegaDataBundle:Project')
            ->find()
            ->field('id')->equals($id)
            ->getQuery()
            ->getSingleResult();
        */
        
        //return new Response(json_encode($project));

        $projectView = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($projectView);
    } 

    // POST api/projects
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
        $frame->setLayers(array());
        
        $sequence = new MongoSequence();
        $sequence->setTitle('Intro Sequence');
        $sequence->setEnabled(true);
        
        $project= new MongoProject();
        $project->setDateCreated(new \DateTime("now"));
        $project->setEnabled(true);
        $project->setPublished(false);
        $project->setAuthors($user->getDisplayName());
        $project->setTitle($title);
        
        $project->addSequence($sequence);
        $project->addFrame($frame);
        
        $dm = $this->get('doctrine_mongodb')->getManager();

        $dm->persist($project);
        $dm->flush();

        $sequence->setFrames(array($frame->getId()));
        $dm->persist($sequence);
        $dm->flush();

        return new Response($project->getId());
    }
    
    // POST api/projects/:id/layers
    public function postProjectSequencesFramesAction($projectId, $sequenceId)
    {
        /*
        db.Project.update({_id:ObjectId("51616b4720d5cdbb30000000"), 
            'frames._id':ObjectId("515df03920d5cd2b1b000002")},
            {$push: {frames.$.layers: "test"}, {"layers":{"_id":{"$id":"515df04720d5cd4e1b000001"},"enabled":true}})
        */
        $request = $this->getRequest();
        $frame = array();
        $frame["_id"] = new \MongoId();
        $frame["layers"] = array();
        
        if ($request->request->has('thumbnail_url')) {
            $frame["thumbnailUrl"] = $request->request->get('thumbnail_url');  
        } 

        if ($request->request->has('attr')) {
            $frame["attr"] = $request->request->get('attr');  
        } 

        if ($request->request->has('layers')) {
            $frame["layers"] = $request->request->get('layers');  
        } 

        if ($request->request->has('layers_to_persist')) {
            $frame["layers"] = $request->request->get('layers_to_persist');    
        }

        $dm = $this->get('doctrine_mongodb')->getManager();
        $frameQuery = $dm->createQueryBuilder('ZeegaDataBundle:Project')
            ->update()
            ->field('id')->equals($projectId)
            ->field('sequences.id')->equals($sequenceId)
            ->field('sequences.$.frames')->push((string)$frame["_id"])
            ->field('frames')->push($frame)
            ->getQuery()
            ->execute();
        $frame["id"] = (string)$frame["_id"];
        $frameView = $this->renderView('ZeegaApiBundle:Frames:show.json.twig', array('frame' => $frame));

        return ResponseHelper::compressTwigAndGetJsonResponse($frameView);
    }  

    public function postProjectFramesLayersAction($projectId, $frameId)
    {
        $request = $this->getRequest();
        $layer = array();
        $layer["_id"] = new \MongoId();
        
        if($request->request->has("type")) {
            $layer["type"] = $request->request->get("type");
        } 
        
        if($request->request->has('text')) {
            $layer["text"] = $request->request->get('text');   
        }

        if($request->request->has('attr')) {
            $layer["attr"] = $request->request->get('attr');
        }

        $layer["enabled"] = true;

        $dm = $this->get('doctrine_mongodb')->getManager();
        $layerQuery = $dm->createQueryBuilder('ZeegaDataBundle:Project')
            ->update()
            ->field('id')->equals($projectId)
            ->field('frames.id')->equals($frameId)
            ->field('frames.$.layers')->push((string)$layer["_id"])
            ->field('layers')->push($layer)
            ->getQuery()
            ->execute();
        
        $layer["id"] = (string)$layer["_id"];
        
        $layerView = $this->renderView('ZeegaApiBundle:Layers:show.json.twig', array('layer' => $layer));

        return ResponseHelper::compressTwigAndGetJsonResponse($layerView);
    }

    // put_collections_items   PUT    /api/collections/{projectId}/items.{_format}
    public function putProjectsAction($projectId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();        
        $project = $dm->getRepository('ZeegaDataBundle:Project')->find($projectId);

        if ( !$project ) {
            throw $this->createNotFoundException('Unable to find the Project with the id ' + $projectId);
        }

        // update date_published
        $title = $this->getRequest()->request->get('title');
        $tags = $this->getRequest()->request->get('tags');
        $coverImage = $this->getRequest()->request->get('cover_image');
        $authors = $this->getRequest()->request->get('authors');
        $published = $this->getRequest()->request->get('published');
        $estimatedTime = $this->getRequest()->request->get('estimated_time'); 
        $location = $this->getRequest()->request->get('location');
        $description = $this->getRequest()->request->get('description');
        $publishUpdate = $this->getRequest()->request->get('publish_update');
        $mobile = $this->getRequest()->request->get('mobile');

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
 
        $dm->persist($project);
        $dm->flush();
		
		if ( (isset($publishUpdate)&&$publishUpdate) ) {			
            // if this project is not represented in the item table
            if ( is_null($project->getItemId()) ) {
				// create new item
				// should this be a call to ItemsController->populateItemWithRequestData, so as not to set Item data outside the ItemsController ?
				$user = $this->get('security.context')->getToken()->getUser();
				$host = "http://" . $this->getRequest()->getHost() . "/";

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
				$item->setAttributionUri($host);
				$item->setPublished(true);
                $item->setEnabled(true);
                
				$em->persist($item);
				$em->flush();
				
				$item->setAttributionUri($host.$item->getId());
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
        
            $project_http = $this->forward('ZeegaApiBundle:Projects:getProject', array("id" => $projectId));

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

    public function putProjectSequencesAction($projectId, $sequenceId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        
        $sequence = $dm->createQueryBuilder('ZeegaDataBundle:Project')
            ->findAndUpdate()
            ->returnNew()
            ->field('id')->equals($projectId)
            ->field('sequences.id')->equals($sequenceId)
            ->field('sequences.id')->equals($sequenceId);
            
        $request = $this->getRequest();
        if( $this->getRequest()->request->has('frames') ) {
            $frames = $this->getRequest()->request->get('frames');
            $sequence->field('sequences.$.frames')->set( array_filter($frames) );
        } else {
            $sequence->field('sequences.$.frames')->set( null );
        }

        if($request->request->has('title')) {
            $sequence->field('sequences.$.title')->set( $request->request->get('title') );
        }

        if($request->request->has('attr')) {
            $sequence->field('sequences.$.attr')->set( $request->request->get('attr') );
        }
            
        if($request->request->has('persistent_layers')) {
            $sequence->field('sequences.$.persistentLayers')->set( $request->request->get('persistent_layers') );
        }
        
        if($request->request->has('description')) {
            $sequence->field('sequences.$.description')->set( $request->request->get('description') );
        }

        if($request->request->has('advance_to')) {
            $sequence->field('sequences.$.advanceTo')->set( $request->request->get('advance_to') );
        }
        
        $sequence
            ->field('sequences.$.dateUpdated')->set(new \DateTime("now"))
            ->getQuery()
            ->execute();

        $frameView = $this->renderView('ZeegaApiBundle:Sequences:show.json.twig', array('sequence' => $sequence));

        return ResponseHelper::compressTwigAndGetJsonResponse($frameView);
    } // `post_sequence_layers`   [POST] /sequences

    public function putProjectFramesAction($projectId, $frameId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project = $dm->createQueryBuilder('ZeegaDataBundle:Project')
                    ->field('id')->equals($projectId)
                    ->select('frames')
                    ->getQuery()
                    ->getSingleResult();

        if ( !isset($project) || !$project instanceof MongoProject) {
            return new Response("Project does not exist");
        } 

        $frames = $project->getFrames();
        $frame = $project->getFrames()->filter(
            function($fram) use ($frameId){
                return $fram->getId() == $frameId;
            }
        )->first();
        
        if ( !isset($frame) || !$frame instanceof MongoFrame) {
            return new Response("Frame does not exist");  
        }

        $thumbnailUrl = $this->getRequest()->request->get('thumbnail_url');
        $layers = $this->getRequest()->request->get('layers');
        $attr = $this->getRequest()->request->get('attr');

        if(isset($thumbnailUrl)) {
            $frame->setThumbnailUrl($thumbnailUrl);  
        } else {
            $frame->setThumbnailUrl(NULL);  
        }
        
        if(isset($layers)) {
            $frame->setLayers(array_filter($layers));
        } else {
            $frame->setLayers(NULL);  
        }

        if(isset($attr)) {
            $frame->setAttr($attr);  
        } else {
            $frame->setAttr(NULL);  
        }

        $dm->persist($frame);
        $dm->persist($project);
        $dm->flush();

        $frameView = $this->renderView('ZeegaApiBundle:Frames:show.json.twig', array('frame' => $frame));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($frameView);
    } // `post_sequence_layers`   [POST] /sequences

    public function putProjectLayersAction($projectId, $layerId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        
        $layer = $dm->createQueryBuilder('ZeegaDataBundle:Project')
            ->findAndUpdate()
            ->returnNew()
            ->field('id')->equals($projectId)
            ->field('layers.id')->equals($layerId);
        
        $text = $this->getRequest()->request->get('text');
        $attributes = $this->getRequest()->request->get('attr');

        if( isset($text) ) {
            $layer->field('layers.$.text')->set($text);
        } else {
            $layer->field('layers.$.text')->set(null);
        }

        if( isset($attributes) ) {
            $layer->field('layers.$.attr')->set($attributes);
        } else {
            $layer->field('layers.$.attr')->set(null);
        }
        
        $layer->getQuery()
            ->execute();


        $layerView = $this->renderView('ZeegaApiBundle:Layers:show.json.twig', array('layer' => $layer));
        
        return new Response($layerView);
    } // `put_layer`     [PUT] /layers/{layer_id}


    // DELETE] /projects/{projectId}
    public function deleteProjectAction($projectId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($id);
        $project->setEnabled(false);
        $dm->flush();
        return new Response('SUCCESS',200);
    }

    public function postProjectLayersAction($projectId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project= $dm->getRepository('ZeegaDataBundle:Project')->find($projectId);
        
        $project->setDateUpdated(new \DateTime("now"));
        $layer = new MongoLayer();
        
        $request = $this->getRequest();
        if( $request->request->get("type") ) {
            $layer->setType($request->request->get("type"));  
        } 

        if($request->request->get('text')) {
            $layer->setText($request->request->get('text'));
        }
            
        if($request->request->has('attr')) {
            $attributes = $request->request->get('attr');
            $layer->setAttr($attributes);
        }

        $layer->setEnabled(true);
        $project->addLayer($layer);
        
        $dm->persist($layer);
        $dm->flush();

        return ResponseHelper::encodeAndGetJsonResponse($layer);
    } // `post_sequence_layers` [POST] /sequences

    public function getProjectCloneAction($projectId) 
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project = $dm->createQueryBuilder('ZeegaDataBundle:Project')
            ->field("id")->equals($projectId)
            ->hydrate(false)
            ->getQuery()
            ->execute();
        print_r($project);
        return new Response();
        $newProject = clone $project;
        $project->setId(null);
        $dm->persist($newProject);
        $dm->flush();
        return new Response($project->getId(),200);   
    }
}
