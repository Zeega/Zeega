<?php

namespace Zeega\DataBundle\Repository;

use Doctrine\ORM\EntityRepository;


class FrameRepository extends EntityRepository
{
    public function findFramesBySequenceId($id)
    {
        return $this->getEntityManager()
                    ->createQueryBuilder()
                    ->add('select', 'n')
                    ->add('from', 'ZeegaDataBundle:Frame n')
                    ->add('where', 'n.sequence = :id')
             		->setParameter('id',$id)
             		->orderBy('n.sequence_index','ASC')
             		->getQuery()
             		->getArrayResult();
    }
}
