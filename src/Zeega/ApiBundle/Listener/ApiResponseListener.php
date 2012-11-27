<?php

namespace Zeega\ApiBundle\Listener;

use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\Security\Core\SecurityContext;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie;

class ApiResponseListener
{
    public function onKernelResponse(FilterResponseEvent $event)
    {
        if (preg_match("/\/api\//",$event->getRequest()->getUri())) {
            $content = $event->getResponse()->getContent();
            $event->getResponse()->setContent(preg_replace("/(\n|\r|\s)*/","",$event->getResponse()->getContent()));
        }
    }
}