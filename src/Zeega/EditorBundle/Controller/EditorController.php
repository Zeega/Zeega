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
        $projectId = $this->forward('ZeegaApiBundle:Projects:postProject', array())->getContent();

        return $this->redirect($this->generateUrl('ZeegaEditorBundle_editor',array('id'=>$projectId)), 301);          
	}
	
	public function editorAction($id)
	{	
		$user = $this->get('security.context')->getToken()->getUser();
		
		$project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($id);
		$projectOwners = $project->getUsers();
		
		$this->authorize($projectOwners[0]->getId());
		
		$sequences = $this->getDoctrine()->getRepository('ZeegaDataBundle:Sequence')->findBy(array("project_id" => $id));

		$projectLayers =  $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findBy(array("project_id" => $id));

		$sequence = $sequences[0];
		
        $session = $this->getRequest()->getSession();
		$collection_id = $session->get("collection_id");
		
		if(isset($collection_id)) {
			$params['collection'] = $collection_id;			
			$session->remove("collection_id"); // reads and deletes from session
		} else {
			$collection_id = -1;
		}
		
		$params["r_items"] = 1;
		$params["user"] = -1;
	    $params["data_source"] = "db";
	    $params["sort"] = "date-desc";
	
		$items = $this->forward('ZeegaApiBundle:Search:search', array(), $params)->getContent();

		$projectData = $this->forward('ZeegaApiBundle:Projects:getProject', array("id" => $id))->getContent();
		
		$userCollections = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findUserCollections($user->getId());
		
		return $this->render('ZeegaEditorBundle:Editor:editor.html.twig', array(
				'projecttitle'   => $project->getTitle(),
				'projectid'   =>$project->getId(),
				'project'   =>$project,
				'sequence'=>$sequence,
				'sequences'=>$sequences,
				'projectLayers' => $projectLayers,
           		'page'=>'editor',
				'results' => $items,
				'collection_id' => $collection_id,
				'project_data' => $projectData,
				'user_collections' => $userCollections,
			));
	} 
}
