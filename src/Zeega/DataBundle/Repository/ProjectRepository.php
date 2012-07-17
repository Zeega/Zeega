<?php

namespace Zeega\DataBundle\Repository;

use Doctrine\ORM\EntityRepository;

class ProjectRepository extends EntityRepository
{
    public function findProjectsBySite($id)
    {
        $query= $this->getEntityManager()
				     ->createQueryBuilder()
				     ->add('select', 'p')
		             ->add('from', ' ZeegaDataBundle:Project p')
			         ->innerJoin('p.site', 'g')
			         ->add('where', 'g.id = :id')
			         ->andwhere('p.enabled = true')
			         ->setParameter('id',$id)
			         ->orderBy('p.id','DESC')
			         ->getQuery();

		return $query->getArrayResult();
    }
     
    public function findProjectsBySiteAndUser($siteId,$userId)
    {
     	$query= $this->getEntityManager()
				     ->createQueryBuilder()
				     ->add('select', 'p')
			   	     ->add('from', 'ZeegaDataBundle:Project p')
			         ->innerJoin('p.site', 's')
			         ->join('p.users', 'u')
			         ->add('where', 'u.id = :userId')
			         ->andWhere('s.id = :siteId')
			         ->andwhere('p.enabled = true')
			         ->setParameters(array('siteId'=>$siteId,'userId'=>$userId))
				     ->orderBy('p.id','DESC')
				     ->getQuery();
				    
		return $query->getArrayResult();
     }
     
     public function findProjectsByUser($userId,$limit)
     {
      	$query= $this->getEntityManager()
 				     ->createQueryBuilder()
 				     ->add('select', 'p')
 			   	     ->add('from', 'ZeegaDataBundle:Project p')
 			         ->join('p.users', 'u')
 			         ->add('where', 'u.id = :userId')
 			         ->andwhere('p.enabled = true')
 			         ->setParameters(array('userId'=>$userId))
 				     ->orderBy('p.id','DESC')
 				     ->setMaxResults($limit)
 				     ->getQuery();

 		return $query->getResult();
      }
}
