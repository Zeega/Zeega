<?php

namespace Zeega\DataBundle\Repository;

use Doctrine\ORM\EntityRepository;

class LayerRepository extends EntityRepository
{
    public function findLayersByProject($projectId)
    {
		return $this->getEntityManager()
        			->createQueryBuilder()
        			->add('select', 'u.id,l')
        			->add('from', 'ZeegaDataBundle:Layer l')
					->innerJoin('l.sequences', 'u')
 					->getQuery()
 					->getArrayResult();
	}
}
