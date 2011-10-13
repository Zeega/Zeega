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
        $manager=$this->getDoctrine()->getEntityManager();
        $role = new Role();
        $role->setName('ROLE_ADMIN');
 
        $manager->persist($role);
 		 $manager->flush();
        // create a user
        $user = new User();
        $user->setFirstName('John');
        $user->setLastName('Doe');
        $user->setEmail('john@example.com');
        $user->setUsername('john');
        $user->setSalt(md5(time()));
 
        // encode and set the password for the user,
        // these settings match our config
        $encoder = new MessageDigestPasswordEncoder();
        $password = $encoder->encodePassword('password', $user->getSalt());
        $user->setPassword($password);
 
        $user->getUserRoles()->add($role);
 
        $manager->persist($user);
         $manager->flush();
        
        return $this->render('ZeegaUserBundle:Default:index.html.twig', array('name' => $name));
    }
}
