<?php
namespace Zeega\EditorBundle\Controller;

use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\Sequence;
use Zeega\DataBundle\Entity\Project;
use Zeega\DataBundle\Entity\User;
use Zeega\CoreBundle\Controller\BaseController;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;

class EditorController extends BaseController
{    
	public function newProjectAction()
	{  
        if ( $this->container->get('security.context')->isGranted('ROLE_CUTTINGEDGE') ||
        	$this->container->get('security.context')->isGranted('ROLE_EDITOR_V1.1') ) {            
            $this->getRequest()->request->set('version',1.1);
        } 

        $projectId = $this->forward('ZeegaApiBundle:Projects:postProject')->getContent();

        return $this->redirect($this->generateUrl('ZeegaEditorBundle_editor',array('id'=>$projectId)), 301);          
	}
	
	public function editorAction($id)
	{	
		$user = $this->get('security.context')->getToken()->getUser();
		/*		
		$project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($id);

		if ( !isset($project) ) {
			 return new Response( json_encode(array(
			 	"code" => 422, 
			 	"message" => "The project with the id $id does not exist")), 
			 422 );
		}

		$projectOwners = $project->getUsers();
		
		$this->authorize($projectOwners[0]->getId());
		
		$projectVersion = $project->getVersion();

		*/
		$dm = $this->get('doctrine_mongodb')->getManager();
		$project = $dm->getRepository('ZeegaDataBundle:Project')->findOneById($id);

		// new editor
		$userProjects = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findProjectsByUserSmall($user->getId());		
		$projectOwners = $project->getUser();		
		$projectData = $this->forward('ZeegaApiBundle:Projects:getProject', array("id" => $id))->getContent();
		
		return $this->render('ZeegaEditorBundle:Editor:neweditor.html.twig', array(
				'project'   =>$project,
				'project_data' => $projectData,
				'projects' => json_encode($userProjects)
			));	
    }
}
