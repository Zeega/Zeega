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
                    ->orderBy('n.sequence_index','ASC')
             		->setParameter('id',$id)
             		->getQuery()
             		->getArrayResult();
    }
	
	public function findByProjectId($id)
    {
        return $this->getEntityManager()
                    ->createQueryBuilder()
                    ->select('f')
                    ->from('ZeegaDataBundle:Frame','f')
					->innerjoin('f.sequence', 's')
					->innerjoin('s.project', 'p')
                    ->where('p.id = :project_id')
		            ->setParameter('project_id', $id)
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
                    ->orderBy('n.sequence_index','ASC')
             		->setParameter('id',$id)
             		->getQuery()
             		->getResult();
    }
    
}
