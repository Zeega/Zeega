<?php

namespace Zeega\UserBundle\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use FOS\UserBundle\Controller\RegistrationController as BaseController;
use Symfony\Component\HttpFoundation\Request;
use Zeega\UserBundle\Form\Type\RegistrationSocialFormType;
use Symfony\Component\HttpKernel\HttpKernelInterface;

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
            $user->setRequestExtraInfo(true);
            $this->container->get('fos_user.user_manager')->updateUser($user);
            $this->container->get('session')->set('fos_user_send_confirmation_email/email', $user->getEmail());
            
            $path = array('_controller'=> 'ZeegaEditorBundle:Editor:newProject', 'newUser' => true );
            $subRequest = $this->container->get('request')->duplicate( null, null, $path);

            $response = $this->container->get('http_kernel')->handle($subRequest, HttpKernelInterface::SUB_REQUEST);

            $this->authenticateUser($user, $response);

            return $response;
        }
		
		// user registration in progress or there are errors on the form -> render the registration page

        $route = $this->container->get('request')->get('_route');

        if ($route == "fos_user_register_mobile") {
            return $this->container->get('templating')->renderResponse('FOSUserBundle:Registration:register_mobile.html.'.$this->getEngine(), array(
                'form' => $form->createView(),
                'mobile' => True
            ));
        } else {
            return $this->container->get('templating')->renderResponse('FOSUserBundle:Registration:register.html.'.$this->getEngine(), array(
                'form' => $form->createView(),
                'mobile' => False
            ));
        }
        
    }

    public function registerSocialAction(Request $request)
    {
        $user = $this->container->get("security.context")->getToken()->getUser();
        $form = $this->container->get('form.factory')->create(new RegistrationSocialFormType(), $user);
        
        if ($request->isMethod('POST')) {
            $data = $this->container->get('request')->request->get('zeega_user_registration_social');
            $username = $data["username"];
            $email = $data["email"];

            $user->setRequestExtraInfo(false); 
            $user->setUsername($username);
            $user->setEmail($email);
            $this->container->get('fos_user.user_manager')->updateUser($user);

            $path = array('_controller'=> 'ZeegaEditorBundle:Editor:newProject', 'newUser' => true );
            $subRequest = $this->container->get('request')->duplicate( null, null, $path);

            return $this->container->get('http_kernel')->handle($subRequest, HttpKernelInterface::SUB_REQUEST);
        }

        $formView = $this->container->get('templating')->render('FOSUserBundle:Registration:register_complete.html.twig', array(
            'form' => $form->createView(),
            'id' => $user->getId()
        ));

        return new Response($formView);
    }
}
