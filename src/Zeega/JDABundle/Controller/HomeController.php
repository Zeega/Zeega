<?php

namespace Zeega\JDABundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class HomeController extends Controller
{
    
    public function indexAction()
    {
    
    	$locale=$this->get('session')->getLocale();
    	$request = $this->getRequest();
    	if($request->request->get('search-text')) return $this->redirect($this->generateUrl('search',array('query' =>$request->request->get('search-text'),'_locale'=>$locale)));
   
    	return $this->render('ZeegaJDABundle:Home:home.html.twig', array(
					// last displayname entered by the user
					'locale' => $locale,
					'page'=> 'home',
					
				));
    	 //$t = $this->get('translator')->trans('home.featured');

    	//return new Response($t);
    
    }
}
