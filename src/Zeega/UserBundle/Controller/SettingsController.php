<?php

namespace Zeega\UserBundle\Controller;

use Zeega\CoreBundle\Controller\BaseController;
use Symfony\Component\HttpFoundation\Response;

class  SettingsController extends BaseController
{
    public function settingsAction()
    {
    	$userId = $this->get("security.context")->getToken()->getUser()->getId();
    	$userThumb = $this->get("security.context")->getToken()->getUser()->getThumbUrl();

    	$user = $this->forward('ZeegaApiBundle:Users:getUser', array("id" => $userId))->getContent();
        
        return $this->render("ZeegaUserBundle:Settings:settings.html.twig", array( "profile_id"=>$userId, "profile_thumb"=>$userThumb, "profile_data" => $user ));
    }
}
