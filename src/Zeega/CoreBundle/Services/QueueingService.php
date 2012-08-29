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
	    $id = uniqid();
	    $msg = array("id" => $id,  "task" => "tasks.add", "args" => array(1,2));
        $this->get('old_sound_rabbit_mq.celery_task_producer')->publish(json_encode($msg), 'celery');
        return $id;
    }
    
    public function statusAction($id)
	{
    } 
}