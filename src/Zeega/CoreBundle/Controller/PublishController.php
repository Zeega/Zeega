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
     
    public function projectAction($id)
    {       
    	$project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findOneById($id);

        if(null !== $project) {
            if($project->getMediaType()=='project') {
                $projectData = $project->getText();
            } else {
                $projectData = $this->forward('ZeegaApiBundle:Projects:getProject', array("id" => $id))->getContent();
            }
        } else {
            $project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findOneById($id);

            if(null !== $project) {
                $publishedProjectId = $project->getItemId();

                if(null !== $publishedProjectId) {
                    $project = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findOneById($publishedProjectId);
                    $projectData = $project->getText();
                }
            }
        }

        return $this->render('ZeegaCoreBundle:Publish:player.html.twig', array(
            'project'=>$project,
            'project_data' => $projectData,
        ));
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


