<?php

namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\DataBundle\Entity\Frame;
use Zeega\DataBundle\Entity\Layer;
use Zeega\DataBundle\Entity\User;
use Zeega\CoreBundle\Helpers\ResponseHelper;
use Doctrine\ORM\PersistentCollection;

class FramesController extends Controller
{
    public function getFrameAction($frame_id)
    {
    	$frame = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->findOneById($frame_id);
    	//return new Response(json_encode($frame));
    	$frameView = $this->renderView('ZeegaApiBundle:Frames:show.json.twig', array('frame' => $frame));
    	return ResponseHelper::compressTwigAndGetJsonResponse($frameView);
    } // `get_frame`     [GET] /frames/{frame_id}

    public function putFrameAction($frame_id)
    {
        $em=$this->getDoctrine()->getEntityManager();
       	$request = $this->getRequest();
       	$frame=$em->getRepository('ZeegaDataBundle:Frame')->find($frame_id);

   		if($request->request->get('thumbnail_url')) $frame->setThumbnailUrl($request->request->get('thumbnail_url'));
   		if($request->request->get('layers')) $frame->setLayers($request->request->get('layers'));
   		if($request->request->get('attr')) $frame->setAttr($request->request->get('attr'));

   		$em->persist($frame);
   		$em->flush();

   		$frameView = $this->renderView('ZeegaApiBundle:Frames:show.json.twig', array('frame' => $frame));
    	return ResponseHelper::compressTwigAndGetJsonResponse($frameView);
   	}   // `put_frame`     [PUT] /frames/{frame_id}

    public function deleteFrameAction($frame_id)
    {
    	$em = $this->getDoctrine()->getEntityManager();
     	$frame = $em->getRepository('ZeegaDataBundle:Frame')->findOneById($frame_id);
     	
     	if(isset($frame))
     	{
    	    $em->remove($frame);
    	    $em->flush();
        }
    	
    	return new Response('SUCCESS',200);
    } 

	public function getFrameLayersAction($frame_id)
    {
        $frame = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->find($frame_id);
        
        if(isset($frame))
        {
            $layerList = $frame->getLayers()->toArray();
        
            if(is_array($layerList) && count($layerList) > 0)
            {
                $layerList = $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findByMultipleIds($layerList);
            }
        }
        else
        {
            $layerList = array();
        }

		$frameView = $this->renderView('ZeegaApiBundle:Layers:index.json.twig', array('layers' => $layerList));

    	return ResponseHelper::compressTwigAndGetJsonResponse($frameView);
    } 
    
    public function postFrameThumbnailAction($frame_id)
    {
    	$em = $this->getDoctrine()->getEntityManager();
    	$frame = $em->getRepository('ZeegaDataBundle:Frame')->find($frame_id);
		exec('/opt/webcapture/webpage_capture -t 50x50 -crop ' .$this->container->getParameter('hostname') .$this->container->getParameter('directory') .'frame/'.$frame_id.'/view '.$this->container->getParameter('path').'images/frames',$output);
		$url = explode(":".$this->container->getParameter('web_directory'),$output[4]);
		$frame->setThumbnailUrl($this->container->getParameter('hostname') . $url[1]);
		$em->persist($frame);
		$em->flush();
    	return new Response($this->container->getParameter('hostname') . $url[1]);		
    }
}


