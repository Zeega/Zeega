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

        if (null === $project) {
            throw $this->createNotFoundException("The project with the id $id does not exist or is not published.");
        }

        // favorites begin - changes here should be replicaded on api/projects/:id
        $user = $this->getUser();
        $favorite = false;
        if ( isset($user) ) {
            $favorite = $this->getDoctrine()->getRepository('ZeegaDataBundle:Favorite')->findOneBy(array(
                "user.id" => $user->getId(),
                "project.id" => $id));
            $favorite = isset($favorite);
        }
        // favorites end
        $projectData = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array(
            'project' => $project,
            'favorite' => $favorite));

        $isProjectMobile = $project->getMobile();
        $projectVersion = $project->getVersion();
        
        if ( null === $projectVersion ) {
            $projectVersion = 1;    
        }

        if ( $mobile ) {
            if ( $projectVersion < 1.1) {                
                if( $isProjectMobile ) {
                    
                    return $this->render("ZeegaPublishBundle:Player:mobile_player_1_0.html.twig", array(
                        'project'=>$project,
                        'project_data' => $projectData                
                    ));
                } else {

                    return $this->render('ZeegaPublishBundle:Player:mobile_not_supported.html.twig', array(
                        'project'=>$project                
                    ));                    
                }
            } else {
                return $this->render('ZeegaPublishBundle:Player:mobile_player.html.twig', array(                    
                    "project"=>$project,
                    "project_data" => $projectData,                
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
     
    public function embedAction ($id)
    {
        $project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($id);
        $projectData = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project)); 
        
        if (null === $project || null === $projectData) {
            throw $this->createNotFoundException("The project with the id $id does not exist or is not published.");
        }
        
        $projectVersion = $project->getVersion(); 

        if ( $projectVersion < 1.1) {
            return $this->render('ZeegaPublishBundle:Player:embed_1_0.html.twig', array('project'=>$project));
        } else {
            return $this->render("ZeegaPublishBundle:Player:embed.html.twig", array("project"=>$project ));
        }
    }
}


