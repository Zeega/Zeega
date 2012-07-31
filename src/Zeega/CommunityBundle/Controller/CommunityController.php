<?php

namespace Zeega\CommunityBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class CommunityController extends Controller
{
    public function notfoundAction()
    {
        return $this->render('ZeegaCommunityBundle:Notfound:notfound.html.twig');
    }

    public function aboutAction()
    {
        return $this->render('ZeegaCommunityBundle:About:about.html.twig');
    }
    
    public function authorAction()
    {
        return $this->render('ZeegaCommunityBundle:Author:author.html.twig');
    }
    
    public function homeAction()
    {
        return $this->render('ZeegaCommunityBundle:Home:home.html.twig');
    }
    
    public function topicAction()
    {
        return $this->render('ZeegaCommunityBundle:Topic:topic.html.twig');
    }
    
    public function userAction($id)
    {
        //$user = $this->forward('ZeegaApiBundle:Users:getUser', array('id'=>$id))->getContent();
    	$projects = $this->forward('ZeegaApiBundle:Users:getUserProjects', array("id" => $id))->getContent();

        return $this->render('ZeegaCommunityBundle:User:user.html.twig',array('user_id'=>$id, 'user_projects' => $projects));
    }
    
    public function dashboardAction()
    {
    	//return $this->redirect($this->generateUrl('ZeegaCommunityBundle_user',array('id'=>null)), 301);       
    	if($this->container->get('security.context')->isGranted('IS_AUTHENTICATED_FULLY'))
        {
            $userId = $this->get('security.context')->getToken()->getUser()->getId();
            return $this->redirect($this->generateUrl('ZeegaCommunityBundle_user',array('id'=>$userId)), 301);  
        }        
    }
    public function privacyAction()
    {
        return $this->render('ZeegaCommunityBundle:Privacy:privacy.html.twig');
    }
    public function termsAction()
    {
        return $this->render('ZeegaCommunityBundle:Terms:terms.html.twig');
    }
    public function productionsAction()
    {
        return $this->render('ZeegaCommunityBundle:Productions:productions.html.twig');
    }
    public function engineAction()
    {
        return $this->render('ZeegaCommunityBundle:Engine:engine.html.twig');
    }
    public function teamAction()
    {
        return $this->render('ZeegaCommunityBundle:Team:team.html.twig');
    }
    public function contactAction()
    {
        return $this->render('ZeegaCommunityBundle:Contact:contact.html.twig');
    }
    
}
