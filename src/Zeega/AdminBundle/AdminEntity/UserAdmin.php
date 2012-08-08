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
			->add('sites', 'entity', array('class' => 'Zeega\DataBundle\Entity\Site', 'multiple' => true, 'property' => 'short'))
			->add('roles', 'choice', array('choices' => $roles,'multiple' => true))
        ;
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('username')

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
            ->addIdentifier('username')
			->add('display_name')
			->add('email')
			->add('last_login','datetime')
			->add('locked')
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
    
    public function getBatchActions()
    {
        // retrieve the default (currently only the delete action) actions
        $actions = parent::getBatchActions();

        $actions['activate'] = array(
                'label'            => 'Activate Users',
                'ask_confirmation' => true
            );

        return $actions;
    }
}