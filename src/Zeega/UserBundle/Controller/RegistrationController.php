<?php

namespace Zeega\UserBundle\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use FOS\UserBundle\Controller\RegistrationController as BaseController;

class RegistrationController extends BaseController
{
    public function registerAction()
    {
		$user = $this->container->get('security.context')->getToken()->getUser();
        $form = $this->container->get('fos_user.registration.form');
        $formHandler = $this->container->get('fos_user.registration.form.handler');
        $confirmationEnabled = $this->container->getParameter('fos_user.registration.confirmation.enabled');

        $process = $formHandler->process($confirmationEnabled); // validate the form data
        if ($process) 
        {
            $user = $form->getData();
            
            // send a confirmation email to the user
            if ($confirmationEnabled) 
            {
                $this->container->get('session')->set('fos_user_send_confirmation_email/email', $user->getEmail());
                $sequence = 'fos_user_registration_check_email';
            } 
            else 
            {
                $sequence = 'fos_user_registration_confirmed';
            }
            
            // user registration successful -> render the success page
            return $this->container->get('templating')->renderResponse('FOSUserBundle:Registration:register_success.html.'.$this->getEngine(), array());
        }
		
		// user registration in progress or there are errors on the form -> render the registration page
        return $this->container->get('templating')->renderResponse('FOSUserBundle:Registration:register.html.'.$this->getEngine(), array(
            'form' => $form->createView(),
            'theme' => $this->container->getParameter('fos_user.template.theme')));
    }
}
