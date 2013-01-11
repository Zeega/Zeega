<?php

namespace Zeega\SocialBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('ZeegaSocialBundle:Default:index.html.twig', array('name' => $name));
    }
}
