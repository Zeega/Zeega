<?php
namespace Zeega\DiscoveryBundle\Controller;

use Zeega\CoreBundle\Controller\BaseController;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

class CollectionController extends BaseController
{
	public function indexAction($id)
	{
		return $this->render('ZeegaDiscoveryBundle:Collection:collection.html.twig',array('locale'=>'en','id'=>$id));
	}
}