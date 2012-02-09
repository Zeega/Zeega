<?php
//test
namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\Route;
use Zeega\DataBundle\Entity\Project;
use Zeega\DataBundle\Entity\Playground;
use Zeega\DataBundle\Entity\Node;
use Zeega\DataBundle\Entity\User;
use Zeega\CoreBundle\Form\Type\UserType;
use Zeega\CoreBundle\Form\Type\PlaygroundType;
use Zeega\CoreBundle\Form\Type\PasswordType;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;
class PlayerController extends Controller
{
    
 
 	public function playAction ($routeId){
 	
 	
 	return $this->render('ZeegaCoreBundle:Editor:player.html.twig', array(
					routeId:$routeId,
					
				));
 	
 	}
    

}