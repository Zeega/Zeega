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
                    ->andWhere('n.enabled = true')
                    ->orderBy('n.sequence_index','ASC')
             		->setParameter('id',$id)
             		->getQuery()
             		->getResult();
    }
	
	public function findIdBySequenceId($id)
    {
        return $this->getEntityManager()
                    ->createQueryBuilder()
                    ->add('select', 'n.id')
                    ->add('from', 'ZeegaDataBundle:Frame n')
                    ->add('where', 'n.sequence = :id')
                    ->andWhere('n.enabled = true')
                    ->orderBy('n.sequence_index','ASC')
             		->setParameter('id',$id)
             		->getQuery()
             		->getResult();
    }
    
}
