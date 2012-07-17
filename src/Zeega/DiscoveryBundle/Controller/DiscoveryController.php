<?php
namespace Zeega\DiscoveryBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\Sequence;
use Zeega\DataBundle\Entity\Project;
use Zeega\DataBundle\Entity\Site;
use Zeega\DataBundle\Entity\Frame;
use Zeega\DataBundle\Entity\User;
use Zeega\CoreBundle\Form\Type\UserType;
use Zeega\CoreBundle\Form\Type\SiteType;
use Zeega\CoreBundle\Form\Type\PasswordType;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;

class DiscoveryController extends Controller
{
	public function libraryAction($short)
	{
		return $this->render('ZeegaDiscoveryBundle:Discovery:library.html.twig', array('page'=>'editor'));
	}
}