<?php

namespace Zeega\CommunityBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class ExtrasController extends Controller
{
    public function makedayAction()
    {
        return $this->render('ZeegaCommunityBundle:Makeday:makeday.html.twig');
    }  
}
