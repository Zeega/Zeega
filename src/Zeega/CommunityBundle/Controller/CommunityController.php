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


        return $this->render("ZeegaCommunityBundle:Home:home.html.twig",array("tags"=> $tag, "feed_data"=>$projects ));
    }
    
    public function userAction( $id )
    {
        $user = $this->getDoctrine()->getRepository("ZeegaDataBundle:User")->findOneById( $id );

        if(!isset($user)){
            return $this->redirect($this->generateUrl('ZeegaCommunityBundle_home'), 301);  
        }
        $username = $user->getUsername();

        return $this->redirect($this->generateUrl('ZeegaCommunityBundle_profile', array("username" => $username)), 301);

    }


    public function profileAction( $username )
    {
        $loggedUser = $this->getUser();
        $user = $this->getDoctrine()->getRepository("ZeegaDataBundle:User")->findOneByUsername( $username );
        
        if(!isset($user)){
            return $this->redirect($this->generateUrl('ZeegaCommunityBundle_home'), 301);  
        }

        $id = $user->getId();

        $projects = $this->forward('ZeegaApiBundle:Users:getUserProjects', array("id" => $id, "limit"=>10))->getContent();
        $profile = $this->forward('ZeegaApiBundle:Users:getUser', array("id" => $id))->getContent();
        
        return $this->render("ZeegaCommunityBundle:Home:home.html.twig",array("profile_id"=> $id, "feed_data"=>$projects, "profile_data"=>$profile ));
       
    }
    
    public function dashboardAction()
    {    

        $firstTime = $this->getRequest()->query->get("firstTime");

        $user = $this->get("security.context")->getToken()->getUser();
        $username = $user->getUsername();

        if ( $user->getRequestExtraInfo() ) {
            return $this->redirect($this->generateUrl("fos_user_registration_extra", array(), true), 301);  
        } else if ( isset($firstTime) ){
            return $this->redirect($this->generateUrl("ZeegaEditorBundle_new", array("firstTime"=>true), true), 301); 
        }

        return $this->redirect($this->generateUrl("ZeegaCommunityBundle_profile",array("username"=>$username),true), 301);        
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
