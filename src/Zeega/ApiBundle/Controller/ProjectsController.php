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
		// very inefficient method
		// needs to be indexed (i.e. SOLR indexed) for published projects; OK for the editor (only called once when the editor is loaded)
		
		$user = $this->get('security.context')->getToken()->getUser();

		$project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($id);
		$sequences = $this->getDoctrine()->getRepository('ZeegaDataBundle:Sequence')->findBy(array("project_id" => $id));
		$frames = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->findByProjectId($id);
		$layers = $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findBy(array("project_id" => $id));
		
		$sequenceFrames = array();
		
		foreach($sequences as $sequence)
		{
			$sequenceId = $sequence->getId();
			$sequenceFrames[$sequenceId] = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->findIdBySequenceId($sequenceId);
		}
		
		$projectView = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project, 
			'sequences' => $sequences, 'sequence_frames' => $sequenceFrames, 'layers' => $layers, 'frames' => $frames));
		
    	return ResponseHelper::compressTwigAndGetJsonResponse($projectView);
    } 
    
    // put_collections_items   PUT    /api/collections/{project_id}/items.{_format}
    public function putProjectsAction($projectId)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $request = $this->getRequest();
        $request_data = $this->getRequest()->request;        
        
		$project = $em->getRepository('ZeegaDataBundle:Project')->find($projectId);

        if (!$project) 
        {
            throw $this->createNotFoundException('Unable to find the Item with the id ' + $projectId);
        }

		$title = $request_data->get('title');
		$attr = $request_data->get('attr');
        $tags = $request_data->get('tags');
		$published = $request_data->get('published');
        
		if(isset($title)) $project->setTitle($title);
		if(isset($attr)) $project->setAttr($attr);
		if(isset($tags)) $project->setTags($tags);
		if(isset($published)) $project->setPublished($published);

        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($project);
        $em->flush();
        
        $projectView = $this->renderView('ZeegaApiBundle:Projects:show.json.twig', array('project' => $project));
        return ResponseHelper::compressTwigAndGetJsonResponse($projectView);       
    }
}
