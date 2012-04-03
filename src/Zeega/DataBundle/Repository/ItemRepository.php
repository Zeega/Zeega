<?php

// src/Zeega/\CoreBundle\/Repository/ItemRepository.php
namespace Zeega\DataBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\Common\Collections;
use DateInterval;

use DateTime;

class ItemRepository extends EntityRepository
{
    private function buildSearchQuery($qb, $query)
    {
        $qb->andwhere('i.enabled = 1');
        
		// query string ANDs - works for now; low priority
        if(isset($query['queryString']))
        {
			$queryString = $query['queryString'];
			if(count($queryString) == 1)
			{
				if(strlen($queryString[0]))
				{
	            	$qb->where('i.title LIKE :query_string')
	               		->orWhere('i.media_creator_username LIKE :query_string')
	               		->orWhere('i.description LIKE :query_string')
	               		->setParameter('query_string','%' . $queryString[0] . '%');
				}
			}
			else if(count($queryString) > 1)
			{
				for($i=0; $i < count($queryString); $i++)
				{ 
					$qb->andWhere('i.title LIKE :query_string'.$i . ' OR i.media_creator_username LIKE :query_string'.$i . ' OR i.description LIKE :query_string'.$i)
	               		->setParameter('query_string'.$i,'%' . $queryString[$i] . '%');            	
				}
			}
        }
        
        if(isset($query['userId']))
      	{
			$qb->andWhere('i.user_id = ?2')
			   ->setParameter(2,$query['userId']);
		}
		
		if(isset($query['siteId']))
      	{
			$qb->andWhere('i.site_id = :site')
			   ->setParameter('site',$query['siteId']);
		}
		
		if(isset($query['collection_id']))
      	{
			 $qb->innerjoin('i.parent_items', 'c')
                ->andWhere('c.id = ?3')
                ->setParameter(3, $query['collection_id']);
		}
		
		if(isset($query['notContentType']))
      	{
      	    $content_type = strtoupper($query['notContentType']);

      	  	$qb->andWhere('i.media_type <> :not_content_type')->setParameter('not_content_type', $query['notContentType']);
		}
		
        if(isset($query['contentType']))
      	{
      	    $content_type = strtoupper($query['contentType']);

      	  	$qb->andWhere('i.media_type = ?4')->setParameter(4, $query['contentType']);
		}
		
		if(isset($query['tags']))
      	{
			 $qb->innerjoin('i.tags', 'it')
			    ->innerjoin('it.tag','t')
                ->andWhere('t.id IN (?5)')
                ->setParameter(5, $query['tags']);
		}
		
		if(isset($query['tagsName']))
      	{
			 $qb->innerjoin('i.tags', 'it')
			    ->innerjoin('it.tag','t')
                ->andWhere('t.name IN (:tags_name)')
                ->setParameter('tags_name', $query['tagsName']);
		}
		
		if(isset($query['earliestDate']))
      	{
			 $qb->andWhere('i.media_date_created >= ?6')
			    ->setParameter(6, $query['earliestDate']);
		}
        
        if(isset($query['latestDate']))
      	{
			 $qb->andWhere('i.media_date_created <= ?7')
			    ->setParameter(7, $query['latestDate']);
		}
		
		if(isset($query['not_item_id']))
      	{
			 $qb->andWhere('i.id <> (:not_item_id)')
                ->setParameter('not_item_id', $query['not_item_id']);
		}
		
		if(isset($query['geo']))
      	{
      	     $qb->andWhere($qb->expr()->between('i.media_geo_latitude', $query['geo']['south'], $query['geo']['north']))
				->andWhere($qb->expr()->between('i.media_geo_longitude', $query['geo']['west'], $query['geo']['east']));
		}
		
		return $qb;
    }
    
	public function getTotalItemsAndCollections($query)
	{
		
		$qb = $this->getEntityManager()->createQueryBuilder();
		$qb->select('COUNT(i)')
	       ->from('ZeegaDataBundle:Item', 'i');
		   
	    $qb = $this->buildSearchQuery($qb, $query);
		
		return intval($qb->getQuery()->getSingleScalarResult());
		
		//return 0;
	}
	
	public function getTotalItems($query)
	{
		
		$qb = $this->getEntityManager()->createQueryBuilder();
		$qb->select('COUNT(i)')
	       ->from('ZeegaDataBundle:Item', 'i');
		   
	    $qb = $this->buildSearchQuery($qb, $query);
		$qb->andWhere('i.media_type <> :count_filter')->setParameter('count_filter', 'Collection');
		
		return intval($qb->getQuery()->getSingleScalarResult());
		
		//return 0;
	}
	
	public function getTotalCollections($query)
	{
		$qb = $this->getEntityManager()->createQueryBuilder();
		$qb->select('COUNT(i)')
	       ->from('ZeegaDataBundle:Item', 'i');

	    $qb = $this->buildSearchQuery($qb, $query);
		$qb->andWhere('i.media_type = :count_filter')->setParameter('count_filter', 'Collection');
		return intval($qb->getQuery()->getSingleScalarResult());
	}
	
	public function getQueryTags($query)
	{
		$qb = $this->getEntityManager()->createQueryBuilder();
		$qb->select('tg.name,tg.id,COUNT(tg.id) as occurrences')
           ->from('ZeegaDataBundle:Tag', 'tg')
           ->innerjoin('tg.item', 'tgit')
		   ->innerjoin('tgit.item', 'i')
		   ->setMaxResults(5)
		   ->groupBy('tg')
		   ->orderBy('occurrences','DESC');
		$qb = $this->buildSearchQuery($qb, $query);
		return $qb->getQuery()->getArrayResult();
	}

    //  api/search
    public function searchItems($query)
    {   
        $em = $this->getEntityManager();
        $qb = $em->createQueryBuilder();
    
        // search query
        $qb->select('i')
            ->from('ZeegaDataBundle:Item', 'i')
            ->orderBy('i.id','DESC')
       		->setMaxResults($query['limit'])
       		->setFirstResult($query['limit'] * $query['page']);
        
        $qb = $this->buildSearchQuery($qb, $query);
        
        if(isset($query["arrayResults"]) && $query["arrayResults"] === true)
            return $qb->getQuery()->getArrayResult();
        else
            return $qb->getQuery()->execute();
    }

    //  api/search
    public function searchItemsByTimeDistribution($query)
    {
        $results = array();
 		$max_date = null;
        $min_date = null;

        if(isset($query['dateIntervals']) && $query["latestDate"] && $query["earliestDate"])
      	{
      	    $qb = $this->getEntityManager()->createQueryBuilder();
            
      	    $qb->select('COUNT(i.id)')
                ->from('ZeegaDataBundle:Item', 'i');

      	    $searchQuery = $this->buildSearchQuery($qb, $query);
            
			// get min and max dates
			$qbMinMax = $this->getEntityManager()->createQueryBuilder();
            $qbMinMax->select('MAX(i.media_date_created) as max_date,MIN(i.media_date_created) as min_date')
                	 ->from('ZeegaDataBundle:Item', 'i'); 
			
			$minMaxQuery = $this->buildSearchQuery($qbMinMax, $query);
			$minMaxBounds = $minMaxQuery->getQuery()->getArrayResult();
			$min_date = $minMaxBounds[0]["min_date"];
			$max_date = $minMaxBounds[0]["max_date"];
			
			
			if(!isset($min_date) || !isset($max_date))
			{
				// nothing to return; let's get out of here quickly with defaults for min and max date
				return array("results" => $results, "min_date" => $query["earliestDate"]->getTimeStamp(), "max_date" => $query["latestDate"]->getTimeStamp());
			}
			else
			{
				// parse the dates and continue
				$min_date = new DateTime($minMaxBounds[0]["min_date"]);
				$max_date = new DateTime($minMaxBounds[0]["max_date"]);
			}
				
			
      	    $dateIntervals = intval($query['dateIntervals']);
      	    $startDate = $min_date;
      	    $endDate = $max_date;
      	    
      	    // offset in seconds
      	    $intervalOffset = ($endDate->getTimestamp() - $startDate->getTimestamp()) / $dateIntervals;

      	    for ($i = 0; $i <= $dateIntervals-1; $i++) 
      	    {
                $startDateOffset = $intervalOffset * $i;
				if($startDateOffset != 0) $startDateOffset = $startDateOffset + 1;
                $endDateOffset = $intervalOffset * ($i + 1);
                
                $currStartDate = new DateTime();
                $currStartDate->setTimestamp($startDate->getTimestamp() + $startDateOffset);
                
                $currEndDate = new DateTime();
                $currEndDate->setTimestamp($startDate->getTimestamp() + $endDateOffset);
                
                $searchQuery->setParameter(6, $currStartDate);
                $searchQuery->setParameter(7, $currEndDate);
                
                $tmp = array();
                $tmp["start_date"] = $currStartDate->getTimestamp();
                $tmp["end_date"] = $currEndDate->getTimestamp();
                $tmp["items_count"] = $searchQuery->getQuery()->getSingleScalarResult();

		        array_push($results, $tmp);
		  	}
		}
		
        return array("results" => $results, "min_date" => $min_date->getTimeStamp(), "max_date" => $max_date->getTimeStamp());
    }    
    
    //  api/search
    public function searchCollectionItems($query)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        
        // search query
		$qb->select('i')
	       ->from('ZeegaDataBundle:Item', 'i')
           ->orderBy('i.id','DESC')
       	   ->setMaxResults($query['limit'])
       	   ->setFirstResult($query['limit'] * $query['page']);

	    $qb = $this->buildSearchQuery($qb, $query);

        // execute the query
        return $qb->getQuery()->getArrayResult();
    }
    
    //  api/collections/{col_id}
    public function searchCollectionById($id)
    {
     	return $this->getEntityManager()
				    ->createQueryBuilder()
				    ->add('select', 'i')
			        ->add('from', ' ZeegaDataBundle:Item i')
			        ->andwhere('i.id = :id')
			        ->andwhere("i.media_type = 'Collection'")
			        ->andwhere("i.enabled = 1")
			        ->setParameter('id',$id)
			        ->getQuery()
			        ->getArrayResult();
    }
    
    //  api/collections/{col_id}
    public function searchItemsByTags($query)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
		
		// search query
		$qb->select('i')
		   ->from('ZeegaDataBundle:Item', 'i')
	       ->orderBy('i.id','DESC')
	       ->setMaxResults($query['limit'])
	       ->setFirstResult($query['limit'] * $query['page']);

		$qb = $this->buildSearchQuery($qb, $query);
		
		return $qb->getQuery()->getArrayResult();
    }
    
    public function findItemById($id)
    {
        return $this->getEntityManager()
    			->createQueryBuilder()
    			->add('select', 'i')
    		   ->add('from', ' ZeegaDataBundle:Item i')
    		   ->andwhere('i.id = :id')
    		   ->andwhere('i.enabled = 1')
    		   ->setParameter('id',$id)
    		   ->getQuery()
    		   ->getArrayResult();
    }
     
    public function findUserItems($id)
    {
     	return $this->getEntityManager()
			   ->createQueryBuilder()
			   ->add('select', 'i.id,i.title,i.thumbnail_url')
			   ->add('from', ' ZeegaDataBundle:Item i')
			   ->innerJoin('i.user', 'u')
			   ->andwhere('u.id = :id')
			   ->andwhere('i.enabled = 1')
			   ->setParameter('id',$id)
			    ->orderBy('i.id','DESC')
			   ->getQuery()
			   ->setMaxResults(15)
			   ->getArrayResult();
    }
}

