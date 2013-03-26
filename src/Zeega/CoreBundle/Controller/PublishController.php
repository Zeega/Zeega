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
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityRepository;
use Zeega\DataBundle\Entity\Project;
use Zeega\DataBundle\Entity\Frame;
use Zeega\DataBundle\Entity\Layer;
use Zeega\DataBundle\Entity\User;
use Zeega\CoreBundle\Helpers\ResponseHelper;
use Zeega\CoreBundle\Controller\BaseController;

class PublishController extends BaseController
{
    public function frameAction($id)
    {
        $frame = $this->getDoctrine()->getRepository('ZeegaDataBundle:Frame')->find($id);
        $layersId = $frame->getLayers();
        $layers = $this->getDoctrine()->getRepository('ZeegaDataBundle:Layer')->findByMultipleIds($layersId);
        $frameTemplate = $this->renderView('ZeegaApiBundle:Frames:show.json.twig', array('frame'=>$frame, 'layers'=>$layers));

     	return $this->render('ZeegaCoreBundle:Publish:frame.html.twig', array(
			'frameId'=> $frame->getId(),
			'frame'=>$frameTemplate,
			'layers'=>$layers
    	));
    }
     
    public function projectAction($id, $mobile)
    {       
    	$projectItem = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findOneById($id);

        if(null !== $projectItem) {
            if($projectItem->getMediaType()=='project') {
                $projectData = $projectItem->getText();
            } 
        } 
        
        if (null === $projectItem || null === $projectData) {
            throw $this->createNotFoundException("The project with the id $id does not exist or is not published.");
        }

        if ( $mobile ) {
            $projectDataArray = json_decode($projectData, true);
       
            if( is_array($projectDataArray) && isset($projectDataArray["mobile"]) ){
                
                return $this->render('ZeegaCoreBundle:Publish:mobile_player.html.twig', array(
                    'project'=>$projectItem,
                    'project_data' => $projectData,                
                ));
            } else {

                return $this->render('ZeegaCoreBundle:Publish:mobile_not_supported.html.twig', array(
                    'project'=>$projectItem                
                ));
            }    
        } else {
            
            return $this->render('ZeegaCoreBundle:Publish:player.html.twig', array(
                'project'=>$projectItem,
                'project_data' => $projectData
            ));
        }
    }

    public function projectPreviewAction($id)
    { 
        $project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($id);
        $projectData = $this->forward('ZeegaApiBundle:Projects:getProject', array("id" => $id))->getContent();

        return $this->render('ZeegaCoreBundle:Publish:player.html.twig', array(
            'project'=>$project,
            'project_data' => $projectData,
        ));
    }

     
    public function collectionAction($id)
    {
        $projectData = $this->forward('ZeegaApiBundle:Items:getItemProject', array("id" => $id))->getContent();
        $project = new Project();
        return $this->render('ZeegaCoreBundle:Publish:player.html.twig', array(
            'project'=>$project,
            'project_data'=>$projectData,
        ));
    }


    public function channelAction($tag)
    {

        $params = array();
        //$params["data_source"] = "db";
        $params["sort"] = "date-desc";
        $params["type"] = "project";
        $params["tags"] = $tag;
        $projectData = $this->forward('ZeegaApiBundle:Items:getItemsSearch', array(), $params)->getContent();
        $project = new Project();

        return $this->render('ZeegaCoreBundle:Publish:channel.html.twig', array(
            'project'=>$project,
            'project_data'=>$projectData,
        ));
    }
     
    public function embedAction ($id)
    {
        $project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findOneById($id);
		if(is_object($project)&&$project->getMediaType()=='project'){}
		else  $project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($id);

        $request = $this->getRequest();
        $author = $request->query->get('author');

        return $this->render('ZeegaCoreBundle:Publish:embed.html.twig', array('project'=>$project, 'projectId'=>$id,'author'=>$author));
  	}
}


