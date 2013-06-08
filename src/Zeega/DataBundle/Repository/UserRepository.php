<?php

namespace Zeega\DataBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class UserRepository extends DocumentRepository
{
    public function findOneById($id){
        if (is_numeric($id) ) {
            $user = parent::findOneBy(array("rdbms_id" => (int)$id));
        } else {
            $user = parent::findOneById($id);
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
