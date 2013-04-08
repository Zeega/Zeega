<?php

namespace Zeega\DataBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class ProjectRepository extends DocumentRepository
{
    public function findProjectsByUser($userId,$limit = null,$published = null)
    {
        $qb = $this->createQueryBuilder('Project')
            ->find()
            ->field('user.id')->equals($userId);
        
        if(null !== $published) {
 	        $qb->field('published')->equals($published);
 		}

        if(null !== $limit) {
            $qb->limit($limit);
        }

 		return $qb->getQuery()->execute();
    }

    public function findProjectsByUserSmall($userId)
    {
        $qb = $this->createQueryBuilder();
        $qb->select('p.id, p.title')
            ->add('from', 'ZeegaDataBundle:Project p')
            ->join('p.users', 'u')
            ->add('where', 'u.id = :userId')
            ->setParameter('userId',$userId)
            ->andwhere('p.enabled = true')
            ->orderBy('p.id','DESC');
                       
        return $qb->getQuery()->getArrayResult();
    }
}
