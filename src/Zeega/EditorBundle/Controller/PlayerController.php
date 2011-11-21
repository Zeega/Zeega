<?php
//test
namespace Zeega\EditorBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Zeega\EditorBundle\Entity\Item;
use Zeega\EditorBundle\Entity\Route;
use Zeega\EditorBundle\Entity\Project;
use Zeega\EditorBundle\Entity\Playground;
use Zeega\EditorBundle\Entity\Node;
use Zeega\UserBundle\Entity\User;
use Zeega\EditorBundle\Form\Type\UserType;
use Zeega\EditorBundle\Form\Type\PlaygroundType;
use Zeega\EditorBundle\Form\Type\PasswordType;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;
class PlayerController extends Controller
{
    
 
 	public function playAction ($routeId){
 	
 	
 	return $this->render('ZeegaEditorBundle:Editor:player.html.twig', array(
					routeId:$routeId,
					
				));
 	
 	}
    

}