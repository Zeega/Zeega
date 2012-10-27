<?php
namespace Zeega\DiscoveryBundle\Controller;

use Zeega\CoreBundle\Controller\BaseController;

class LibraryController extends BaseController
{
	public function indexAction()
	{

		return $this->render('ZeegaDiscoveryBundle:Library:library.html.twig',array('locale'=>'en'));
	}
}