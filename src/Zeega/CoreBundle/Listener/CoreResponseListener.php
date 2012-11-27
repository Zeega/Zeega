<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

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
                $event->getResponse()->headers->setCookie(new Cookie('zauth', '1'));
            } else {
                $event->getResponse()->headers->setCookie(new Cookie('zauth', '0'));
            }            
        }
    }
}