<?php
//test
namespace Zeega\CoreBundle\Service;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;


class QueueingService
{
    public function __construct($securityContext, $doctrine, $rabbitmq)
    {
        $this->securityContext = $securityContext;
        $this->doctrine = $doctrine;
        $this->rabbitmq = $rabbitmq;
    }

    public function enqueueTask($task, $taskArguments, $taskIdPrefix = null)
	{
        $taskId = $taskIdPrefix . uniqid();
        
        $msg = array("id" => $taskId,  "task" => $task, "args" => $taskArguments);
        $this->rabbitmq->publish(str_replace('\/','/',json_encode($msg)), 'celery',  array('content_type' => 'application/json', 'delivery_mode' => 2));
        
        return $taskId;
    }
}