<?php
namespace Zeega\EditorBundle\Controller;

use Zeega\CoreBundle\Controller\BaseController;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;

class EditorController extends BaseController
{    
    public function newProjectAction( $newUser = false )
    {  
        
        $this->getRequest()->request->set('version', 1.2);

        $projectId = $this->forward('ZeegaApiBundle:Projects:postProject')->getContent();
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->clear();
        
        return $this->forward('ZeegaEditorBundle:Editor:editor',array('id'=>$projectId, 'newUser' => $newUser ));
    }
    
    public function editorAction( $id, $newUser = false )
    {   

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
            if( $project->getVersion() == 1.2 ) {
                return $this->render('ZeegaEditorBundle:Editor:editor.html.twig', array(
                    'project'   =>$project,
                    'user' => $user,
                    'project_data' => $projectData,
                    'new_user' => $newUser
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
