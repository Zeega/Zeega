<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\CommunityBundle\Controller;

use Zeega\CoreBundle\Controller\BaseController;
use Symfony\Component\HttpFoundation\Response;

class CommunityController extends BaseController
{
    public function homeAction()
    {
        $queryFields = array("description","tags","id", "title", "thumbnail_url", "attribution_uri", "views", "display_name","user_id", "user_thumbnail");
        $zeegaQuery = json_decode($this->forward("ZeegaApiBundle:Projects:getProjectsSearch", array(), array("tags" => "zeegaoftheday", "limit" =>"1"))->getContent());
        
        if (isset($zeegaQuery->projects[0])) {
            $topZeega = $zeegaQuery->projects[0];
        } else {
            $topZeega = null;
        }

        return $this->render("ZeegaCommunityBundle:Home:home.html.twig",array("topZeega" => $topZeega));
    }
    
    public function userAction($id)
    {
        $user = $this->getDoctrine()->getRepository('ZeegaDataBundle:User')->findOneById($id);
        $projects = $this->forward('ZeegaApiBundle:Users:getUserProjects', array("id" => $id))->getContent();
        $loggedUser = $this->get('security.context')->getToken()->getUser();

        return $this->render("ZeegaCommunityBundle:User:user.html.twig",array("user"=>$user, "logged_user"=>$loggedUser, "user_projects" => $projects));
    }
    
    public function dashboardAction()
    {      
        $userId = $this->get("security.context")->getToken()->getUser()->getId();
        $projectsCount = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findProjectsCountByUser( $userId );

        if( $projectsCount == 0 ){
            return $this->redirect($this->generateUrl("ZeegaEditorBundle_new", array(), true), 301);  
        } else {
           return $this->redirect($this->generateUrl("ZeegaCommunityBundle_user",array("id"=>$userId),true), 301);   
        }        
    }
    
    public function privacyAction()
    {
        return $this->render("ZeegaCommunityBundle:About:privacy.html.twig");
    }

    public function termsAction()
    {
        return $this->render("ZeegaCommunityBundle:About:terms.html.twig");
    }

    public function engineAction()
    {
        return $this->render("ZeegaCommunityBundle:About:engine.html.twig");
    }

    public function teamAction()
    {
        return $this->render("ZeegaCommunityBundle:About:team.html.twig");
    }

    public function contactAction()
    {
        return $this->render("ZeegaCommunityBundle:About:contact.html.twig");
    }

    public function faqAction()
    {
        return $this->render("ZeegaCommunityBundle:About:faq.html.twig");
    } 
}
