<?php

namespace Zeega\CoreBundle\Twig\Extensions;

use Zeega\DataBundle\Entity\Site;
use Zeega\DataBundle\Entity\User;
use Symfony\Bundle\DoctrineBundle\Registry;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Zeega\CoreBundle\Helpers\ItemCustomNormalizer;
use Symfony\Component\HttpFoundation\Response;

class HeaderTwigExtension extends \Twig_Extension
{
	protected $doctrine;

	public function __construct($doctrine, $securityContext, $session)
	{
        $this->doctrine = $doctrine;
		$this->securityContext = $securityContext;
		$this->session = $session;
    }

    public function getGlobals()
    {
        $securityToken = $this->securityContext->getToken();
        if(isset($securityToken))
        {
            $user = $this->securityContext->getToken()->getUser();
    		if(isset($user) && $user != "anon.")
    		{
    		    $sites = $user->getSites();
    		    
    		    $session = $this->session;
        		$currentSite = $session->get('site');
                
                if(!isset($currentSite))
                {
            	    $currentSite = $sites[0];
                }
				if(isset($currentSite))
				{
	        		$projects = $this->doctrine->getRepository('ZeegaDataBundle:Project')->findProjectsBySiteAndUser($currentSite->getId(),$user->getId());

    	            return array(
        	            'site' => $currentSite,
            	        'sites' => $sites,
        				'title'=>$currentSite->getTitle(),
        				'short'=>$currentSite->getShort(),
        				'num_sites'=>count($sites),
        				'user_id' => $user->getId(),
        				'myprojects'=> $projects,
        				'displayname' => $user->getDisplayName(),
        			);
        		}
    		}
        }

        return array(
            'site' => null,
			'title' => 'Unknown',
			'short' => 'Unknown',
			'num_sites' => 0,
			'user_id' => -1,
			'myprojects'=> 'Unknown',
			'displayname' => 'Unknown'
			);
    }
	
	public function getFilters()
	{
        return array(
            'json_encode_entity' => new \Twig_Filter_Method($this, 'entityNormalizer'),
            'unserialize_array' => new \Twig_Filter_Method($this, 'unserializeArray'),
        );
    }

    public function entityNormalizer($arrayObject)
    {
        $serializer = new Serializer(array(new ItemCustomNormalizer()),array('json' => new JsonEncoder()));
        return $serializer->serialize($arrayObject, 'json');
    }

    public function unserializeArray($arrayObject)
    {
    	if(isset($arrayObject))
    		return unserialize($arrayObject);
    	else 
    		return array();
    }

	
	public function getName()
	{
		return 'zeega-header';
	}
}
