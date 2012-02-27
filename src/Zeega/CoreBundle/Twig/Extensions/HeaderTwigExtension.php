<?php

namespace Zeega\CoreBundle\Twig\Extensions;

use Zeega\DataBundle\Entity\Site;
use Zeega\DataBundle\Entity\User;
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
    	$user = $this->doctrine->getRepository('ZeegaDataBundle:User')->find(1);
		//$user = $this->securityContext->getToken()->getUser();
		if($user == "anon.")
		{
            $user = $this->doctrine->getRepository('ZeegaDataBundle:User')->find(1);
        }
		
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
	
	public function getFilters()
	{
        return array(
            'rot13' => new \Twig_Filter_Method($this, 'rot13Filter'),
        );
    }

    public function rot13Filter($arrayObject)
    {
        return json_encode($arrayObject);
    }
	
	public function getName()
	{
		return 'zeega-header';
	}
}
