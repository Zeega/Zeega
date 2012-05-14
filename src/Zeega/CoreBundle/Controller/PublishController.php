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

    	$layerList = $frame->getLayers()->toArray();
    
     	return $this->render('ZeegaCoreBundle:Editor:frame.html.twig', array(
					'frameId'=> $frame->getId(),
					'frame'=>ResponseHelper::serializeEntityToJson($frame),
					'layers'=>ResponseHelper::serializeEntityToJson($layerList)
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
     
     
      public function collectionAction($id){
     	return $this->render('ZeegaCoreBundle:Editor:player.html.twig', array(
     		'projectId'=>0,
     		'collectionId'=>$id,
     	
     	));
     
     }
	
 

}


