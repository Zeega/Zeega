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
    public function authorAction()
    {
        return $this->render("ZeegaCommunityBundle:Author:author.html.twig");
    }
    
    public function homeAction()
    {
        $queryFields = array("description","tags","id", "title", "thumbnail_url", "attribution_uri", "views", "display_name","user_id", "user_thumbnail");
        $zeegaQuery = json_decode($this->forward("ZeegaApiBundle:Items:getItemsSearch", array(), array("limit" =>"1", "tags" => "zeegaoftheday", "fields" => "id"))->getContent());
        
        if (isset($zeegaQuery->items[0])) {
            $topZeega = $zeegaQuery->items[0];
        } else {
            $topZeega = null;
        }
        
        $collections = $this->forward("ZeegaApiBundle:Items:getItemsSearch", array(), array("collection" => 94088, "fields" => $queryFields))->getContent();

        return $this->render("ZeegaCommunityBundle:Home:home.html.twig",array("collections" => $collections, "topZeega" => $topZeega));
    }
    
    public function topicAction()
    {
        return $this->render("ZeegaCommunityBundle:Topic:topic.html.twig");
    }
    
    public function userAction($id)
    {
        $user = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:User")->findOneById($id);
        $projects = $this->forward("ZeegaApiBundle:Users:getUserProjects", array("id" => $id))->getContent();
        $loggedUser = $this->get("security.context")->getToken()->getUser();

        return $this->render("ZeegaCommunityBundle:User:user.html.twig",array("user"=>$user, "logged_user"=>$loggedUser, "user_projects" => $projects));
    }
    
    public function dashboardAction()
    {      
        $userId = $this->get("security.context")->getToken()->getUser()->getId();
        return $this->redirect($this->generateUrl("ZeegaCommunityBundle_user",array("id"=>$userId),true), 301);  
    }
    
    public function missionAction()
    {
        return $this->render("ZeegaCommunityBundle:About:mission.html.twig");
    }
    
    public function privacyAction()
    {
        return $this->render("ZeegaCommunityBundle:About:privacy.html.twig");
    }
    public function termsAction()
    {
        return $this->render("ZeegaCommunityBundle:About:terms.html.twig");
    }
    public function productionsAction()
    {
        return $this->render("ZeegaCommunityBundle:About:productions.html.twig");
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
    public function newsAction()
    {
        return $this->render("ZeegaCommunityBundle:About:news.html.twig");
    }
    public function featuresAction()
    {
        return $this->render("ZeegaCommunityBundle:About:features.html.twig");
    }

    public function faqAction()
    {
        return $this->render("ZeegaCommunityBundle:About:faq.html.twig");
    } 
    
    
    //LEGACY REROUTING –– TO BE MOVED
    public function legacynewsAction()
    {
       return $this->redirect($this->generateUrl("ZeegaCommunityBundle_news"), 301);  
    }
    public function legacyhappeningsAction()
    {
         return $this->redirect($this->generateUrl("ZeegaCommunityBundle_about"), 301);  
    }
    public function legacyteamAction()
    {
        return $this->redirect($this->generateUrl("ZeegaCommunityBundle_team"), 301);  
    }
        public function legacyengineAction()
    {
       return $this->redirect($this->generateUrl("ZeegaCommunityBundle_engine"), 301);  
    }
}
