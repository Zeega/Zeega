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

        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($id);
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
        //$project->addLayers($layer);
        
        $dm = $this->get('doctrine_mongodb')->getManager();

        $dm->persist($project);
        $dm->flush();

        $sequence->setFrames(array($frame->getId()));
        $dm->persist($sequence);
        $dm->flush();

        return new Response($project->getId());
    }

    // POST api/projects/:id/sequences
    public function postProjectSequencesAction($projectId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        $request = $this->getRequest();
        $project= $dm->getRepository('ZeegaDataBundle:Project')->find($projectId);        
        $project->setDateUpdated(new \DateTime("now"));
        
        $sequence = new MongoSequence();

        $frame = new MongoFrame();
        
        if($request->request->has('layers_to_persist'))
        {
            $layersToPersist = $request->request->get('layers_to_persist');
            $frame->setLayers($layersToPersist);
        }
        else if($request->request->has('frame_id'))
        {
            $frameId = $request->request->get('frame_id');
            $previousframe = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->find($frameId);

            $previousFrameLayers = $previousframe->getLayers();
            $frame->setLayers($previousFrameLayers);
        }

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
    
    // POST api/projects/:id/layers
    public function postProjectFramesAction($projectId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project= $dm->getRepository('ZeegaDataBundle:Project')->find($projectId);
        $project->setDateUpdated(new \DateTime("now"));

        $layer = new MongoLayer();
        
        $request = $this->getRequest();
        $frame = new MongoFrame();
        
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

        $project->addFrames($frame);

        $dm->persist($frame);
        $dm->flush();        

        $frameView = $this->renderView('ZeegaApiBundle:Frames:show.json.twig', array('frame' => $frame));

        return ResponseHelper::compressTwigAndGetJsonResponse($frameView);

    }  

    // POST api/projects/:id/layers
    public function postProjectLayersAction($projectId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project= $dm->getRepository('ZeegaDataBundle:Project')->find($projectId);
        $project->setDateUpdated(new \DateTime("now"));

        $layer = new MongoLayer();
        
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
                // TO-DO
                /*
                $item = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->find($attributes["id"]);
                if ( isset($item) ) {
                    $layer->setItem($item);    
                }
                */
            }
        }

        $layer->setEnabled(true);
        $project->addLayers($layer);
        
        $dm->persist($layer);
        $dm->flush();
        
        // TO-DO - response
        return ResponseHelper::encodeAndGetJsonResponse($layer);
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

    public function putProjectSequencesAction($projectId, $sequenceId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        
        /* wanted doen't work for updates 
        $project = $dm->createQueryBuilder('ZeegaDataBundle:Project')
                        ->field('id')->equals($projectId)
                        ->field('sequences.id')->equals($sequenceId)
                        ->select('sequences.$sequenceId')
                        ->getQuery()
                        ->getSingleResult();
        */
        $project = $dm->createQueryBuilder('ZeegaDataBundle:Project')
                        ->field('id')->equals($projectId)
                        ->getQuery()
                        ->getSingleResult();

        if ( !isset($project) || !$project instanceof MongoProject) {
            return new Response("Document does not exist");
        } 

        $sequence = $project->getSequences()->filter(
            function($seq) use ($sequenceId){
                return $seq->getId() == $sequenceId;
            }
        )->first();
        
        if ( !isset($sequence) || !$sequence instanceof MongoSequence) {
            return new Response("Sequence does not exist");  
        }

        $request = $this->getRequest();
        if( $this->getRequest()->request->has('frames') ) {
            $frames = $this->getRequest()->request->get('frames');
            $sequence->setFrames( array_filter($frames) );
        } else {
            $sequence->setFrames(NULL);  
        }
        
        $project->setDateUpdated(new \DateTime("now"));

        $dm->persist($sequence);
        $dm->flush();

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

        $dm->persist($project);
        $dm->flush();

        $frameView = $this->renderView('ZeegaApiBundle:Frames:show.json.twig', array('frame' => $frame));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($frameView);
    } // `post_sequence_layers`   [POST] /sequences

    // DELETE] /projects/{projectId}
    public function deleteProjectAction($projectId)
    {
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($id);
        $project->setEnabled(false);
        $dm->flush();
        return new Response('SUCCESS',200);
    }
}
