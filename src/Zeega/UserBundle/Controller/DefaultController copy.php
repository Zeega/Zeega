<?php

namespace Zeega\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Zeega\UserBundle\Entity\Role;
use Zeega\UserBundle\Entity\User;
use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;

class DefaultController extends Controller
{
    
    public function indexAction($name)
    {
    
    	 // create the ROLE_ADMIN role
    	 
    	 $repository = $this->getDoctrine()
    ->getRepository('ZeegaUserBundle:User');
    
    
        $user = $repository->findOneById(1);
        $role = $user->getRoles();
     
        $name=$role[0]->getRole();
        return $this->render('ZeegaUserBundle:Default:index.html.twig', array('name' => $name));
    }
}
