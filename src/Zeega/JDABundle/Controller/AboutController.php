<?php

namespace Zeega\JDABundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class AboutController extends Controller
{
    
    public function indexAction()
    {
    
    	$locale=$this->get('session')->getLocale();
    	$request = $this->getRequest();
    	if($request->request->get('search-text')) return $this->redirect($this->generateUrl('search',array('query' =>$request->request->get('search-text'),'_locale'=>$locale)));
   
        return $this->render('ZeegaJDABundle:About:about.html.twig', array(
					// last displayname entered by the user
					'locale' => $locale,
					'page'=> 'about',
					
				));
    	 //$t = $this->get('translator')->trans('home.featured');

    	//return new Response($t);
    
    }
}
