<?php

// src/Zeega/\CoreBundle\/Repository/ItemTagsRepository.php
namespace Zeega\DataBundle\Repository;

use Doctrine\ORM\EntityRepository;

class ItemTagsRepository extends EntityRepository
{
    public function searchItemTags($itemId)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

            // search query
            $qb->select('t')
               ->from('ZeegaDataBundle:Tag', 't')
               ->innerjoin('t.item', 'i')
               ->where('i.item = ?1')
               ->setParameter(1,$itemId);
           
            // execute the query
            return $qb->getQuery()->getArrayResult();
    }
    

    
    
}

