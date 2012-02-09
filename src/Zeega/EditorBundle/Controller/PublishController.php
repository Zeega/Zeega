<?php

namespace Zeega\EditorBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\DataBundle\Entity\Node;
use Zeega\DataBundle\Entity\Layer;
use Zeega\DataBundle\Entity\User;


class PublishController extends Controller
{
    
    public function nodeAction($id){
    
     	return $this->render('ZeegaEditorBundle:Editor:node.html.twig', array(
					'nodeId'=>$id,
				));
     }
     
     public function projectAction($id){
     	return $this->render('ZeegaEditorBundle:Editor:player.html.twig', array(
     		'projectId'=>$id,
     		'collectionId'=>0,
     	
     	));
     
     }
     
     
      public function collectionAction($id){
     	return $this->render('ZeegaEditorBundle:Editor:player.html.twig', array(
     		'projectId'=>0,
     		'collectionId'=>$id,
     	
     	));
     
     }
	
 

}


