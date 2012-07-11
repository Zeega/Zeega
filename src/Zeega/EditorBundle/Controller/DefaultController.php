<?php

namespace Zeega\EditorBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


class DefaultController extends Controller
{
    
    public function indexAction($name)
    {
        return $this->render('ZeegaEditorBundle:Default:index.html.twig', array('name' => $name));
    }
}
