<?php

// src/Zeega/\CoreBundle\/Repository/ItemRepository.php
namespace Zeega\DataBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\Common\Collections;
use DateInterval;
use Doctrine\ORM\Query\ResultSetMapping;
use DateTime;

class ItemRepository extends EntityRepository
{
    private function buildSearchQuery($qb, $query)
    {
        if(isset($query['user'])) {
			$qb->andWhere('i.user = :userId')
               ->setParameter('userId', $query['user']);
		}
		
		if(isset($query['collection']))
      	{
			 $qb->innerjoin('i.parentItems', 'c')
                ->andWhere('c.id = ?3')
                ->setParameter(3, $query['collection']);
		}
		
		if(isset($query['type'])) {
            $mediaTypes = explode(" AND ", $query['type']);
            foreach($mediaTypes as $mediaType) {
                if("project" !== $mediaType) {
                    $mediaType = ucfirst($mediaType);
                }

                if(preg_match("/-/",$query['type'])) {
                    $mediaType = str_replace("-","",$mediaType);
                    $qb->andWhere("i.mediaType <> :not_content_type_$mediaType")->setParameter("not_content_type_$mediaType", $mediaType);
                } else {
                    $qb->andWhere("i.mediaType = :content_type_$mediaType")->setParameter("content_type_$mediaType", $mediaType);
                }
            }
    	}
		
		if(isset($query['earliestDate']))
      	{
			 $qb->andWhere('i.mediaDateCreated >= ?6')
			    ->setParameter(6, $query['earliestDate']);
		}
        
        if(isset($query['latestDate']))
      	{
			 $qb->andWhere('i.mediaDateCreated <= ?7')
			    ->setParameter(7, $query['latestDate']);
		}
		
		if(isset($query['not_item_id']))
      	{
			 $qb->andWhere('i.id <> (:not_item_id)')
                ->setParameter('not_item_id', $query['not_item_id']);
		}
		
        if(isset($query['enabled'])) {
             $qb->andWhere('i.enabled = :enabled')
                ->setParameter('enabled', $query['enabled']);
        }

        if(isset($query['published'])) {
             $qb->andWhere('i.published = :published')
                ->setParameter('published', $query['published']);
        }
		
		return $qb;
    }
   
	public function getTotalItems($query)
	{
		
		$qb = $this->getEntityManager()->createQueryBuilder();
		$qb->select('COUNT(i)')
	       ->from('ZeegaDataBundle:Item', 'i');
		   
	    $qb = $this->buildSearchQuery($qb, $query);
		$qb->andWhere('i.mediaType <> :count_filter')->setParameter('count_filter', 'Collection');
		
		return intval($qb->getQuery()->getSingleScalarResult());
		
		//return 0;
	}
	
    //  api/search
    public function searchItems($query)
    {   
        $em = $this->getEntityManager();
        $qb = $em->createQueryBuilder();
    
        // search query
        $qb->select('i')->from('ZeegaDataBundle:Item', 'i')->setMaxResults($query['limit'])->setFirstResult($query['limit'] * $query['page']);
        
        if(isset($query['sort'])) {
	      	$sort = $query['sort'];
      	 	if($sort == 'date-desc') {
                $qb->orderBy('i.dateCreated','DESC')->groupBy("i.id");
            } else if($sort == 'date-asc') {
                $qb->orderBy('i.dateCreated','ASC')->groupBy("i.id");
            } else {
				$qb->orderBy('i.id','DESC');
			}
		} else {
			$qb->orderBy('i.id','DESC');
		}

        $qb = $this->buildSearchQuery($qb, $query);
        
        return $qb->getQuery()->getArrayResult();
    }
	
	//  api/search
    public function findOneByIdWithUser($id)
    {   
        $em = $this->getEntityManager();
        $qb = $em->createQueryBuilder();
    
        // search query
        $qb->select('i,u.displayName,u.username')
            ->from('ZeegaDataBundle:Item', 'i')
            ->innerjoin('i.user', 'u')
            ->orderBy('i.id','DESC')
       		->where('i.id = :id')
       		->setParameter('id', $id);
        
    	$res = $qb->getQuery()->getArrayResult();
    	if(isset($res) && is_array($res) && count($res) == 1 && count($res[0]) == 3 ) {
            $result = $res[0][0];
            $result["displayName"] = $res[0]["displayName"];
            $result["username"] = $res[0]["username"];
            return $result;
    	}
    	return null;
    }
	
    //  api/search
    public function searchCollectionItems($query)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        
        // search query
		$qb->select('i')
	       ->from('ZeegaDataBundle:Item', 'i')
           ->orderBy('i.id','ASC')
       	   ->setMaxResults($query['limit'])
       	   ->setFirstResult($query['limit'] * $query['page']);

	    $qb = $this->buildSearchQuery($qb, $query);

        // execute the query
        return $qb->getQuery()->getArrayResult();
    }
	
    public function findUriByUserArchive($userId, $archive, $maxResults = null)
    {
        $em = $this->getEntityManager();
        $qb = $em->createQueryBuilder();
    
        // search query
        $qb->select('i.uri')
            ->from('ZeegaDataBundle:Item', 'i')
            ->where('i.user = :userId')
            ->andWhere('i.archive = :archive')
            ->setParameter('userId', $userId)
            ->setParameter('archive', $archive)
            ->orderBy('i.id','DESC');

        if(null !== $maxResults && is_int($maxResults)) {
            $qb->setMaxResults($maxResults);
        }
        
        $doctrineResults = $qb->getQuery()->getResult();
        
        if(null !== $doctrineResults) {
            // getting rid of the nested array hydrated by Doctrine; currently there's no way to avoid this without writing a new hydrator
            $return = array();
            array_walk_recursive($doctrineResults, function($a) use (&$return) { $return[] = $a; });
            return array_flip($return);
        } else {
            return null;
        }
    }
}