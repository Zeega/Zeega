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
                        return array(
                            'user_id' => $user->getId(),
                            'displayname' => $user->getDisplayName(),
                        );
                    }
                }
            }
        }
        
        return array();
    }

	public function getFunctions()
	{
        return array(
            'isEditable' => new \Twig_Function_Method($this, 'isEditable')
        );
    }

    public function isEditable($objectUserId, $editable = true) {
        if ($editable === false) {
            return false;
        }
        if ( !isset($objectUserId) ) {
            return false;
        }

        $securityToken = $this->container->get('security.context')->getToken();
                
        if(isset($securityToken)) {
            $user = $this->container->get('security.context')->getToken()->getUser();
            if($this->container->get('security.context')->isGranted('IS_AUTHENTICATED_FULLY')) {
                if ( $objectUserId === $user->getId() ) {
                    return true;
                }

                $userRoles = $user->getRoles();
                foreach($userRoles as $userRole) {
                    if ( $userRole === "ROLE_ADMIN" ) {
        
                        return true;
                    }
                }
            }
        }

        return false;
    }

	
	public function getName()
	{
		return 'zeega.twig.extension';
	}
}
