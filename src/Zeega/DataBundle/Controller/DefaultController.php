<?php

namespace Zeega\DataBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


class DefaultController extends Controller
{
    
    public function indexAction($name)
    {
        return $this->render('ZeegaDataBundle:Default:index.html.twig', array('name' => $name));
    }
}
