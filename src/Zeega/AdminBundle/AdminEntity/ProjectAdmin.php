<?php

namespace Zeega\AdminBundle\AdminEntity;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Validator\ErrorElement;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;

class ProjectAdmin extends Admin
{
    protected function configureRoutes(RouteCollection $collection)
    {
        $collection
            ->remove('create')
            ->remove('delete');

    }

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('title', null, array('required' => false))
            ->add('remixable', 'checkbox', array('label' => 'Remixable', 'required'  => false));
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('id')
            ->add('title');
    }
    
    protected $datagridValues = array(
        '_page' => 1,
        '_sort_order' => 'DESC', // sort direction 
        '_sort_by' => 'id' // field name 
    );
    

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('public_id')
            ->add('title')
            ->add('user');;
    }
}