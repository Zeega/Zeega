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
        return $this->render("ZeegaCommunityBundle:Home:home.html.twig",array("tags"=>"homepage"));
    }

    public function tagAction( $tag )
    {
        return $this->render("ZeegaCommunityBundle:Home:home.html.twig",array("tags"=> $tag, "local_path"=>"tag/".$tag ));
    }
    
    public function userAction($id)
    {
        $loggedUser = $this->getUser();
        $user = $this->getDoctrine()->getRepository('ZeegaDataBundle:User')->findOneById($id);


        if(is_null($loggedUser) || $loggedUser->getId() != $id) {
            //$background = $user->getBackGroundUrl
            return $this->render("ZeegaCommunityBundle:Home:home.html.twig",array("profile_id"=> $id, "local_path"=>"profile/".$id, "user"=>$user ));
        } else {
            
            $projects = $this->forward('ZeegaApiBundle:Users:getUserProjects', array("id" => $id))->getContent();
            return $this->render("ZeegaCommunityBundle:User:user.html.twig",array("user"=>$user, "logged_user"=>$loggedUser, "user_projects" => $projects));
        }
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
