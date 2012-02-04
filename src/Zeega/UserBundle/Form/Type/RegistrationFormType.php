<?php

namespace Zeega\UserBundle\Form\Type;

use Symfony\Component\Form\FormBuilder;
use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;

class RegistrationFormType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        parent::buildForm($builder, $options);

        // add your custom field
        $builder->add('bio');
		$builder->add('thumb_url');
		$builder->add('roles');
		$builder->add('playground', 'Zeega\EditorBundle\Entity\Playground');
    }

    public function gePlayground()
    {
        return 'zeega_user_registration';
    }
}