<?php

namespace Zeega\AdminBundle\AdminEntity;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Validator\ErrorElement;
use Sonata\AdminBundle\Form\FormMapper;

class SiteAdmin extends Admin
{
    protected $datagridValues = array(
           '_page' => 1,
           '_sort_order' => 'DESC', // sort direction 
           '_sort_by' => 'id' // field name 
       );
       
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
			->add('title')
			->add('short')
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
            ->addIdentifier('id')
			->addIdentifier('title')
			->add('short')
			->add('date_created')
        ;
    }

    public function validate(ErrorElement $errorElement, $object)
    {
    }
}