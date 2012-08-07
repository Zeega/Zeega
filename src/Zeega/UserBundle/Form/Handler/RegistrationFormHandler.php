<?php

namespace Zeega\UserBundle\Form\Handler;

use FOS\UserBundle\Form\Handler\RegistrationFormHandler as BaseHandler;
use FOS\UserBundle\Model\UserInterface;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;
use FOS\UserBundle\Entity\UserManager;
use FOS\UserBundle\Mailer\Mailer;
use Symfony\Component\DependencyInjection\ContainerInterface;

class RegistrationFormHandler extends BaseHandler
{
    public function __construct(Form $form, Request $request, UserManager $userManager, Mailer $mailer, ContainerInterface $container)
    {
        parent::__construct($form, $request, $userManager, $mailer);
        $this->container = $container;
    }
    
    protected function onSuccess(UserInterface $user, $confirmation)
    {
		$user->setUsername($user->getEmail());
		$user->setPlainPassword(mt_rand());
		$user->setLocked(true);
		$user->setEnabled(false);
		
		$em = $this->container->get('doctrine')->getEntityManager();
        
        $site = $em->getRepository('ZeegaDataBundle:Site')->findOneById(1);
		$user->addSite($site);
		
        parent::onSuccess($user, $confirmation);
    }
}
