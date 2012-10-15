<?php
//test
namespace Zeega\CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

use Zeega\CoreBundle\Controller\BaseController;

class CeleryController extends BaseController
{
    public function queueAction()
	{
        $isQueueingEnabled = $this->container->getParameter('queueing_enabled');

        if(False !== $isQueueingEnabled)
        {
            $queue = $this->get('zeega_queue');
            $taskId = $queue->enqueueTask("zeega.tasks.ingest",array("http://www.flickr.com/photos/planettakeout/sets/72157630302231572/",1),"parser-");
            return new Response($taskId);
        }
    }
    
    public function statusAction($id)
	{
    } 
}