<?php

namespace Zeega\DataBundle\Repository;

use Doctrine\ORM\EntityRepository;

class SequenceRepository extends EntityRepository
{
	 	 public function findSequencesCountByProject($id)
   	 {
   	     $query = $this->getEntityManager()
     			 	->createQueryBuilder()
     				->add('select', 'COUNT(r.id)')
     			   ->add('from', ' ZeegaDataBundle:Sequence r')
     			   ->join('r.project','p')
     			   ->add('where', 'p.id = :id')
             ->andWhere('r.enabled = true')
     			   ->setParameter('id',$id)
     			   ->getQuery();
		    return $query->getSingleScalarResult();
   	 } 
}
