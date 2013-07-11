<?php

namespace Zeega\DataBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class UserRepository extends DocumentRepository
{
    public function findOneById($id){
        if(strlen($id) == 24) {
            $user = parent::findOneById($id);
        } else {
            $user = parent::findOneBy(array("username" => $id));
        }

        return $user;
    }
    
    public function findUsersCountByDates($dateBegin, $dateEnd )
    {
        $qb = $this->createQueryBuilder('User');
        $qb ->eagerCursor(true)
            ->field('createdAt')->range( $dateBegin, $dateEnd );
                      
        return $qb->getQuery()->execute()->count();
    }

    public function findNewUsersCountByDates( $dateBegin, $dateEnd )
    {
        $qb = $this->createQueryBuilder('User')
            ->select('id')
            ->field('createdAt')->gte($dateBegin)
            ->field('createdAt')->lte($dateEnd);   

        return $qb->getQuery()->execute()->count();
    }
}
