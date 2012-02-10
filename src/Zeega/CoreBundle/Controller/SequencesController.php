<?php

namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\DataBundle\Entity\Frame;
use Zeega\DataBundle\Entity\Layer;
use Zeega\DataBundle\Entity\Sequence;
use Zeega\DataBundle\Entity\User;

class SequencesController extends Controller
{
    
      public function getSequencesAction()
    {

    /*
    	$sequence= new Sequence();
    	
    	
    	$sequence->setTitle('Untitled');
		$em=$this->getDoctrine()->getEntityManager();
		$em->persist($sequence);
		$em->flush();
    	return new Response(json_encode($this->getDoctrine()
        ->getRepository('ZeegaDataBundle:Sequence')
        ->findSequenceById($sequence->getId())));
       */
    
    
    
    } // `get_sequences`    [GET] /sequences



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
		$output=$this->getDoctrine()
			->getRepository('ZeegaDataBundle:Frame')
			->findSequenceById($sequence->getId());
			
		return new Response(json_encode($output[0]));
        
    } // `post_sequences`   [POST] /sequences


    public function getSequenceAction($sequence_id)
    {
    	$sequences=$this->getDoctrine()
        ->getRepository('ZeegaDataBundle:Sequence')
        ->findSequenceById($sequence_id);
    	
		//removes falsy values from the return
		for($i = 0 ; $i < count($sequences) ; $i++)
		{
			foreach($sequences[0] as $key => $value)
			{
				if( is_null( $value )) unset($sequences[$i][$key]);
				
			}
		}
		
		return new Response(json_encode($sequences[0]));
        
    
    } // `get_sequence`     [GET] /sequences/{sequence_id}



    public function putSequenceAction($sequence_id)
    {
    	$request = $this->getRequest();
      	$em = $this->getDoctrine()->getEntityManager();
     	$sequence= $em->getRepository('ZeegaDataBundle:Sequence')->find($sequence_id);
    	if($request->request->get('title'))$sequence->setTitle($request->request->get('title'));
    	if($request->request->get('attr'))$sequence->setAttr($request->request->get('attr'));
		$em->flush();
		
		if($request->request->get('framesOrder')){

		$frames=$request->request->get('framesOrder');

		$i=0;
		$s=count($frames);
		foreach($frames as $frameId){
			
			$frame=$em->getRepository('ZeegaDataBundle:Frame')
        		->find($frameId);
        		
        		
        	$frame->setSequenceIndex($i);
        	$em->persist($frame);
			$i++;
		}
		
		$em->flush();
		
		}
		
    	return new Response('SUCCESS',200);
    } // `put_sequence`     [PUT] /sequences/{sequence_id}



    public function deleteSequenceAction($sequence_id)
    {
    
    	$em = $this->getDoctrine()->getEntityManager();
     	$sequence= $em->getRepository('ZeegaDataBundle:Sequence')->find($sequence_id);
    	$em->remove($sequence);
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
		
    	if($request->request->get('duplicate_id')){
    	
    		$original_frame =$this->getDoctrine()
        				->getRepository('ZeegaDataBundle:Frame')
        				->find($request->request->get('duplicate_id'));
    	
			$frame= new Frame();
			$frame->setSequence($sequence);
			if($request->request->get('thumb_url')) $frame->setThumbUrl($request->request->get('thumb_url'));	
			if($original_frame->getAttr()) $frame->setAttr($original_frame->getAttr());

			$original_layers=$original_frame->getLayers();
			if($original_layers){
				
        		foreach($original_layers as $original_layer_id){
        				$layer= new Layer();
    					$sequence->addLayers($layer);
    					
        				$original_layer=$this->getDoctrine()
        					->getRepository('ZeegaDataBundle:Layer')
        					->find($original_layer_id);
        				
						if($original_layer->getItem()) $layer->setItem($original_layer->getItem());
						if($original_layer->getItemUri()) $layer->setUri($original_layer->getUri());
						if($original_layer->getType()) $layer->setMediaType($original_layer->getType());
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
			$output=$this->getDoctrine()
			->getRepository('ZeegaDataBundle:Frame')
			->findFrameById($frame->getId());
			return new Response(json_encode($output[0]));
		}
		else{
			$frame= new Frame();
			$frame->setSequence($sequence);
			if($request->request->get('thumb_url'))$frame->setThumbUrl($request->request->get('thumb_url'));
			if($request->request->get('attr')) $frame->setAttr($request->request->get('attr'));

			$em=$this->getDoctrine()->getEntityManager();
			$em->persist($frame);
			$em->flush();
			$output=$this->getDoctrine()
				->getRepository('ZeegaDataBundle:Frame')
				->findFrameById($frame->getId());
			return new Response(json_encode($output[0]));
		}
    
    
    } // `post_sequence_frames`   [POST] /sequences/{sequence_id}/frames



	/** `get_sequence_layers`    [GET] /sequences/{sequence_id}/layers */

    public function getSequenceLayersAction($sequence_id)
    {
    	$output=array();
    	$sequence=$this->getDoctrine()
        				->getRepository('ZeegaDataBundle:Sequence')
        				->find($sequence_id);
        				
        if($sequence){
        
        	$layers=$sequence->getLayers()->toArray();
        	foreach($layers as $layer){
        	
        	$l=$this->getDoctrine()
        				->getRepository('ZeegaDataBundle:Layer')
        				->findLayerById($layer->getId());
        	$output[]=$l[0];
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
    		$layer->setItemUri($this->getDoctrine()
			->getRepository('ZeegaItemBundle:Item')
			->findItemById($request->request->get('item_id'))->getUrl());
			$layer->setItem($this->getDoctrine()
			->getRepository('ZeegaItemBundle:Item')
			->find($request->request->get('item_id')));
			
		}
		
		if($request->request->get("media_type")) $layer->setMediaType($request->request->get("media_type"));   	
    	
    	if($request->request->get('text')) $layer->setText($request->request->get('text'));
    	
		if($request->request->get('attr')) $layer->setAttr($request->request->get('attr'));
    	
    	
		$em->persist($layer);
		$em->persist($sequence);
		$em->flush();
    	$output=$this->getDoctrine()
        ->getRepository('ZeegaDataBundle:Layer')
        ->findLayerById($layer->getId());
        
        
    	return new Response(json_encode($output[0]));
    
    
    
    } // `post_sequence_layers`   [POST] /sequences/{sequence_id}/layers

	
	

}
