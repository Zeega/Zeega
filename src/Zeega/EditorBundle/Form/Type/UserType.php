<?php
namespace Zeega\EditorBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;
use Zeega\UserBundle\Entity\User;

class UserType extends AbstractType {
    public function buildForm(FormBuilder $builder, array $options) {
        $builder->add('username','text',array('label'=>'Username'));
        $builder->add('displayName','text',array('label'=>'Display Name'));
        $builder->add('email','email',array('label'=>'Email'));
        
        /* this field type lets you show two fields that represent just
           one field in the model and they both must match */
        $builder->add('password', 'repeated', array (
            'type'            => 'password',
            'first_name'      => "Password",
            'second_name'     => "Re-enter Password",
        ));
    }

    public function getName() {
        return 'user';
    }

    public function getDefaultOptions(array $options) {
        return array(
            'data_class' => 'Zeega\UserBundle\Entity\User',
        );
    }
}
?>