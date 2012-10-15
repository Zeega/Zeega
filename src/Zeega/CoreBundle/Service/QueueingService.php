<?php
//test
namespace Zeega\CoreBundle\Service;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

use Zeega\DataBundle\Entity\Task;

class QueueingService
{
    public function __construct($securityContext, $doctrine, $rabbitmq) {
        $this->securityContext = $securityContext;
        $this->doctrine = $doctrine;
        $this->rabbitmq = $rabbitmq;
    }

    public function enqueueTask($task, $taskArguments, $taskIdPrefix = null) {

        if($this->container->get('security.context')->isGranted('IS_AUTHENTICATED_FULLY')) {            
            $user = $this->container->get('security.context')->getToken()->getUser();
            $currentTime = new \DateTime("now");

            // create a new task on the database for tracking purposes
            $task = new Task();
            $task->setUser($user);
            $task->setStatus("scheduled");
            $task->setDateCreated($currentTime);
            $task->setDateUpdated($currentTime);
            
            $em->persist($task);
            $em->flush();                

            try {
                // enqueue the task
                $taskId = $task->getId();                
                $msg = array("id" => $taskId,  "task" => $task, "args" => $taskArguments);
                $this->rabbitmq->publish(str_replace('\/','/',json_encode($msg)), 'celery',  array('content_type' => 'application/json', 'delivery_mode' => 2));                
                return $taskId;
            } catch (Exception $e) {
                $task->setStatus("error");
                $em->persist($task);
                $em->flush();                                
                throw $e;
            }
        }
    }
}