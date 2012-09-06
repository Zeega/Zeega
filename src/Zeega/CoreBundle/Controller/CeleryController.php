<?php
//test
namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;


class CeleryController extends Controller
{
    public function queueAction()
	{
        $isQueueingEnabled = $this->container->getParameter('queueing_enabled');

        if(False !== $isQueueingEnabled)
        {
            $queue = $this->get('zeega_queue');
            $taskId = $queue->enqueueTask("zeega.tasks.ingest",array("http://www.flickr.com/photos/planettakeout/7767719240/in/pool-planettakeout",1),"parser-");
            return new Response($taskId);
        }
    }
    
    public function statusAction($id)
	{
    } 
}