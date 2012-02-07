<?php

namespace Zeega\AdminBundle\AdminEntity;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Validator\ErrorElement;
use Sonata\AdminBundle\Form\FormMapper;

class UserAdmin extends Admin
{
    protected function configureFormFields(FormMapper $formMapper)
    {
		$roles = array('ROLE_USER' => 'User','ROLE_ADMIN'=>'Admin');
        $formMapper
            ->add('username')
			->add('display_name')
			->add('bio')
			->add('thumb_url')
			->add('email')
			->add('email')
			->add('playgrounds', 'entity', array('class' => 'Zeega\EditorBundle\Entity\Playground', 'multiple' => true, 'property' => 'short'))
			->add('roles', 'choice', array('choices' => $roles,'multiple' => true))
        ;
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('username')

        ;
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('username')
			->add('display_name')
			->add('email')
        ;
    }

    public function validate(ErrorElement $errorElement, $object)
    {
        $errorElement
            ->with('username')
                ->assertMaxLength(array('limit' => 32))
            ->end()
        ;
    }
}