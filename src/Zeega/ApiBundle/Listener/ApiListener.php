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
use Symfony\Component\HttpKernel\Kernel;

use FOS\Rest\Decoder\DecoderProviderInterface;

class ApiListener
{
    /** @var \Symfony\Component\Security\Core\SecurityContext */
    private $context;
    /** @var \Symfony\Component\HttpKernel\Kernel */
    private $kernel;
    /** @var DecoderProviderInterface */
    private $decoderProvider;

    public function __construct(SecurityContext $context, Kernel $kernel, DecoderProviderInterface $fos_decoder)
    {
        $this->context = $context;
        $this->kernel = $kernel;
        $this->decoderProvider = $fos_decoder;
    }

    public function onKernelRequest(GetResponseEvent $event)
    {
        if ( $this->kernel->getEnvironment() != "dev" ) {
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

        $request = $event->getRequest();

        if (!count($request->request->all())
            && in_array($request->getMethod(), array('POST', 'PUT', 'PATCH', 'DELETE'))
        ) {
            $contentType = $request->headers->get('Content-Type');

            $format = null === $contentType
                ? $request->getRequestFormat()
                : $request->getFormat($contentType);

            if (!$this->decoderProvider->supports($format)) {
                return;
            }

            $decoder = $this->decoderProvider->getDecoder($format);

            $data = $decoder->decode($request->getContent(), $format);
            if (is_array($data)) {
                $request->request = new ParameterBag($data);
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