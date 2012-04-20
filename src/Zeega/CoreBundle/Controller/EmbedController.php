<?php
//test
namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

class EmbedController extends Controller
{
    
 
 	public function indexAction ($id){
 	
 		$project = $this->getDoctrine()
						->getRepository('ZeegaDataBundle:Project')
						->findOneById($id);

 		return $this->render('ZeegaCoreBundle:Editor:embed.html.twig', array(
					'project'=>$project,
					'projectId'=>$id,
					
				));
 	
 	}
    

}