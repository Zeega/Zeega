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

use Symfony\Component\HttpFoundation\Response;
use Zeega\DataBundle\Document\Project as MongoProject;
use Zeega\DataBundle\Document\Sequence as MongoSequence;
use Zeega\DataBundle\Document\Frame as MongoFrame;
use Zeega\DataBundle\Document\Layer as MongoLayer;

use Zeega\CoreBundle\Controller\BaseController;

class ProjectsController extends BaseController
{
    /**
     * Get a project
     * Route: GET api/projects/:id
     *
     * @return Project|response
     */   
    public function getProjectAction($id)
    {   
        $user = $this->get('security.context')->getToken()->getUser();
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project = $dm->getRepository('ZeegaDataBundle:Project')->find($id);
        $projectView = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project));
        
        return new Response($projectView);
    } 

    /**
     * Create a new project
     * Route: POST api/projects
     *
     * @return Project id|response
     */   
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
        $frame->setLayers(array());
        
        $sequence = new MongoSequence();
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

        return new Response($project->getId());
    }

    /**
     * Update a project
     * Route: PUT api/projects/:id
     *
     * @return Project|response
     */   
    public function putProjectsAction($projectId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();        
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($projectId);

        if ( !$project ) {
            throw $this->createNotFoundException('Unable to find the Project with the id ' + $projectId);
        }

        // update date_published
        
        $tags = $this->getRequest()->request->get('tags');
        $coverImage = $this->getRequest()->request->get('cover_image');
        $authors = $this->getRequest()->request->get('authors');
        $published = $this->getRequest()->request->get('published');
        $estimatedTime = $this->getRequest()->request->get('estimated_time'); 
        $location = $this->getRequest()->request->get('location');
        $description = $this->getRequest()->request->get('description');
        $publishUpdate = $this->getRequest()->request->get('publish_update');
        $mobile = $this->getRequest()->request->get('mobile');

        if ( $this->getRequest()->request->has('title') ) {
            $title = $this->getRequest()->request->get('title');
            if ( strlen($title) > 0 ) {
                $project->setTitle($title);
            }
        }

        if( $this->getRequest()->request->has('cover_image') ) {
            $project->setCoverImage( $this->getRequest()->request->get('authors') );
        }

        if( $this->getRequest()->request->has('authors') ) {
            $project->setAuthors( $this->getRequest()->request->get('authors') );
        }

        if( $this->getRequest()->request->has('published') ) {
            $project->setPublished( $this->getRequest()->request->get('published') );
        } 

        if( $this->getRequest()->request->has('estimated_time') ) {
            $project->setEstimatedTime( $this->getRequest()->request->get('estimated_time') );
        }

        if( $this->getRequest()->request->has('location') ) {
            $project->setLocation( $this->getRequest()->request->get('location') );
        }

        if( $this->getRequest()->request->has('description') ) {
            $project->setDescription( $this->getRequest()->request->get('description') );
        }

        if( $this->getRequest()->request->has('mobile') ) {
            $project->setMobile( $this->getRequest()->request->set('mobile') );
        }

        $dm->persist($project);
        $dm->flush();
        
        $projectView = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project));        
        return new Response($projectView);    
    }

    /**
     * Delete a project
     * Route: Delete api/projects/:id
     *
     * @return Project|response
     */   
    public function deleteProjectAction($projectId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($id);
        $project->setEnabled(false);
        $dm->flush();
        return new Response('SUCCESS',200);
    }

    /**
     * Update a sequence
     * Route: PUT api/projects/:id/sequences/:seq_id
     *
     * @return Sequence|response
     */   
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
    }

    /**
     * Create a frame
     * Route: POST api/projects/:id/sequences/:seq_id/frames
     *
     * @return Frame|response
     */   
    public function postProjectSequencesFramesAction($projectId, $sequenceId)
    {
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

        return new Response($frameView);
    }  

    /**
     * Update a frame
     * Route: PUT api/projects/:id/frames/:frame_id
     *
     * @return Frame|response
     */   
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
        
        return new Response($frameView);
    }

    /**
     * Create a layer for a frame
     * Route: POST api/projects/:id/frames/:frame_id/layers
     *
     * @return Layer|response
     */   
    public function postProjectFramesLayersAction($projectId, $frameId)
    {
        $request = $this->getRequest();
        $layer = array();
        $layer["_id"] = new \MongoId();
        $layer["enabled"] = true;

        if($request->request->has("type")) {
            $layer["type"] = $request->request->get("type");
        } 
        
        if($request->request->has('text')) {
            $layer["text"] = $request->request->get('text');   
        }

        if($request->request->has('attr')) {
            $layer["attr"] = $request->request->get('attr');
        }

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

        return new Response($layerView);
    }

    /**
     * Create a global layer
     * Route: POST api/projects/:id/layers
     *
     * @return Layer|response
     */  
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

        return new Response($layer);
    }

    /**
     * Update a layer
     * Route: PUT api/projects/:id/frames/:frame_id/layers/:layer_id
     *
     * @return Layer|response
     */   
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
        
        $layer->getQuery()->execute();
        $layerView = $this->renderView('ZeegaApiBundle:Layers:show.json.twig', array('layer' => $layer));
        
        return new Response($layerView);
    }
}
