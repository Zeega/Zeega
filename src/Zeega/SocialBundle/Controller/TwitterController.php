<?php

namespace Zeega\SocialBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\RedirectResponse;

class TwitterController extends Controller
{
    public function connectTwitterAction()
    {   
      $request = $this->get('request');
      $twitter = $this->get('fos_twitter.service');
      $authURL = $twitter->getLoginUrl($request);
      $response = new RedirectResponse($authURL);
      return $response;
    }  
}
