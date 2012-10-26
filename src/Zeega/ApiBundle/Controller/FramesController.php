<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\DataBundle\Entity\Frame;
use Zeega\DataBundle\Entity\Layer;
use Zeega\DataBundle\Entity\User;
use Zeega\CoreBundle\Helpers\ResponseHelper;
use Doctrine\ORM\PersistentCollection;

use Zeega\CoreBundle\Controller\BaseController;

class FramesController extends BaseController
{
    public function getFrameAction($frame_id)
    {
    	$frame = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->findOneById($frame_id);
    	$frameLayers = $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findByMultipleIds($frame->getLayers());
    	$frameView = $this->renderView('ZeegaApiBundle:Frames:show.json.twig', array('frame' => $frame, 'layers' => $frameLayers));
    	return ResponseHelper::compressTwigAndGetJsonResponse($frameView);
    } // `get_frame`     [GET] /frames/{frame_id}

    public function putFrameAction($frame_id)
    {
        $em = $this->getDoctrine()->getEntityManager();
       	$request = $this->getRequest();
       	$frame = $em->getRepository('ZeegaDataBundle:Frame')->find($frame_id);

        $thumbnailUrl = $request->request->get('thumbnail_url');
        $layers = $request->request->get('layers');
        $attr = $request->request->get('attr');

   		if(isset($thumbnailUrl)) {
            $frame->setThumbnailUrl($thumbnailUrl);  
        } else {
            $frame->setThumbnailUrl(NULL);  
        }
		
        if(isset($layers)) {
            $frame->setLayers(array_filter($layers));
        } else {
            $frame->setLayers(NULL);  
        }

   		if(isset($attr)) {
            $frame->setAttr($attr);  
        } else {
            $frame->setAttr(NULL);  
        }

   		$em->persist($frame);
   		$em->flush();

    	$frameLayers = $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findByMultipleIds($frame->getLayers());
    	$frameView = $this->renderView('ZeegaApiBundle:Frames:show.json.twig', array('frame' => $frame, 'layers' => $frameLayers));
    	return ResponseHelper::compressTwigAndGetJsonResponse($frameView);
   	}   // `put_frame`     [PUT] /frames/{frame_id}

    public function deleteFrameAction($frame_id)
    {
    	$em = $this->getDoctrine()->getEntityManager();
     	$frame = $em->getRepository('ZeegaDataBundle:Frame')->findOneById($frame_id);
     	
     	if(isset($frame))
     	{
     	    $frame->setEnabled(false);
     	    $em->persist($frame);
     	    $em->flush();
     	}

    	return new Response('SUCCESS',200);     	
    } 

	public function getFrameLayersAction($frame_id)
    {
        $frame = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->find($frame_id);
        
        if(isset($frame)) {
            $layerList = $frame->getLayers();
        
            if(is_array($layerList) && count($layerList) > 0) {
                $layerList = $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findByMultipleIds($layerList);
            }
        } else {
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


