<?php

namespace Zeega\AdminBundle\AdminEntity;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Validator\ErrorElement;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;

class ItemAdmin extends Admin
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
            ->add('title')
            ->add('description')
            ->add('headline')
            ->add('text')
            ->add('uri')
            ->add('attributionUri')
            ->add('thumbnailUrl')
            ->add('mediaCreatorUsername')
            ->add('mediaCreatorRealname')
            ->add('enabled')
            ->add('enabled', 'checkbox', array('label' => 'Enabled', 'required'  => false));
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('id')
            ->add('uri')
            ->add('title')
            ->add('enabled')         
        ;
    }
    
    protected $datagridValues = array(
        '_page' => 1,
        '_sort_order' => 'DESC', // sort direction 
        '_sort_by' => 'id' // field name 
    );
    

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('id')
            ->add('title')
            ->add('attributionUri');
    }
}