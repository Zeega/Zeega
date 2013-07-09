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
        $projects = $this->forward('ZeegaApiBundle:Projects:getProjectsSearch',array(), array(
            "tags"=>"homepage", 
            "limit"=>10, 
            "sort"=>"date-updated-desc"
        ))->getContent();
        
        return $this->render("ZeegaCommunityBundle:Home:home.html.twig",array("tags"=>"homepage", "feed_data"=>$projects));
    }

    public function tagAction( $tag )
    {
        
        if( $tag == "realtime" ){
            $projects = $this->forward('ZeegaApiBundle:Projects:getProjectsSearch',array(), array(
                "limit"=>10, 
                "sort"=>"date-updated-desc"
            ))->getContent();
        } else {
            $projects = $this->forward('ZeegaApiBundle:Projects:getProjectsSearch',array(), array(
                "tags"=>$tag, 
                "limit"=>10, 
                "sort"=>"date-updated-desc"
            ))->getContent();
        }


        return $this->render("ZeegaCommunityBundle:Home:home.html.twig",array("tags"=> $tag, "local_path"=>"tag/".$tag, "feed_data"=>$projects ));
    }
    
    public function userAction($id)
    {
        $loggedUser = $this->getUser();
        $projects = $this->forward('ZeegaApiBundle:Users:getUserProjects', array("id" => $id, "limit"=>10))->getContent();
        $profile = $this->forward('ZeegaApiBundle:Users:getUser', array("id" => $id))->getContent();
        
        return $this->render("ZeegaCommunityBundle:Home:home.html.twig",array("profile_id"=> $id, "local_path"=>"profile/".$id, "feed_data"=>$projects, "profile_data"=>$profile ));
       
    }
    
    public function dashboardAction()
    {      
        $user = $this->get("security.context")->getToken()->getUser();
        $userId = $this->get("security.context")->getToken()->getUser()->getId();

        if ( $user->getRequestExtraInfo() ) {
            return $this->redirect($this->generateUrl("fos_user_registration_extra", array(), true), 301);  
        }

        // this should go - it's here mainly for demos
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

     public function notfoundAction()
    {
        return $this->render("ZeegaCommunityBundle:Notfound:notfound.html.twig");
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
