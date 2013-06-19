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
        $frameView = $this->renderView('ZeegaApiBundle:Frames:show.json.twig', array('frame' => $frameAndLayers['frame']));

        return $this->render('ZeegaPublishBundle:Frame:frame.html.twig', array(
            'frameId'=> $frameAndLayers['frame']->getId(),
            'frame'=>$frameView,
            'layers'=>$frameAndLayers['layers']
        ));
    }
     
    public function projectAction($id, $mobile)
    {   

        $project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($id);
        $relatedProjects = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findRelated($id);


        if (null === $project) {
            throw $this->createNotFoundException('The project with the id $id does not exist or is not published.');
        }
        
        // favorites begin - changes here should be replicaded on api/projects/:id
        $user = $this->getUser();
        $favorite = false;
        if ( isset($user) ) {
            $favorite = $this->getDoctrine()->getRepository('ZeegaDataBundle:Favorite')->findOneBy(array(
                'user.id' => $user->getId(),
                'project.id' => $id));
            $favorite = isset($favorite);
        }
        // favorites end
        
        $projectData = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array(
                'project' => $project,
                'favorite' => $favorite
            ));


        // $key = rand( 0, count( $relatedProjects ) );
        // $key2 = rand( 0, count( $relatedProjects - 1 ) );
        // $relProjects[] = $relatedProjects[ $key ];
        // unset( $relatedProjects[ $key ] );
        // $relProjects[] = $relatedProjects[ $key2 ];



        $relatedProjectsData = $this->renderView('ZeegaApiBundle:Projects:index.json.twig', array(
                'projects' => $relatedProjects,
                'request' => null
            ));


        $isProjectMobile = $project->getMobile();
        $projectVersion = $project->getVersion();
        
        if ( null === $projectVersion ) {
            $projectVersion = 1;    
        }

        if ( $mobile ) {
            if ( $projectVersion == 1.2) {
                return $this->render('ZeegaPublishBundle:Player:mobile_player.html.twig', array(                    
                    'project'=>$project,
                    'related_projects_data'=>$relatedProjectsData,
                    'project_data' => $projectData
                                  
                ));            
            } else if( $projectVersion == 1.1 ) {
                return $this->render('ZeegaPublishBundle:Player:mobile_player_1_1.html.twig', array(                    
                    'project'=>$project,
                    'related_projects_data'=>$relatedProjectsData,
                    'project_data' => $projectData     
                ));            
            } else if ( $projectVersion == 1 ) {                
                if( $isProjectMobile ) {
                    
                    return $this->render('ZeegaPublishBundle:Player:mobile_player_1_0.html.twig', array(
                        'project'=>$project,
                        'project_data' => $projectData                
                    ));
                } else {

                    return $this->render('ZeegaPublishBundle:Player:mobile_not_supported.html.twig', array(
                        'project'=>$project                
                    ));                    
                }
            } else{
                throw new \Exception("This project doesn't exist or cannot be played");
            }
        } else {
            if ( $projectVersion == 1.2 ) {
                return $this->render('ZeegaPublishBundle:Player:player.html.twig', array(
                    'project'=>$project,
                    'related_projects_data'=>$relatedProjectsData,
                    'project_data' => $projectData
                ));
            } else if ( $projectVersion == 1.1 ) {
                return $this->render('ZeegaPublishBundle:Player:player_1_1.html.twig', array(
                    'project'=>$project,
                    'related_projects_data'=>$relatedProjectsData,
                    'project_data' => $projectData
                ));
            } else if ( $projectVersion == 1 ) {
                return $this->render('ZeegaPublishBundle:Player:player_1_0.html.twig', array(
                    'project'=>$project,
                    'project_data' => $projectData,
                    'related_projects_data'=>null,
                ));
            } else{
                throw new \Exception("This project doesn't exist or cannot be played");
            }
        }
    }
    
    public function projectRemixAction($id)
    {   
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($id);
        
        $user = $this->getUser();

        if ( !isset($user) ) {
            return parent::getStatusResponse(401);
        }

        $newProjectId = $dm->getRepository('ZeegaDataBundle:Project')->cloneProjectAndGetId($id);
        
        return $this->redirect($this->generateUrl("ZeegaEditorBundle_editor", array("id"=>$newProjectId), true), 301);  
    }

    public function embedAction ($id)
    {
        $project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($id);
        $projectData = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project)); 
        
        if (null === $project || null === $projectData) {
            throw $this->createNotFoundException('The project with the id $id does not exist or is not published.');
        }
        
        $projectVersion = $project->getVersion(); 

        if ( $projectVersion < 1.1) {
            return $this->render('ZeegaPublishBundle:Player:embed_1_0.html.twig', array('project'=>$project));
        } else if( $projectVersion == 1.1 ) {
            return $this->render('ZeegaPublishBundle:Player:embed_1_1.html.twig', array('project'=>$project ));
        } else {
            return $this->render('ZeegaPublishBundle:Player:embed.html.twig', array('project'=>$project ));
        }
    }
}


