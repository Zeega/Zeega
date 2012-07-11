<?php

namespace Zeega\DiscoveryBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


class DefaultController extends Controller
{
    
    public function indexAction($name)
    {
        return $this->render('ZeegaDiscoveryBundle:Default:index.html.twig', array('name' => $name));
    }
}
