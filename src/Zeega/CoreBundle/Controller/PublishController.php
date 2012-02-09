<?php

namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\DataBundle\Entity\Frame;
use Zeega\DataBundle\Entity\Layer;
use Zeega\DataBundle\Entity\User;


class PublishController extends Controller
{
    
    public function frameAction($id){
    
     	return $this->render('ZeegaCoreBundle:Editor:frame.html.twig', array(
					'frameId'=>$id,
				));
     }
     
     public function projectAction($id){
     	return $this->render('ZeegaCoreBundle:Editor:player.html.twig', array(
     		'projectId'=>$id,
     		'collectionId'=>0,
     	
     	));
     
     }
     
     
      public function collectionAction($id){
     	return $this->render('ZeegaCoreBundle:Editor:player.html.twig', array(
     		'projectId'=>0,
     		'collectionId'=>$id,
     	
     	));
     
     }
	
 

}


