<?php

namespace Zeega\UserBundle\Form\Type;

use Symfony\Component\Form\FormBuilderInterface;
use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;

class RegistrationFormType extends BaseType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('displayName',null, array('required' => true))
            ->add('email', 'email', array('required' => true))
            ->add('plainPassword', 'password', array(
                'error_bubbling' => true,
                'required' => true
            ));
    }

    public function getName()
    {
        return 'zeega_user_registration';
    }
}
