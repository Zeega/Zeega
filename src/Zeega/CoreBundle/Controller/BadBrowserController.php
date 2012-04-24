<?php
//test
namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

class BadBrowserController extends Controller
{
    
 
 	public function indexAction (){
 	
 		

 		return $this->render('ZeegaCoreBundle:Editor:badbrowser.html.twig');
 	
 	}
    

}