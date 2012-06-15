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

    	$layerList = $frame->getLayers();
        $layers = array();
        
        if(isset($layerList))
        {
    	    foreach($layerList as $layer_id)
    	    {
    	        if(isset($layer_id))
    	        {
    	            $layers[] = $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findOneById($layer_id);
    	        }
    	    }
	    }
	    else
	    {
	        $layers = array();
	    }
     	return $this->render('ZeegaCoreBundle:Editor:frame.html.twig', array(
					'frameId'=> $frame->getId(),
					'frame'=>ResponseHelper::serializeEntityToJson($frame),
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
     
     
      public function collectionAction($id){
        $projectData = $this->forward('ZeegaApiBundle:Items:getItemProject', array("id" => $id))->getContent();
        
     	return $this->render('ZeegaCoreBundle:Editor:player.html.twig', array(
     		'projectId'=>0,
     		'project_data'=>$projectData,
     	
     	));
     
     }
	
 

}


