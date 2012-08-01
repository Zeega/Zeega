<?php

namespace Zeega\UserBundle\Form\Type;

use Symfony\Component\Form\FormBuilder;
use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;

class RegistrationFormType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder
            ->add('display_name')
            ->add('email', 'email')
            ->add('idea')
            ->add('plainPassword', 'hidden');
        
    }

    public function geSite()
    {
        return 'zeega_user_registration';
    }
}