<?php

namespace Zeega\CommunityBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


class CommunityController extends Controller
{
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
    
    public function topicsAction()
    {
        return $this->render('ZeegaCommunityBundle:Topics:topics.html.twig');
    }
    
    public function userAction($id=null)
    {
        return $this->render('ZeegaCommunityBundle:User:user.html.twig',array('user_id'=>$id));
    }
    
    public function dashboardAction($id=null)
    {
    	return $this->redirect($this->generateUrl('ZeegaCommunityBundle_user',array('id'=>null)), 301);
       
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
