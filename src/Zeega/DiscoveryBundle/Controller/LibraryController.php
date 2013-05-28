<?php
namespace Zeega\DiscoveryBundle\Controller;

use Zeega\CoreBundle\Controller\BaseController;

class LibraryController extends BaseController
{
	public function indexAction()
	{
        if($this->container->get('security.context')->isGranted('ROLE_ADMIN')){

		  return $this->render('ZeegaDiscoveryBundle:Library:library.html.twig',array('locale'=>'en'));

        }
	}
}