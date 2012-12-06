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

class ApiResponseListener
{
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