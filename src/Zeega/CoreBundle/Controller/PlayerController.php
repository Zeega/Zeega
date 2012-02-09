<?php
//test
namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\Sequence;
use Zeega\DataBundle\Entity\Project;
use Zeega\DataBundle\Entity\Site;
use Zeega\DataBundle\Entity\Frame;
use Zeega\DataBundle\Entity\User;
use Zeega\CoreBundle\Form\Type\UserType;
use Zeega\CoreBundle\Form\Type\SiteType;
use Zeega\CoreBundle\Form\Type\PasswordType;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;
class PlayerController extends Controller
{
    
 
 	public function playAction ($sequenceId){
 	
 	
 	return $this->render('ZeegaCoreBundle:Editor:player.html.twig', array(
					sequenceId:$sequenceId,
					
				));
 	
 	}
    

}