<?php

namespace Zeega\CommunityBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class CommunityController extends Controller
{
    public function authorAction()
    {
        return $this->render('ZeegaCommunityBundle:Author:author.html.twig');
    }
    
    public function homeAction()
    {
    	$projects = $this->forward('ZeegaApiBundle:Items:getItem', array("id" => 36136))->getContent();
        return $this->render('ZeegaCommunityBundle:Home:home.html.twig',array('projects' => $projects));
    }
    
    public function topicAction()
    {
        return $this->render('ZeegaCommunityBundle:Topic:topic.html.twig');
    }
    
    public function userAction($id)
    {
        $user = $this->getDoctrine()->getEntityManager()->getRepository('ZeegaDataBundle:User')->findOneById($id);
    	
    	$projects = $this->forward('ZeegaApiBundle:Users:getUserProjects', array("id" => $id))->getContent();

        return $this->render('ZeegaCommunityBundle:User:user.html.twig',array('user'=>$user, 'user_projects' => $projects));
    }
    
    public function dashboardAction()
    {      
    	if($this->container->get('security.context')->isGranted('IS_AUTHENTICATED_FULLY'))
        {
            $userId = $this->get('security.context')->getToken()->getUser()->getId();
            return $this->redirect($this->generateUrl('ZeegaCommunityBundle_user',array('id'=>$userId)), 301);  
        }        
    }
    
    public function missionAction()
    {
        return $this->render('ZeegaCommunityBundle:About:mission.html.twig');
    }
    
    public function privacyAction()
    {
        return $this->render('ZeegaCommunityBundle:About:privacy.html.twig');
    }
    public function termsAction()
    {
        return $this->render('ZeegaCommunityBundle:About:terms.html.twig');
    }
    public function productionsAction()
    {
        return $this->render('ZeegaCommunityBundle:About:productions.html.twig');
    }
    public function engineAction()
    {
        return $this->render('ZeegaCommunityBundle:About:engine.html.twig');
    }
    public function teamAction()
    {
        return $this->render('ZeegaCommunityBundle:About:team.html.twig');
    }
    public function contactAction()
    {
        return $this->render('ZeegaCommunityBundle:About:contact.html.twig');
    }
    public function newsAction()
    {
        return $this->render('ZeegaCommunityBundle:About:news.html.twig');
    }
    
}
