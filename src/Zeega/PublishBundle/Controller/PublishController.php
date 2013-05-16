<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\PublishBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Zeega\CoreBundle\Controller\BaseController;

class PublishController extends BaseController
{
    public function frameAction($projectId, $frameId)
    {
        $frameAndLayers = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findProjectFrameWithLayers($projectId, $frameId);
        $frameView = $this->renderView('ZeegaApiBundle:Frames:show.json.twig', array('frame' => $frameAndLayers["frame"]));

        return $this->render('ZeegaPublishBundle:Frame:frame.html.twig', array(
            'frameId'=> $frameAndLayers["frame"]->getId(),
            'frame'=>$frameView,
            'layers'=>$frameAndLayers["layers"]
        ));
    }
     
    public function projectAction($id, $mobile)
    {       
        $project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($id);
        $projectData = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project));

        if (null === $project) {
            throw $this->createNotFoundException("The project with the id $id does not exist or is not published.");
        }

        $isProjectMobile = $project->getMobile();
        $projectVersion = $project->getVersion();
        
        if ( null === $projectVersion ) {
            $projectVersion = 1;    
        }
        
        if ( $mobile ) {
            if( $isProjectMobile ){
                if ( $projectVersion < 1.1) {                
                    return $this->render('ZeegaPublishBundle:Player:mobile_player.html.twig', array(
                        'project'=>$project,
                        'project_data' => $projectData                
                    ));
                } else {
                    return $this->render("ZeegaPublishBundle:Player:mobile_player_1_0.html.twig", array(
                        "project"=>$project,
                        "project_data" => $projectData,                
                    ));            
                }
            } else {
                return $this->render('ZeegaPublishBundle:Player:mobile_not_supported.html.twig', array(
                    'project'=>$project                
                ));
            }    
        } else {
            if ( $projectVersion < 1.1) {
                return $this->render('ZeegaPublishBundle:Player:player_1_0.html.twig', array(
                    'project'=>$project,
                    'project_data' => $projectData
                ));
            } else {
                return $this->render('ZeegaPublishBundle:Player:player.html.twig', array(
                    'project'=>$project,
                    'project_data' => $projectData
                ));
            }
        }
    }

    public function projectPreviewAction($id)
    { 
        $project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($id);
        $projectData = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project));

        return $this->render("ZeegaPublishBundle:Player:player.html.twig", array(
            "project"=>$project,
            "project_data" => $projectData,
        ));
    }

     
    public function collectionAction($id)
    {
        $projectData = $this->forward("ZeegaApiBundle:Items:getItemProject", array("id" => $id))->getContent();
        $project = new Project();
        return $this->render("ZeegaPublishBundle:Player:player.html.twig", array(
            "project"=>$project,
            "project_data"=>$projectData,
        ));
    }


    public function channelAction($tag)
    {

        $params = array();
        //$params["data_source"] = "db";
        $params["sort"] = "date-desc";
        $params["type"] = "project";
        $params["tags"] = $tag;
        $projectData = $this->forward("ZeegaApiBundle:Items:getItemsSearch", array(), $params)->getContent();
        $project = new Project();

        return $this->render("ZeegaPublishBundle:Player:channel.html.twig", array(
            "project"=>$project,
            "project_data"=>$projectData,
        ));
    }
     
    public function embedAction ($id)
    {
        $projectItem = $this->getDoctrine()->getRepository("ZeegaDataBundle:Item")->findOneByIdWithUser($id);

        if(null !== $projectItem) {
            if($projectItem["mediaType"]=="project") {
                $projectData = $projectItem["text"];
            } 
        } 
        
        if (null === $projectItem || null === $projectData) {
            throw $this->createNotFoundException("The project with the id $id does not exist or is not published.");
        }



        $projectDataArray = json_decode($projectData, true);
            
        if( isset( $projectDataArray["version"] ) ){
           $projectVersion = $projectDataArray["version"]; 
        } else {
            $projectVersion = 1;
        }
        if ( $projectVersion < 1.1) {
            $project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findOneById($id);
            if(is_object($project)&&$project->getMediaType()=='project'){}
            else  $project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($id);

            $request = $this->getRequest();
            $author = $request->query->get('author');

            return $this->render('ZeegaPublishBundle:Player:embed_1_0.html.twig', array('project'=>$project, 'projectId'=>$id,'author'=>$author));
        } else {
            return $this->render("ZeegaPublishBundle:Player:embed.html.twig", array("project"=>$projectItem ));
        }
    }
}


