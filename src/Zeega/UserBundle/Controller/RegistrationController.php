<?php

namespace Zeega\UserBundle\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use FOS\UserBundle\Controller\RegistrationController as BaseController;

class RegistrationController extends BaseController
{
    public function registerAction()
    {
        $form = $this->container->get('fos_user.registration.form');
        $formHandler = $this->container->get('fos_user.registration.form.handler');
        $confirmationEnabled = $this->container->getParameter('fos_user.registration.confirmation.enabled');

        $process = $formHandler->process($confirmationEnabled); // validate the form data
        if ($process) 
        {
            $user = $form->getData();
            $user->setConfirmationToken(null);
            $user->setEnabled(true);
            $user->setLastLogin(new \DateTime());
            $user->addRole("ROLE_CUTTINGEDGE");
            $this->container->get('fos_user.user_manager')->updateUser($user);
            $this->container->get('session')->set('fos_user_send_confirmation_email/email', $user->getEmail());
            $response = new RedirectResponse($this->container->get('router')->generate('ZeegaCommunityBundle_dashboard'));
            $this->authenticateUser($user, $response);

            return $response;
        }
		
		// user registration in progress or there are errors on the form -> render the registration page
        return $this->container->get('templating')->renderResponse('FOSUserBundle:Registration:register.html.'.$this->getEngine(), array(
            'form' => $form->createView(),
        ));
    }
}
