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
        $qb = $this->createQueryBuilder('Project')
            ->find()
            ->select('id', 'title')
            ->field('user.id')->equals($userId)
            ->field('enabled')->equals(true)
            ->sort('id', 'desc');

        return $qb->getQuery()->execute();
    }
}
