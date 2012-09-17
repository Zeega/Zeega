<?php

namespace Zeega\CoreBundle\Listener;

use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\Security\Core\SecurityContext;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie;

class CoreResponseListener
{
    /** @var \Symfony\Component\Security\Core\SecurityContext */
    private $context;

    public function __construct(SecurityContext $context)
    {
        $this->context = $context;
    }

    public function onKernelResponse(FilterResponseEvent $event)
    {
        $request = $event->getRequest();

        //  this doesn't work on login/logout:
        //  $this->get('security.context')->getToken()->getUser();

        $token = $this->context->getToken();
        
        if(isset($token)) {
            $user = $token->getUser();
            if("anon." !== $user) {
                $event->getResponse()->headers->set('zeega-auth','authenticated');
            } else {
                $event->getResponse()->headers->set('zeega-authe','bam');
            }            
        }
    }
}