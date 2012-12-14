<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\CommunityBundle\Controller;

use Zeega\CoreBundle\Controller\BaseController;
use Symfony\Component\HttpFoundation\Response;

class EventsController extends BaseController
{
    public function tribecahacksAction()
    {
        return $this->render('ZeegaCommunityBundle:Events:tribecahacks.html.twig');
    }  
}
