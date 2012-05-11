<?php

namespace Zeega\CoreBundle\Controller;

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
    
   
    
     public function getFramesAction()
    {
    

    
    } // `get_frames`    [GET] /frames



    public function postFramesAction()
    {
    
    
    	
        
    } // `post_frames`   [POST] /frames

 
    public function getFrameAction($frame_id)
    {
    
    	return new Response(json_encode($this->getDoctrine()
        		->getRepository('ZeegaDataBundle:Frame')
        		->findById($frame_id)));
        
    
    } // `get_frame`     [GET] /frames/{frame_id}



    public function putFrameAction($frame_id)
    {
    	$em=$this->getDoctrine()->getEntityManager();
    	$request = $this->getRequest();
    	$frame=$em->getRepository('ZeegaDataBundle:Frame')->find($frame_id);
    	
		if($request->request->get('thumbnail_url')) $frame->setThumbnailUrl($request->request->get('thumbnail_url'));
		if($request->request->get('layers')) 
		{
		    $currLayers = $frame->getLayers();
		    foreach($request->request->get('layers') as $layer)
		    {
				$layer = $em->getRepository('ZeegaDataBundle:Layer')->find($layer);
				if(isset($layer))
{	
			    if(!$currLayers->contains($layer))
			    {
		            $frame->addLayer($layer);
		        }
}
		    }
		}
		
		    
		if($request->request->get('attr')) $frame->setAttr($request->request->get('attr'));
		
		$em->persist($frame);
		$em->flush();
		
		return ResponseHelper::encodeAndGetJsonResponse($em->getRepository('ZeegaDataBundle:Frame')->findById($frame_id));        

    }
    // `put_frame`     [PUT] /frames/{frame_id}




	/** `delete_frame`  [DELETE] /frames/{frame_id}  */

    public function deleteFrameAction($frame_id){
    
    	$em = $this->getDoctrine()->getEntityManager();
     	$frame= $em->getRepository('ZeegaDataBundle:Frame')->find($frame_id);
     	
    	$em->remove($frame);
    	$em->flush();
    	return new Response('SUCCESS',200);
    } 

	

	 public function getFrameLayersAction($frame_id)
    {
    		
    		$frame=$this->getDoctrine()
        				->getRepository('ZeegaDataBundle:Frame')
        				->find($frame_id);
        	
        	$layerList=$frame->getLayers();
        	
        	foreach($layerList as $layer_id)
        	{
        	    $l = $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findOneById($layer_id);
        	    if(count($l) > 0) 
        	    {
        	        $layers[]=$l[0];
        	    }
        	}
    		return new Response(json_encode($layers));
    } 
    
    
     public function postFrameThumbnailAction($frame_id)
    {
    	$em=$this->getDoctrine()->getEntityManager();
    	$frame=$em->getRepository('ZeegaDataBundle:Frame')->find($frame_id);
		exec('/opt/webcapture/webpage_capture -t 50x50 -crop ' .$this->container->getParameter('hostname') .$this->container->getParameter('directory') .'frame/'.$frame_id.'/view '.$this->container->getParameter('path').'images/frames',$output);
		$url=explode(":".$this->container->getParameter('web_directory'),$output[4]);
		$frame->setThumbnailUrl($this->container->getParameter('hostname') . $url[1]);
		$em->persist($frame);
		$em->flush();
		
    	return new Response($this->container->getParameter('hostname') . $url[1]);		
        
    }
	
	
 

}


