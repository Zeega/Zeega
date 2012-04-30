<?php

namespace Zeega\DataBundle\Repository;

use Doctrine\ORM\EntityRepository;

class SequenceRepository extends EntityRepository
{
	 public function findSequencesByProject($id){
   	 	return $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 'r')
			   ->add('from', ' ZeegaDataBundle:Sequence r')
			   ->join('r.project','p')
			   ->add('where', 'p.id = :id')
			   ->setParameter('id',$id)
			   ->getQuery()->execute();
   	 
   	 } 
}
