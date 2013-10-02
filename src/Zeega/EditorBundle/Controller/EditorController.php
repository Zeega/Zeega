<?php
namespace Zeega\EditorBundle\Controller;

use Zeega\CoreBundle\Controller\BaseController;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;

class EditorController extends BaseController
{    
    public function newProjectAction()
    {  
        
        $firstTime = $this->getRequest()->query->get("firstTime");

        if(!isset($firstTime)){
            $firstTime = false;
        } else {
            $firstTime = true;
        }

        $this->getRequest()->request->set('version', 1.2);

        $projectId = $this->forward('ZeegaApiBundle:Projects:postProject')->getContent();
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->clear();
        
        return $this->forward('ZeegaEditorBundle:Editor:editor',array('id'=>$projectId, 'newUser' => $firstTime, "newZeega"=>true ));
    }
    
    public function editorAction( $id, $newUser = false, $newZeega = false )
    {   
        /* MOBILE CHECK
        $mobileDetector = $this->get('mobile_detect.mobile_detector');
        $mobileDetector->isMobile();
        $mobileDetector->isTablet();
        */

        //return new Response ( $id . " -- " . $new . " -- " . $newUser);
        $user = $this->get('security.context')->getToken()->getUser();
        
        $dm = $this->get('doctrine_mongodb')->getManager();
        $project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($id);
        
        
        if ( !isset($project) ) {
             return new Response( json_encode(array(
                "code" => 422, 
                "message" => "The project with the id $id does not exist")), 
             422 );
        }

        $this->authorize( $project->getUser()->getId() );

        $editable = $project->getEditable();

        

        if ( $editable === true ) {
            $projectOwners = $project->getUser();       
            $projectData = $this->forward('ZeegaApiBundle:Projects:getProject', array("id" => $id))->getContent();
            $parentProject = $project->getParentProject();


 

            if(!isset($parentProject)){
                $parentProject = null;
                $mediaData = $this->forward('ZeegaApiBundle:Items:getItemsSearch', array(), array("type"=>"Image", "user"=>"51afedf18d34d4d711000000", "limit"=> 48))->getContent();
            } else {
                $parentId = $parentProject->getId();
             //  $mediaData = $this->forward('ZeegaApiBundle:Items:getItemsSearch', array(), array("type"=>"Image", "user"=>"51afedf18d34d4d711000000", "limit"=> 48))->getContent();
                $mediaData = $this->forward('ZeegaApiBundle:Projects:getProjectsItems', array("projectId" => $parentId))->getContent();
            }

            if( $project->getVersion() == 1.2 ) {


                $audioData = $this->forward('ZeegaApiBundle:Items:getItemsSearch', array(), array("type"=>"Audio", "user"=>"51afedf18d34d4d711000000", "limit"=> 1))->getContent();
            

                return $this->render('ZeegaEditorBundle:Editor:editor.html.twig', array(
                    'project'   =>$project,
                    'user' => $user,
                    'project_data' => $projectData,
                    'new_user' => $newUser,
                    'new_zeega' => $newZeega,
                    'media_data' => $mediaData,
                    'audio_data' => $audioData
                ));
            }
            else if($project->getVersion() == 1.1 ){
                return $this->render('ZeegaEditorBundle:Editor:editor_1_1.html.twig', array(
                    'project'   =>$project,
                    'project_data' => $projectData,
                    'new_user' => $newUser
                )); 
            } else {
                 throw new \Exception("This project doesn't exist or cannot be edited");
            }
 
        } else {
            // TO-DO: handle old projects gracefully
            throw new \Exception("This project doesn't exist or cannot be edited");
        }
    }
}
