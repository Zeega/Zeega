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

use Zeega\DataBundle\Entity\Schedule;
use Zeega\CoreBundle\Helpers\ItemCustomNormalizer;
use Zeega\CoreBundle\Helpers\ResponseHelper;
use Zeega\CoreBundle\Controller\BaseController;

class ScheduleController extends BaseController
{
    public function getScheduleAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();        
        $schedule = $em->getRepository('ZeegaDataBundle:Schedule')->findOneById($id);
        if(null === $schedule) {
            $scheduleView = $this->renderView('ZeegaApiBundle:Users:show.json.twig');
        } else {
            $scheduleUserId = $schedule->getUser()->getId();
            parent::authorize($scheduleUserId); // check if the user can access this resource
            $scheduleView = $this->renderView('ZeegaApiBundle:Schedule:show.json.twig', array('schedule' => $schedule));
        }
        return ResponseHelper::compressTwigAndGetJsonResponse($scheduleView);
    }

    public function postScheduleAction()
    {
        // parent::authorizeByRole('ROLE_ADMIN'); - authorization; change to SUPER_USER_ROLE or something similar

        $query = $this->getRequest()->request->get('query');
        $dateCreated = $this->getRequest()->request->get('date_created');
        $dateUpdated = $this->getRequest()->request->get('date_updated');
        $status = $this->getRequest()->request->get('status');
        $enabled = $this->getRequest()->request->get('enabled');
        
        $schedule = new Schedule();
        $schedule->setQuery($query); 
        $schedule->setDateCreated($dateCreated); 
        $schedule->setDateUpdated($dateUpdated); 
        $schedule->setStatus($status); 
        $schedule->setEnabled($enabled); 
        
        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($schedule);
        $em->flush();
        
        $scheduleView = $this->renderView('ZeegaApiBundle:Schedule:show.json.twig', array('schedule' => $schedule));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($scheduleView);
    }
 }