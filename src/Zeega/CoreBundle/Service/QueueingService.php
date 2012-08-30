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

    public function enqueueTask($task, $taskArguments)
	{
        /*
	    $id = uniqid();
	    $msg = array("id" => $id,  "task" => "tasks.add", "args" => array(1,2));
        $this->get('old_sound_rabbit_mq.celery_task_producer')->publish(json_encode($msg), 'celery');
        return $id;
        */
        $msg = array("id" => uniqid(),  "task" => $task, "args" => $taskArguments);
        $id = $this->rabbitmq->publish(json_encode($msg), 'celery');
        return $id;
    }
}