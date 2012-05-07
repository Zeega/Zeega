<?php

namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\DataBundle\Entity\Layer;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\User;
use Zeega\CoreBundle\Helpers\ResponseHelper;

class LayersController extends Controller
{
    public function getLayersAction()
    {
    } // `get_layers`    [GET] /Layers



    public function postLayersAction()
    {
    	
 
    } // `post_layers`   [POST] /Layers


    public function putLayerAction($layer_id)
    {
    	$em = $this->getDoctrine()->getEntityManager();
     	
    	$layer= $em->getRepository('ZeegaDataBundle:Layer')->find($layer_id);
    	
		$request = $this->getRequest();
    		
    	if($request->request->get('text')) $layer->setText($request->request->get('text'));

		if($request->request->get('attr')) $layer->setAttr($request->request->get('attr'));
    	
    	
		$em->persist($layer);
		$em->flush();
    	//$output=$this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findOneById($layer->getId());
        
    	return ResponseHelper::encodeAndGetJsonResponse($layer);
    } // `put_layer`     [PUT] /layers/{layer_id}


    public function deleteLayerAction($layer_id)
    {
    	$em = $this->getDoctrine()->getEntityManager();
     	$layer= $em->getRepository('ZeegaDataBundle:Layer')->find($layer_id);
    	$em->remove($layer);
    	$em->flush();
    	return new Response('SUCCESS',200);
    
    
    } // `delete_layer`  [DELETE] /layers/{layer_id}

    public function getLayerItemAction($layer_id)
    {
    	
    	return new Response(json_encode($this->getDoctrine()
        ->getRepository('ZeegaDataBundle:Layer')
        ->findItemByLayerId($layer_id)));
    
    } // `get_frame_layers`    [GET] /layers/{layer_id}/item

}
