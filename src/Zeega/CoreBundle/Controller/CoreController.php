<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

class CoreController extends Controller
{
    
	public function faqAction()
	{
	    $user = $this->get('security.context')->getToken()->getUser();

		return $this->render('ZeegaCoreBundle:Core:faq.html.twig', array('page'=>'faq'));
    } 
	
 	public function unsupportedBrowserAction ()
 	{
 		return $this->render('ZeegaCoreBundle:Core:unsupportedbrowser.html.twig');
 	}
}