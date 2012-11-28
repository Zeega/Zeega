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

use Symfony\Bundle\FrameworkBundle\Controller\Controller as SymfonyBaseController;

/**
 * Controller is a simple implementation of a Controller that extends the Symfony base controller.
 *
 */
class BaseController extends SymfonyBaseController
{
    /**
     * Checks the logged user id matches the userId parameters and throws a not authorized
     * exception if the user is not authorized to access the resource.
     *
     * @param string  $userId     The target user id
     *
     */
    protected function authorize($userId)
    {
        if(null === $userId)
        {
            throw new \BadFunctionCallException('The userId parameter cannot be null');
        }
        
        if($this->container->get('security.context')->isGranted('IS_AUTHENTICATED_FULLY') )
        {
            $loggedUserId = $this->container->get('security.context')->getToken()->getUser()->getId();
            
            if($loggedUserId == $userId || $this->container->get('security.context')->isGranted('ROLE_ADMIN'))
            {
                return;
            }
        }

        throw new AccessDeniedException();
    }

    /**
     * Checks the logged user belongs to a role and throws a not authorized
     * exception if not.
     *
     * @param string  $role     The role name
     *
     */
    protected function authorizeByRole($role)
    {
        if($this->container->get('security.context')->isGranted('IS_AUTHENTICATED_FULLY') )
        {
            if($this->container->get('security.context')->isGranted($role))
            {
                return;
            }
        }

        throw new AccessDeniedException();
    }
}
