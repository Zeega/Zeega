<?php

namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


class DefaultController extends Controller
{
    
    public function indexAction($name)
    {
        return $this->render('ZeegaApiBundle:Default:index.html.php', array('name' => gettype($this->getRequest())));
    }
}
