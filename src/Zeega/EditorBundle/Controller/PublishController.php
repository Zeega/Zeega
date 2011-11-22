<?php

namespace Zeega\EditorBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\EditorBundle\Entity\Node;
use Zeega\EditorBundle\Entity\Layer;
use Zeega\UserBundle\Entity\User;


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
     	
     	));
     
     }
	
 

}


