<?php

namespace Zeega\CommunityBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class EventsController extends Controller
{
    public function tribecahacksAction()
    {
        return $this->render('ZeegaCommunityBundle:Events:tribecahacks.html.twig');
    }  
}
