<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\ApiBundle\Listener;

use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\Security\Core\SecurityContext;
use Symfony\Component\HttpFoundation\Response;

class ApiListener
{
    /** @var \Symfony\Component\Security\Core\SecurityContext */
    private $context;

    public function __construct(SecurityContext $context)
    {
        $this->context = $context;
    }

    public function onKernelRequest(GetResponseEvent $event)
    {
        if (preg_match("/\/api\//",$event->getRequest()->getUri())) {
            $requestUri = $event->getRequest()->getUri();
            $requestMethod = $event->getRequest()->getMethod();

            if ($requestMethod !== "GET") {
                $token = $this->context->getToken();
                if( isset( $token ) ) {
                    $user = $token->getUser();
                    if( !isset( $user ) || "anon." === $user) {
                        if ( !$event->getRequest()->query->has('api_key') ) {

                        $event->setResponse(new Response(json_encode(array(
                            "code" => 401,
                            "message" => "The request requires user authentication")), 
                        401));
                        }
                    }
                }
            }
        }
    }

    public function onKernelResponse(FilterResponseEvent $event)
    {
        if($event->getResponse()->getStatusCode() == 200) {
            if (preg_match("/\/api\//",$event->getRequest()->getUri())) {
                $content = $event->getResponse()->getContent();
                $content = preg_replace("/(\n|\r)*/","",$content);
                $content = preg_replace("/\s\s+/", "",$content);
                $event->getResponse()->setContent($content);
            }
        }
    }
}