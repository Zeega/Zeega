<?php
namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

use Zeega\DataBundle\Entity\Item;
use Zeega\CoreBundle\Helpers\ItemCustomNormalizer;
use Zeega\CoreBundle\Helpers\ResponseHelper;

class ProjectsController extends Controller
{
    //  get_collections GET    /api/collections.{_format}
    public function getProjectAction($id)
    {	
	
		$user = $this->get('security.context')->getToken()->getUser();

		$sequences = $this->getDoctrine()
						  ->getRepository('ZeegaDataBundle:Sequence')
						  ->findSequencesByProject($id);

		$project = $this->getDoctrine()
						->getRepository('ZeegaDataBundle:Project')
						->findOneById($id);
		
		$layers = $this->getDoctrine()
						->getRepository('ZeegaDataBundle:Sequence')
						->findByProject($project->getId());
		
		$projectView = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project, 'sequences' => $sequences, 'layers' => $layers));
		
    	return ResponseHelper::compressTwigAndGetJsonResponse($projectView);
    } 

    //  get_collections GET    /api/collections.{_format}
    public function getProjectsAction()
    {
    } 

}
