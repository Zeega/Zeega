<?php

namespace Zeega\JDABundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class SearchController extends Controller
{
    
    public function indexAction()
    {
    
    	$locale=$this->get('session')->getLocale();
    	$request = $this->getRequest();
	 	$t=$request->request->get('search-text');
    	return $this->render('ZeegaJDABundle:Search:search.html.twig', array(
					// last displayname entered by the user
					'locale' => $locale,
					'page'=> 'home',
					
				));
    }
}
