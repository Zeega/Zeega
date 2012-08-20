<?php

namespace Zeega\UserBundle\Form\Handler;

use FOS\UserBundle\Form\Handler\ResettingFormHandler as BaseHandler;

use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;

use FOS\UserBundle\Model\UserInterface;
use FOS\UserBundle\Model\UserManagerInterface;
use FOS\UserBundle\Form\Model\ResetPassword;

class ResettingFormHandler extends BaseHandler
{
    public function __construct(Form $form, Request $request, UserManagerInterface $userManager)
    {
        parent::__construct($form, $request, $userManager);
    }

    protected function onSuccess(UserInterface $user)
    {
        $user->setLastLogin(new \DateTime('now'));
        parent::onSuccess($user);
    }
}
