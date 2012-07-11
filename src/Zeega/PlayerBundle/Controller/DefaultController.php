<?php

namespace Zeega\PlayerBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


class DefaultController extends Controller
{
    
    public function indexAction($name)
    {
        return $this->render('ZeegaPlayerBundle:Default:index.html.twig', array('name' => $name));
    }
}
