<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\ApiBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

use Zeega\DataBundle\Entity\Item;
use Zeega\CoreBundle\Helpers\ItemCustomNormalizer;
use Zeega\CoreBundle\Helpers\ResponseHelper;
use Zeega\CoreBundle\Controller\BaseController;

class ScheduleController extends BaseController
{
    public function getScheduleAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();        
        $schedule = $em->getRepository('ZeegaDataBundle:Schedule')->findOneById($id);
        $scheduleView = $this->renderView('ZeegaApiBundle:Schedule:show.json.twig', array('schedule' => $schedule));

        return ResponseHelper::compressTwigAndGetJsonResponse($scheduleView);
    }
 }