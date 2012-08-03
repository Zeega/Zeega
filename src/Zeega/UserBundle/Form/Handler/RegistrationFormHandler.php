<?php

namespace Zeega\UserBundle\Form\Handler;

use FOS\UserBundle\Form\Handler\RegistrationFormHandler as BaseHandler;
use FOS\UserBundle\Model\UserInterface;

class RegistrationFormHandler extends BaseHandler
{
    protected function onSuccess(UserInterface $user, $confirmation)
    {
		$user->setUsername($user->getEmail());
		$user->setPlainPassword(mt_rand());
		$user->setLocked(true);
		$user->setEnabled(false);
		
        parent::onSuccess($user, $confirmation);
    }
}
