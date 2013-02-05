<?php

namespace Zeega\UserBundle\Form\Type;

use Symfony\Component\Form\FormBuilderInterface;
use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;

class RegistrationFormType extends BaseType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('display_name',null, array('required' => true))
            ->add('email', 'email')
            ->add('plainPassword', 'repeated', array(
                'type' => 'password',
                'options' => array('translation_domain' => 'FOSUserBundle'),
                'invalid_message' => "The passwords don't match. Try again?",
                'error_bubbling' => true
            ));
    }

    public function getName()
    {
        return 'zeega_user_registration';
    }
}
