<?php

namespace Zeega\CoreBundle\Twig\Extensions;

use Zeega\DataBundle\Entity\Site;
use Symfony\Bundle\DoctrineBundle\Registry;

class HeaderTwigExtension extends \Twig_Extension
{
	protected $doctrine;

	public function __construct($doctrine, $securityContext)
	{
        $this->doctrine = $doctrine;
		$this->securityContext = $securityContext;
    }

    public function getGlobals()
    {
		$user = $this->securityContext->getToken()->getUser();
		
		$sites = $this->doctrine->getRepository('ZeegaDataBundle:Site')->findSiteByUser($user->getId());
		$site = $sites[0];
		
		$projects = $this->doctrine
						 ->getRepository('ZeegaDataBundle:Project')
						 ->findProjectsBySiteAndUser($site->getId(),$user->getId());
        		
        return array(
            'site' => $site,
			'title'=>$site->getTitle(),
			'short'=>$site->getShort(),
			'num_sites'=>count($sites),
			'user_id' => $user->getId(),
			'myprojects'=> $projects,
			'displayname' => $user->getDisplayName(),
			);
    }

	public function getName()
	{
		return 'zeega-header';
	}
}
