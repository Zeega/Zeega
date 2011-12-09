<?php

// src/Zeega/IngestBundle/Repository/ItemTagsRepository.php
namespace Zeega\IngestBundle\Repository;

use Doctrine\ORM\EntityRepository;

class ItemTagsRepository extends EntityRepository
{
    //  api/search
    public function searchDistinctTags()
    {
          $qb = $this->getEntityManager()->createQueryBuilder();

            // search query
            $qb->select('i')
                ->from('ZeegaIngestBundle:Item', 'i')
                ->innerjoin('i.parent_items', 'c')
                ->orderBy('i.id','DESC')
         ;

            // execute the query
            return $qb->getQuery()->getArrayResult();
    }

}

