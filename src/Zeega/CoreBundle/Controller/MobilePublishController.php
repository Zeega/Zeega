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

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\DataBundle\Entity\Project;
use Zeega\DataBundle\Entity\Frame;
use Zeega\DataBundle\Entity\Layer;
use Zeega\DataBundle\Entity\User;
use Zeega\CoreBundle\Helpers\ResponseHelper;
use Zeega\CoreBundle\Controller\BaseController;

class MobilePublishController extends BaseController
{

     
    public function projectAction($id)
    {       
    	$project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findOneById($id);

        if(null !== $project) {
            if($project->getMediaType()=='project') {
                $projectData = $project->getText();
            } else {
                $projectData = $this->forward('ZeegaApiBundle:Projects:getProject', array("id" => $id))->getContent();
            }
        }

  
        $d= json_decode($projectData);
       
        if($d->mobile){
            return $this->render('ZeegaCoreBundle:MobilePublish:player.html.twig', array(
                'project'=>$project,
                'project_data' => $projectData,
                
            ));
        } else {
            return $this->render('ZeegaCoreBundle:MobilePublish:static.html.twig', array(
                'project'=>$project
                
            ));
        }
        
    }


}


