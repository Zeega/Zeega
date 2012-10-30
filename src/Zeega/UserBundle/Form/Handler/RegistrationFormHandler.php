<?php

namespace Zeega\UserBundle\Form\Handler;

use FOS\UserBundle\Form\Handler\RegistrationFormHandler as BaseHandler;
use FOS\UserBundle\Model\UserManagerInterface;
use FOS\UserBundle\Model\UserInterface;
use FOS\UserBundle\Mailer\MailerInterface;
use FOS\UserBundle\Util\TokenGeneratorInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;

class RegistrationFormHandler extends BaseHandler
{
    //public function __construct(Form $form, Request $request, UserManager $userManager, Mailer $mailer, ContainerInterface $container)
    public function __construct(FormInterface $form, Request $request, UserManagerInterface $userManager, 
        MailerInterface $mailer, TokenGeneratorInterface $tokenGenerator,ContainerInterface $container) 
    {
        parent::__construct($form, $request, $userManager, $mailer, $tokenGenerator);
        $this->container = $container;
    }
    
    protected function onSuccess(UserInterface $user, $confirmation)
    {
		$user->setUsername($user->getEmail());
		$user->setPlainPassword(mt_rand());
		$user->setLocked(true);
		$user->setEnabled(false);
        $user->setCreatedAt(new \DateTime('now'));
		
		$em = $this->container->get('doctrine')->getEntityManager();
        		
        parent::onSuccess($user, $confirmation);
    }
}
