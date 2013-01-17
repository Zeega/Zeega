<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\CoreBundle\Controller;

use Zeega\CoreBundle\Controller\BaseController;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

class CoreController extends BaseController
{
    public function unsupportedBrowserAction ()
    {
        return $this->render('ZeegaCoreBundle:Core:unsupportedbrowser.html.twig');
    }

    public function mobileAction ()
    {
        return $this->render('ZeegaCoreBundle:Core:mobile.html.twig');
    }
}