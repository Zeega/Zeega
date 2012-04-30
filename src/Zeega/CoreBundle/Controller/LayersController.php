<?php

namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\DataBundle\Entity\Layer;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\User;

class LayersController extends Controller
{
    
    public function getLayersAction()
    {
        $em = $this->getDoctrine()->getEntityManager();
        
        $layers = $em->getRepository('ZeegaDataBundle:Layer')->findAll();
        
        foreach($layers as $layer)
        {
            $attributes = $layer->getAttr();
            
            if(isset($attributes["volume"]) &&  intval($attributes["volume"]) > 0)
            {
                $attributes["volume"] =  intval($attributes["volume"]) / 100;
                $layer->setAttr($attributes);
                $em->persist($layer);
            }
            
            if(isset($attributes["in"]))
            {
                $attributes["cue_in"] = $attributes["in"];
                unset($attributes["in"]);
                $layer->setAttr($attributes);
                $em->persist($layer);
            }

            if(isset($attributes["out"]))
            {
                $attributes["cue_out"] = $attributes["out"];
                unset($attributes["out"]);
                $layer->setAttr($attributes);
                $em->persist($layer);
            }
        }
        $em->flush();
        
        /*
        $em = $this->getDoctrine()->getEntityManager();
        $frames = $em->getRepository('ZeegaDataBundle:Frame')->findAll();
        
        foreach($frames as $frame)
        {
            $attributes = $frame->getAttr();
            
            if(isset($attributes["advance"]))
            {
                if(intval($attributes["advance"]) > 0  && intval($attributes["advance"]) < 500)
                {
                    $attributes["advance"] =  intval($attributes["advance"]) * 1000;
                    $frame->setAttr($attributes);
                    $em->persist($frame);
                }
                else if(intval($attributes["advance"]) == -1000)
                {
                    $attributes["advance"] =  -1;
                    $frame->setAttr($attributes);
                    $em->persist($frame);
                }
            }
        }
        $em->flush();
        */
    } // `get_layers`    [GET] /Layers



    public function postLayersAction()
    {
    	
 
    } // `post_layers`   [POST] /Layers




    public function getLayerAction($layer_id)
    {
    	return new Response(json_encode($this->getDoctrine()
        ->getRepository('ZeegaDataBundle:Layer')
        ->findLayerById($layer_id)));
    
    } // `get_layer`     [GET] /Layers/{layer_id}



    public function putLayerAction($layer_id)
    {
    	
    	$em = $this->getDoctrine()->getEntityManager();
     	
    	$layer= $em->getRepository('ZeegaDataBundle:Layer')->find($layer_id);
    	
		$request = $this->getRequest();
    		
    	if($request->request->get('text')) $layer->setText($request->request->get('text'));

		if($request->request->get('attr')) $layer->setAttr($request->request->get('attr'));
    	
    	
		$em->persist($layer);
		$em->flush();
    	$output=$this->getDoctrine()
        ->getRepository('ZeegaDataBundle:Layer')
        ->findLayerById($layer->getId());
        
        
    	return new Response(json_encode($output[0]));
    	
    	
    
    
    
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