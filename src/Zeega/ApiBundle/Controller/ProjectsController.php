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
use Zeega\DataBundle\Document\Tag;
use Zeega\DataBundle\Document\Favorite;

use Zeega\CoreBundle\Controller\BaseController;

class ProjectsController extends BaseController
{
    /**
     * Get a project
     * Route: GET api/projects/:id
     *
     * @return Project|response
     */   
    public function getProjectsSearchAction()
    {   
        $queryParser = $this->get('zeega_query_parser');
        $query = $queryParser->parseRequest($this->getRequest()->query);
        $results = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findByQuery($query);
        $projectView = $this->renderView('ZeegaApiBundle:Projects:index.json.twig', array('projects' => $results, 'request' => array('query'=>$query)));

        return new Response($projectView);
    } 

    public function getProjectsItemsAction($projectId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($projectId);

        if ( !$project ) {
            throw $this->createNotFoundException('Unable to find the Project with the id ' + $projectId);
        }

        $projectLayers = $project->getLayers();
        $projectView = $this->renderView('ZeegaApiBundle:Items:index_layers.json.twig', array('layers' => $projectLayers));
        
        return new Response($projectView);
    }



    public function getProjectsFavoritesAction($projectId)
    {   
        $dm = $this->get('doctrine_mongodb')->getManager();        
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($projectId);

        if ( !$project ) {
            throw $this->createNotFoundException('Unable to find the Project with the id ' + $projectId);
        }

        $favorites = $dm->getRepository('ZeegaDataBundle:Favorite')->findFavoriteUsers($projectId);
        $projectView = $this->renderView('ZeegaApiBundle:Projects:favorites.json.twig', array(
            'project' => $project,
            'favorites' => $favorites
            ));

        return new Response($projectView);
    }  

    /**
     * Get a project
     * Route: GET api/projects/:id
     *
     * @return Project|response
     */   
    public function getProjectAction($id)
    {           
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($id);
        $user = $this->getUser();
        // favorites begin - changes here should be replicaded on the publish controller (/:project_id)
        $favorite = false;
        if ( isset($user) ) {
            $favorite = $dm->getRepository('ZeegaDataBundle:Favorite')->findOneBy(array(
                "user.id" => $user->getId(),
                "project.id" => $project->getId()));
            $favorite = isset($favorite);
        }
        // favorites end
        $projectView = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array(
            'project' => $project,
            'favorite' => $favorite));
        
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
            $project->setTitle($title);
        }

        if( $request->request->has('version')) {
            $version = $request->request->get('version');
        } else {
            $version = 1.1;
        }

        $frame = new MongoFrame();
        $frame->setId(new \MongoId());
        $frame->setEnabled(true);
        $frame->setLayers(array());
        
        $sequence = new MongoSequence();
        $sequence->setEnabled(true);
        $sequence->setFrames(array((string)$frame->getId()));
        
        $project= new MongoProject();
        $project->setDateCreated(new \DateTime("now"));
        $project->setEnabled(true);
        $project->setPublished(false);
        $project->setAuthors($user->getDisplayName());
        $project->setUser($user);
        $project->setMobile(true);
        $project->setVersion($version);
        $project->addSequence($sequence);
        $project->addFrame($frame);
       
	$project->setRemixable(true);
 
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->persist($project);
        $dm->flush();

        return new Response($project->getPublicId());
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
        $estimatedTime = $this->getRequest()->request->get('estimated_time'); 
        $location = $this->getRequest()->request->get('location');
        $description = $this->getRequest()->request->get('description');
        $mobile = $this->getRequest()->request->get('mobile');

        if ( $this->getRequest()->request->has('title') ) {
            $title = $this->getRequest()->request->get('title');
            if ( strlen($title) > 0 ) {
                $project->setTitle($title);
            }
        }

        if( $this->getRequest()->request->has('cover_image') ) {

            if( $project->getCoverImage() != $this->getRequest()->request->get('cover_image') ){
                $thumbnailService = $this->get('zeega_thumbnail');
                $coverImage = $thumbnailService->getItemThumbnail( $this->getRequest()->request->get('cover_image'), 7 );
                $project->setCoverImage( $coverImage );
            }

            
        }

        if( $this->getRequest()->request->has('authors') ) {
            $project->setAuthors( $this->getRequest()->request->get('authors') );
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
            $project->setMobile( $this->getRequest()->request->get('mobile') );
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
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($projectId);
        $project->setEnabled(false);
        $dm->flush();
        return new Response('SUCCESS',200);
    }

    /**
     * Delete a frame
     * Route: Delete api/projects/:id
     *
     * @return Project|response
     */   
    public function deleteFrameAction($projectId, $frameId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($projectId);

        $frames = $project->getFrames();
        foreach($frames as $frame) {
            $currFrameId = $frame->getId();
            if ($currFrameId === $frameId){
                $frames->removeElement($frame);
                break;
            }
        }

        $dm->flush();
        
        return new Response('SUCCESS',200);
    }

    /**
     * Delete a frame
     * Route: Delete api/projects/:id
     *
     * @return Project|response
     */   
    public function deleteLayerAction($projectId, $layerId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($projectId);

        $layers = $project->getLayers();
        foreach($layers as $layer) {
            $currLayerId = $layer->getId();
            if ($currLayerId === $layerId){
                $layers->removeElement($layer);
                break;
            }
        }

        $dm->flush();
        
        return new Response('SUCCESS',200);
    }

    /**
     * Add a tag to a project
     * Route: POST api/projects/:id/tags/:tag
     *
     * @return Project|response
     */   
    public function postProjectsTagsAction($projectId, $tag)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();        
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($projectId);

        if ( !$project ) {
            throw $this->createNotFoundException('Unable to find the Project with the id ' + $projectId);
        }

        $newTag = new Tag();
        $newTag->setName($tag);
        $project->addTag($newTag);
        
        $dm->persist($project);
        $dm->flush();
        
        $projectView = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project));        
        return new Response($projectView);    
    }

    /**
     * Delete a tag from a project
     * Route: DELETE api/projects/:id/tags/:tag
     *
     * @return Project|response
     */   
    public function deleteProjectsTagsAction($projectId, $tag)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();        
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($projectId);

        if ( !$project ) {
            throw $this->createNotFoundException('Unable to find the Project with the id ' + $projectId);
        }

        $projectTags = $project->getTags();

        if( $projectTags->count() > 0 ){
            foreach($projectTags as $t){
                if( $t->getName() == $tag ){
                    $project->removeTag($t);
                }
            }
        }

        $dm->persist($project);
        $dm->flush();
        
        $projectView = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project));        
        return new Response($projectView);    
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
        $request = $request = $this->getRequest()->request->all();
        $sequence = $dm->getRepository('ZeegaDataBundle:Project')->updateProjectSequence($projectId, $sequenceId,$request);        
        $sequenceView = $this->renderView('ZeegaApiBundle:Sequences:show.json.twig', array('sequence' => $sequence));

        return new Response($sequenceView);
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
        $frameQuery = $dm->getRepository('ZeegaDataBundle:Project')->newProjectSequenceFrame($projectId, $sequenceId, $frame);        
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
        $frame = $dm->getRepository('ZeegaDataBundle:Project')->findProjectFrame($projectId, $frameId);
        
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
        $layerQuery = $dm->getRepository('ZeegaDataBundle:Project')->newProjectFrameLayer($projectId, $frameId, $layer);        
        $layer["id"] = (string)$layer["_id"];
        $layerView = $this->renderView('ZeegaApiBundle:Layers:show.json.twig', array('layer' => $layer));

        return new Response($layerView);
    }

    public function postProjectFramesThumbnailAction($projectId, $frameId)
    {
        $thumbnailService = $this->get('zeega_thumbnail');
        $thumbnail = $thumbnailService->getFrameThumbnail($projectId, $frameId);

        if ( isset($thumbnail) ) {
            $dm = $this->get('doctrine_mongodb')->getManager();
            $frame = $dm->getRepository('ZeegaDataBundle:Project')->findProjectFrame($projectId, $frameId);

            if ( !isset($frame) || !$frame instanceof MongoFrame) {
                return null;
            }
            
            $frame->setThumbnailUrl($thumbnail);
            $dm->persist($frame);
            $dm->flush();
        }

        return new Response($thumbnail);        
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
        $project= $dm->getRepository('ZeegaDataBundle:Project')->findOneById($projectId);
        
        //$project->setDateUpdated(new \DateTime("now"));
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
        $project->setPublished(true);
        
        $dm->persist($layer);
        $dm->flush();

        $layerView = $this->renderView('ZeegaApiBundle:Layers:show.json.twig', array('layer' => $layer));

        return new Response($layerView);
    }

    /**
     * Create a global layer
     * Route: POST api/projects/:id/layers
     *
     * @return Layer|response
     */  
    public function postProjectSequencesItemframesAction($sequenceId, $projectId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project= $dm->getRepository('ZeegaDataBundle:Project')->findOneById($projectId);
        
        // create ids for the frame and the layer
        $layerId = new \MongoId();
        $frameId = new \MongoId();
        
        // create the frame, set the id and add the layer
        $frame = new MongoFrame();
        $frame->setId($frameId);
        $frame->setLayers(array((string)$layerId));
        
        // create the layer and set the id
        $layer = new MongoLayer();
        $layer->setId($layerId);
        $layer->setEnabled(true);

        $request = $this->getRequest();

        if ($request->request->has("layer_type")) {
            $layer->setAttr($request->request->all());
            $layer->setType($request->request->get("layer_type"));
            $project->addLayer($layer);    
        }

        // get the sequence and update the frames
        $sequence = $project->getSequences()->filter(
            function($seq) use ($sequenceId){
                return $seq->getId() == $sequenceId;
            }
        )->first();
        $sequenceFrames = $sequence->getFrames();
        array_push($sequenceFrames, (string)$frameId);
        $sequence->setFrames($sequenceFrames);

        // add the frame and the layer to the project; publish the project
        $project->addFrame($frame);
        $project->setPublished(true);

        $dm->persist($project);
        $dm->flush();
        
        $frame->setId((string)$frameId); // hack to properly display ids on the view; don't flush after this

        $frameView = $this->renderView('ZeegaApiBundle:Frames:show.json.twig', array('frame' => $frame));

        return new Response($frameView);
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
        $layer = $dm->getRepository('ZeegaDataBundle:Project')->findProjectLayer($projectId, $layerId);

        $text = $this->getRequest()->request->get('text');
        $attributes = $this->getRequest()->request->get('attr');

        if( isset($text) ) {
            $layer->setText($text);
        } 

        if( isset($attributes) ) {
            $layer->setAttr($attributes);
        }
        $dm->persist($layer);
        $dm->flush();

        $layerView = $this->renderView('ZeegaApiBundle:Layers:show.json.twig', array('layer' => $layer));
        
        return new Response($layerView);
    }

    public function postProjectsFavoriteAction($projectId)
    {   
        $user = $this->get('security.context')->getToken()->getUser();
        if( !isset($user) ) {
            return parent::getStatusResponse(401);   
        }

        $dm = $this->get('doctrine_mongodb')->getManager();        
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($projectId);

        if ( !$project ) {
            throw $this->createNotFoundException('Unable to find the Project with the id ' + $projectId);
        }
        
        $projectId = $project->getId();

        $favorite = $dm->getRepository('ZeegaDataBundle:Favorite')->findOneBy(array(
            "user.id" => $user->getId(),
            "project.id" => $projectId));

        if ( !isset($favorite) ) {
            $favorite = new Favorite();
            $favorite->setUser($user);
            $favorite->setProject($project);

            $dm->persist($favorite);
            $dm->flush();

            
            $projectUserEmail = $project->getUser()->getEmail();
            $projectUsername = $project->getUser()->getUsername();
            $projectCoverImage = $project->getCoverImage();
            $projectUserNotificationsEnabled = $project->getUser()->getEmailNotificationsOnFavorite();
            $favoriteUsername = $user->getUsername();
            $favoriteDisplayName = $user->getDisplayName();

            if ( isset($projectUserEmail) && $projectUserNotificationsEnabled === true ) {
                $host = $this->container->getParameter('hostname');
                $hostDirectory = $this->container->getParameter('directory');
                $emailData = array(
                    "to" => $projectUserEmail,
                    "from" => array("noreply@zeega.com" => "Zeega"),
                    "subject" => "$favoriteDisplayName favorited one of your Zeegas!",
                    "template_data" => array(
                        "displayname" => $favoriteDisplayName, 
                        "username" => $favoriteUsername,
                        "coverimage" => $projectCoverImage,
                        "zeega" => "http:".$host.$hostDirectory.$project->getPublicId(),
                        "host" => "http:".$host.$hostDirectory
                    )
                );
                $templateNumber = rand(1, 5);
                $mailer = $this->get('zeega_email');
                $mailer->sendEmail("favorite-email-$templateNumber", $emailData);
            }
        }
        
        $projectView = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project));
        
        return new Response($projectView);
    }

    public function postProjectsUnfavoriteAction($projectId)
    {   
        $user = $this->get('security.context')->getToken()->getUser();
        if( !isset($user) ) {
            return parent::getStatusResponse(401);   
        }
        
        $dm = $this->get('doctrine_mongodb')->getManager();        
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($projectId);

        if ( !$project ) {
            throw $this->createNotFoundException('Unable to find the Project with the id ' + $projectId);
        }
        
        $projectId = $project->getId();

        $favorite = $dm->getRepository('ZeegaDataBundle:Favorite')->findOneBy(array(
            "user.id" => $user->getId(),
            "project.id" => $projectId));

        if ( isset($favorite) ) {            
            $dm->remove($favorite);
            $dm->flush();
        }
        
        $projectView = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project));
        
        return new Response($projectView);
    }
}
