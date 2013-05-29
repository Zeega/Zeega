<?php

namespace Zeega\DataBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class FavoriteRepository extends DocumentRepository
{
    public function findFavoriteUsers($projectId, $limit = null)
    {
        $qb = $this->createQueryBuilder('Favorite')
            ->select('id','project','user')
            ->eagerCursor(true)
            ->field('project.id')->equals($projectId);
        
        return $qb->getQuery()->execute();
    }
}
