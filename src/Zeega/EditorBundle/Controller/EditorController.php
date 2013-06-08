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
        
        $this->getRequest()->request->set('version', 1.2);

        $projectId = $this->forward('ZeegaApiBundle:Projects:postProject')->getContent();

        return $this->redirect($this->generateUrl('ZeegaEditorBundle_editor',array('id'=>$projectId)), 301);          
    }
    
    public function editorAction($id)
    {   
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
        $userProjectsCount = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findProjectsCountByUser( $user->getId() );
        
        if ( $userProjectsCount == 1  && !$project->getPublished() ) {
            $newUser = true;
        } else {
            $newUser = false;
        }

        $editable = $project->getEditable();

        if ( $editable === true ) {
            $projectOwners = $project->getUser();       
            $projectData = $this->forward('ZeegaApiBundle:Projects:getProject', array("id" => $id))->getContent();
        
            if($project->getVersion() == 1.1 ){
                return $this->render('ZeegaEditorBundle:Editor:editor_1_1.html.twig', array(
                    'project'   =>$project,
                    'project_data' => $projectData,
                    'new_user' => $newUser
                )); 
            } else {
                return $this->render('ZeegaEditorBundle:Editor:editor.html.twig', array(
                    'project'   =>$project,
                    'project_data' => $projectData,
                    'new_user' => $newUser
                ));
            }

             
        } else {
            // TO-DO: handle old projects gracefully
            throw new \Exception("This project doesn't exist or cannot be edited");
        }
    }
}
