<?php

namespace Zeega\DataBundle\Repository;

use Doctrine\ORM\EntityRepository;

class ProjectRepository extends EntityRepository
{
    public function findProjectsByUser($userId,$limit = null,$published = null)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->add('select', 'p')
			->add('from', 'ZeegaDataBundle:Project p')
            ->join('p.users', 'u')
            ->add('where', 'u.id = :userId')
            ->setParameter('userId',$userId)
            ->andwhere('p.enabled = true')
            ->orderBy('p.id','DESC');
 				       
 		if(null !== $published) {
 	        $qb->andwhere('p.published = :published')->setParameter('published', $published);
 		}

        if(null !== $limit) {
            $qb->setMaxResults($limit);
        }

 		return $qb->getQuery()->getResult();
    }
}
