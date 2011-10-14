<?php
namespace Zeega\EditorBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;
use Zeega\EditorBundle\Entity\Playground;

class PlaygroundType extends AbstractType {
    public function buildForm(FormBuilder $builder, array $options) {
        $builder->add('title','text',array('label'=>'Title'));
        $builder->add('short','text',array('label'=>'URL Short'));
    }

    public function getName() {
        return 'playground';
    }

    public function getDefaultOptions(array $options) {
        return array(
            'data_class' => 'Zeega\EditorBundle\Entity\Playground',
        );
    }
}
?>