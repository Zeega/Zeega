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
use Zeega\DataBundle\Entity\Sequence;
use Zeega\DataBundle\Entity\User;
use Zeega\CoreBundle\Helpers\ResponseHelper;

class SequencesController extends Controller
{
    /* TEMP - moved from Core and needs to be refactored */
    public function postSequencesAction()
    {
    	$em=$this->getDoctrine()->getEntityManager();
		$request = $this->getRequest();


		//$title=$request->request->get('title');
		$sequence= new Sequence();
		$request = $this->getRequest();
    	if($request->request->get('title')) $sequence->setTitle($request->request->get('title'));
    	else $sequence->setTitle('Untitled: '.date('l F j, Y h:i:s A'));
    	$em->persist($sequence);
    	$em->flush();
		$output=$this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->findOneById($sequence->getId());
			
		return new Response(json_encode($output[0]));
        
    } // `post_sequences`   [POST] /sequences


    public function getSequenceAction($sequence_id)
    {
    	$sequence = $this->getDoctrine()->getRepository('ZeegaDataBundle:Sequence')->findOneById($sequence_id);
    	
    	if(isset($sequence))
    	{
    	    $sequenceFrames = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->findIdBySequenceId($sequence->getId());
            $sequenceView = $this->renderView('ZeegaApiBundle:Sequences:show.json.twig', array('sequence' => $sequence, 'sequence_frames' => $sequenceFrames));
            return ResponseHelper::compressTwigAndGetJsonResponse($sequenceView);
    	}
        
        return new Response("{}");
    } // `get_sequence`     [GET] /sequences/{sequence_id}



    public function putSequenceAction($sequence_id)
    {
    	$request = $this->getRequest();
      	$em = $this->getDoctrine()->getEntityManager();
     	$sequence= $em->getRepository('ZeegaDataBundle:Sequence')->find($sequence_id);
    	if($request->request->get('title'))$sequence->setTitle($request->request->get('title'));
    	if($request->request->get('attr'))$sequence->setAttr($request->request->get('attr'));
        if($request->request->get('persistent_layers'))$sequence->setPersistentLayers($request->request->get('persistent_layers'));
    	$em->flush();

        if($request->request->get('frames'))
        {
            $frames = $request->request->get('frames');
            $i = 0;
            $s = count($frames);
            foreach($frames as $frameId)
            {
                $frame=$em->getRepository('ZeegaDataBundle:Frame')->find($frameId);
                $frame->setSequenceIndex($i);
                $em->persist($frame);
                $i++;
            }
            $em->flush();
        }
        
		$em->persist($sequence);
		$em->flush();
		
		$sequenceFrames = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->findIdBySequenceId($sequence_id);		
    	$sequenceView = $this->renderView('ZeegaApiBundle:Sequences:show.json.twig', array('sequence' => $sequence, 'sequence_frames' => $sequenceFrames));

        return ResponseHelper::compressTwigAndGetJsonResponse($sequenceView);
    } // `put_sequence`     [PUT] /sequences/{sequence_id}



    public function deleteSequenceAction($sequence_id)
    {
    
    	$em = $this->getDoctrine()->getEntityManager();
     	$sequence= $em->getRepository('ZeegaDataBundle:Sequence')->find($sequence_id);
        $sequence->setEnabled(false);
        $em->persist($sequence);
    	$em->flush();
    	return new Response('SUCCESS',200);
    
    
    } // `delete_sequence`  [DELETE] /sequences/{sequence_id}

    public function getSequenceFramesAction($sequence_id)
    {
    		
    		return new Response(json_encode($this->getDoctrine()
        				->getRepository('ZeegaDataBundle:Frame')
        				->findFramesBySequenceId($sequence_id)));
    
    } // `get_sequence_frames`    [GET] /sequences/{sequence_id}/Frames


  
	public function postSequenceFramesAction($sequence_id)
    {
		$em=$this->getDoctrine()->getEntityManager();
		$request = $this->getRequest();
		$sequence= $em->getRepository('ZeegaDataBundle:Sequence')->find($sequence_id);
		
    	if($request->request->get('duplicate_id'))
    	{
    		$original_frame = $this->getDoctrine()
        				           ->getRepository('ZeegaDataBundle:Frame')
        				           ->find($request->request->get('duplicate_id'));
    	
			$frame = new Frame();
			$frame->setSequence($sequence);
			
			if($request->request->get('thumbnail_url')) $frame->setThumbnailUrl($request->request->get('thumbnail_url'));	
			if($original_frame->getAttr()) $frame->setAttr($original_frame->getAttr());

			$original_layers=$original_frame->getLayers();
			
			if($original_layers)
			{
        		foreach($original_layers as $original_layer_id){
        				$layer= new Layer();
    					$sequence->addLayer($layer);
    					
        				$original_layer=$this->getDoctrine()
        					->getRepository('ZeegaDataBundle:Layer')
        					->find($original_layer_id);
        				
						if($original_layer->getItem()) $layer->setItem($original_layer->getItem());
						if($original_layer->getType()) $layer->setType($original_layer->getType());
						if($original_layer->getText()) $layer->setText($original_layer->getText());
						if($original_layer->getAttr()) $layer->setAttr($original_layer->getAttr());
						
						$em->persist($layer);
						$em->flush();
        				$frame_layers[]=$layer->getId();	
        		}
        		$frame->setLayers($frame_layers);
			}
			$em->persist($sequence);
			$em->persist($frame);
			$em->flush();
			return ResponseHelper::encodeAndGetJsonResponse($frame);
		}
		else
		{
			$frame= new Frame();
			$frame->setSequence($sequence);
			if($request->request->get('thumbnail_url'))$frame->setThumbnailUrl($request->request->get('thumbnail_url'));
			if($request->request->get('attr')) $frame->setAttr($request->request->get('attr'));
			if($request->request->get('layers')) $frame->setLayers($request->request->get('layers'));
            $frame->setEnabled(true);
			$em = $this->getDoctrine()->getEntityManager();
			$em->persist($frame);
			$em->flush();
			
			return  ResponseHelper::encodeAndGetJsonResponse($frame);
		}
    
    
    } // `post_sequence_frames`   [POST] /sequences/{sequence_id}/frames



	/** `get_sequence_layers`    [GET] /sequences/{sequence_id}/layers */

    public function getSequenceLayersAction($sequence_id)
    {
    	$output=array();
    	$sequence=$this->getDoctrine()
        				->getRepository('ZeegaDataBundle:Sequence')
        				->find($sequence_id);
        				
        if($sequence)
        {
        	$layers=$sequence->getLayers()->toArray();
        	foreach($layers as $layer)
        	{
        	    $output[] = $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findOneById($layer->getId());
        	}
        }
        
		return new Response(json_encode($output));
	}

	  public function postSequenceLayersAction($sequence_id)
    {
    	$em = $this->getDoctrine()->getEntityManager();
     	$sequence= $em->getRepository('ZeegaDataBundle:Sequence')->find($sequence_id);
    	
    	$layer= new Layer();
    	
		$request = $this->getRequest();
    	
    	$sequence->addLayer($layer);
    	
    	
    	
    	if($request->request->get('item_id')){
			$layer->setItem($this->getDoctrine()
			->getRepository('ZeegaItemBundle:Item')
			->find($request->request->get('item_id')));
			
		}
		
		if($request->request->get("type")) $layer->setType($request->request->get("type"));   	
    	
    	if($request->request->get('text')) $layer->setText($request->request->get('text'));
    	
		if($request->request->get('attr')) $layer->setAttr($request->request->get('attr'));
    	
    	
		$em->persist($layer);
		$em->persist($sequence);
		$em->flush();
    	$output = $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findOneById($layer->getId());
        
    	return ResponseHelper::encodeAndGetJsonResponse($output);
    } // `post_sequence_layers`   [POST] /sequences/{sequence_id}/layers
}
