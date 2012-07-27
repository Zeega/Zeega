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
    
}
