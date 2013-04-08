<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\CoreBundle\Twig\Extensions;

use Zeega\DataBundle\Entity\Site;
use Zeega\DataBundle\Entity\User;
use Symfony\Bundle\DoctrineBundle\Registry;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Zeega\CoreBundle\Helpers\ItemCustomNormalizer;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ZeegaTwigExtension extends \Twig_Extension
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function getGlobals()
    {
        if ( $this->container->hasScope('request') && $this->container->isScopeActive('request') ) {
            $request = $this->container->get('request');        

            if(!preg_match("/\/api\//",$request->getUri())) {
                $securityToken = $this->container->get('security.context')->getToken();
                
                if(isset($securityToken)) {
                    $user = $this->container->get('security.context')->getToken()->getUser();
                    if($this->container->get('security.context')->isGranted('IS_AUTHENTICATED_FULLY')) {
                        $projects = $this->container->get('doctrine.odm.mongodb.document_manager')->getRepository('ZeegaDataBundle:Project')->findProjectsByUser($user->getId());
                        
                        return array(
                            'user_id' => $user->getId(),
                            'myprojects'=> $projects,
                            'displayname' => $user->getDisplayName(),
                        );
                    }
                }
            }
        }
        
        return array();
    }

	public function getFilters()
	{
        return array(
            'json_encode_entity' => new \Twig_Filter_Method($this, 'entityNormalizer'),
            'unserialize_array' => new \Twig_Filter_Method($this, 'unserializeArray')
        );
    }

    public function getTests()
    {
        return array(
            'solr_array' => new \Twig_Test_Method($this,'isSolrArray')
        );
    }

    public function entityNormalizer($arrayObject)
    {
        $serializer = new Serializer(array(new ItemCustomNormalizer()),array('json' => new JsonEncoder()));
        return $serializer->serialize($arrayObject, 'json');
    }

    public function isSolrArray($value) {
        return isset($value) && is_array($value) && count($value) == 1 && isset($value[0]);
    }

    public function unserializeArray($value)
    {
    	if(isset($value) && is_string($value)) {   
    		$uvalue = unserialize($value);
    		if(is_array($uvalue)){
    			return $uvalue;	
    		}
    	}

    	return $value;
    }
	
	public function getName()
	{
		return 'zeega.twig.extension';
	}
}
