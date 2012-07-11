<?php

namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\DataBundle\Entity\Frame;
use Zeega\DataBundle\Entity\Layer;
use Zeega\DataBundle\Entity\User;
use Zeega\CoreBundle\Helpers\ResponseHelper;


class PublishController extends Controller
{
    public function frameAction($id)
    {
        $frame = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->find($id);
        $layersId = $frame->getLayers();
        $layers = $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findByMultipleIds($layersId);
        $frameTemplate = $this->renderView('ZeegaApiBundle:Frames:show.json.twig', array('frame'=>$frame, 'layers'=>$layers));

     	return $this->render('ZeegaCoreBundle:Editor:frame.html.twig', array(
					'frameId'=> $frame->getId(),
					'frame'=>$frameTemplate,
					'layers'=>$layers
    	));
     }
     
    public function projectAction($id)
    {
        $projectData = $this->forward('ZeegaApiBundle:Projects:getProject', array("id" => $id))->getContent();

        return $this->render('ZeegaCoreBundle:Editor:player.html.twig', array(
            'projectId'=>$id,
            'project_data' => $projectData
     	));
    }
     
    public function collectionAction($id)
    {
        $projectData = $this->forward('ZeegaApiBundle:Items:getItemProject', array("id" => $id))->getContent();
        
        return $this->render('ZeegaCoreBundle:Editor:player.html.twig', array(
            'projectId'=>0,
            'project_data'=>$projectData,
        ));
    }
     
    public function embedAction ($id)
    {
        $project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($id);

        return $this->render('ZeegaCoreBundle:Editor:embed.html.twig', array('project'=>$project, 'projectId'=>$id));
  	}
}


