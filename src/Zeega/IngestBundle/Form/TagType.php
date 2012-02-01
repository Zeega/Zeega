<?php

namespace Zeega\IngestBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;

class TagType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder
            ->add('id')
            ->add('name')
            ->add('date_created')
            ->add('user')
            ->add('description')
        ;
    }

    public function getName()
    {
        return 'zeega_ingestbundle_tagtype';
    }
}
