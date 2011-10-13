<?php

namespace Zeega\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Zeega\UserBundle\Entity\Role;
use Zeega\UserBundle\Entity\User;
use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;



 
class AdminController extends Controller
{
    public function indexAction()
    {
        return $this->render('ZeegaUserBundle:Default:index.html.twig', array('name' => 'bob'));
    }
}
