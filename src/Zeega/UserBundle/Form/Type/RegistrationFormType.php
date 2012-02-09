<?php

namespace Zeega\UserBundle\Form\Type;

use Symfony\Component\Form\FormBuilder;
use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;

class RegistrationFormType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        parent::buildForm($builder, $options);
		$roles = array('ROLE_USER' => 'User','ROLE_ADMIN'=>'Admin');
		
        // add your custom field
        $builder->add('display_name');
		$builder->add('bio');
		$builder->add('thumb_url');
		$builder->add('sites', 'entity', array('class' => 'Zeega\DataBundle\Entity\Site', 'multiple' => true, 'property' => 'short'));
		$builder->add('roles', 'choice', array('choices' => $roles,'multiple' => true));
    }

    public function geSite()
    {
        return 'zeega_user_registration';
    }
}