<?php

namespace Zeega\AdminBundle\AdminEntity;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Validator\ErrorElement;
use Sonata\AdminBundle\Form\FormMapper;

class PlaygroundAdmin extends Admin
{
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
			->add('title')
			->add('short')
			->add('created_at')
        ;
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('id')
			->add('title')
			->add('short')
        ;
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->add('id')
			->add('title')
			->add('short')
			->add('published')
			->add('created_at')
        ;
    }

    public function validate(ErrorElement $errorElement, $object)
    {
    }
}