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
        $qb->andwhere('i.enabled = true');
        
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
		
        if(isset($query["contentType"]))
      	{
			if(strtoupper($query["contentType"]) == 'COLLECTION')
            {
                $qb->andwhere("i.media_type = 'Collection'");
            }
            else
            {
                $qb->andwhere("i.media_type = :content")->setParameter('content',$query["contentType"]);
            }
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
    public function findOneByIdWithUser($id)
    {   
        $em = $this->getEntityManager();
        $qb = $em->createQueryBuilder();
    
        // search query
        $qb->select('i,u.display_name')
            ->from('ZeegaDataBundle:Item', 'i')
            ->innerjoin('i.user', 'u')
            ->orderBy('i.id','DESC')
       		->where('i.id = :id')
       		->setParameter('id', $id);
        
    	$res = $qb->getQuery()->getSingleResult();
    	if(isset($res) && count($res) > 0)
    	{
    		return $res[0];
    	}
    	return $res;
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

	//  api/search
    public function searchItemsParentsById($id)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        
        // search query
		$qb->select('i')
	       ->from('ZeegaDataBundle:Item', 'i')
		   ->innerjoin('i.child_items', 'c')
           ->where('c.id = :child_items')
           ->setParameter('child_items', $id)
           ->orderBy('i.id','DESC');

        // execute the query
        return $qb->getQuery()->getResult();
    }
    
    public function findUserItems($id)
    {
     	return $this->getEntityManager()
			   ->createQueryBuilder()
			   ->add('select', 'i.id,i.title,i.thumbnail_url')
			   ->add('from', ' ZeegaDataBundle:Item i')
			   ->innerJoin('i.user', 'u')
			   ->andwhere('u.id = :id')
			   ->andwhere('i.enabled = true')
			   ->setParameter('id',$id)
			    ->orderBy('i.id','DESC')
			   ->getQuery()
			   ->setMaxResults(15)
			   ->getArrayResult();
    }
	
	public function findUserCollections($userId,$siteId)
 	{
 		$rsm = new ResultSetMapping;
		$rsm->addEntityResult('ZeegaDataBundle:Item', 'i');
		$rsm->addFieldResult('i', 'id', 'id');
		$rsm->addFieldResult('i', 'title', 'title');

		$queryString = "SELECT id,title
						FROM item where media_type = 'Collection' AND enabled = 'true' AND site_id = :site_id AND user_id = :user_id 
						ORDER BY id DESC LIMIT :limit OFFSET :offset";
						
		$queryString = str_replace("\r\n","",$queryString);

		$query = $this->getEntityManager()->createNativeQuery($queryString, $rsm);

		$query->setParameter('limit', 100);
		$query->setParameter('offset', 0);
		$query->setParameter('site_id', $siteId);
		$query->setParameter('user_id', $userId);

		return $query->getArrayResult();
	}
	
	
	public function findItems($query,$returnTotalItems = false)
	{
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qbCount = $this->getEntityManager()->createQueryBuilder();
        
	    $qb->select('i')->from('ZeegaDataBundle:Item', 'i')->where('i.enabled = true')->orderBy('i.id','DESC')->setMaxResults($query["limit"])->setFirstResult($query["page"]);
        
        if(isset($query["user"]))
        {
            $qb->andwhere('i.user_id = :user_id')->setParameter('user_id',$query["user"]);
            $qbCount->andwhere('i.user_id = :user_id')->setParameter('user_id',$query["user"]);
        }
        
        if(isset($query["site"]))
		{
			$qb->andwhere('i.site_id = :site_id')->setParameter('site_id',$query["site"]);
			$qbCount->andwhere('i.site_id = :site_id')->setParameter('site_id',$query["site"]);
		}
		
        if(isset($query["content"]))
        {
            // there's a limitation on PostgreSQL 9.1 - the Collection parameter needs to remain hardcoded
            // the percentage of collection is likely to be small and the Postgres query scheduler does not handle this well - should be fixed on PostgreSQL 9.2
     		// see http://stackoverflow.com/questions/10825444/postgres-query-is-very-slow-when-using-a-parameter-instead-of-an-hardcoded-strin/10828675#10828675

            if(strtoupper($query["content"]) == 'COLLECTION')
            {
                $qb->andwhere("i.media_type = 'Collection'");
                $qbCount->andwhere("i.media_type = 'Collection'");
            }
            else
            {
                $qb->andwhere("i.media_type = :content")->setParameter('content',$query["content"]);
                $qbCount->andwhere("i.media_type = :content")->setParameter('content',$query["content"]);
            }
        }
        
        if(isset($query["exclude_content"]))
        {
            // there's a limitation on PostgreSQL 9.1 - the Collection parameter needs to remain hardcoded
            // the percentage of collection is likely to be small and the Postgres query scheduler does not handle this well - should be fixed on PostgreSQL 9.2
     		// see http://stackoverflow.com/questions/10825444/postgres-query-is-very-slow-when-using-a-parameter-instead-of-an-hardcoded-strin/10828675#10828675

            if(strtoupper($query["exclude_content"]) == 'COLLECTION')
            {
                $qb->andwhere("i.media_type <> 'Collection'");
                $qbCount->andwhere("i.media_type <> 'Collection'");
            }
            else
            {
                $qb->andwhere("i.media_type <> :exclude_content")->setParameter('exclude_content',$query["exclude_content"]);
                $qbCount->andwhere("i.media_type <> :exclude_content")->setParameter('exclude_content',$query["exclude_content"]);
            }
        }
        
		if(isset($siteId))
		{
			$qb->andwhere('i.site_id = :site_id')->setParameter('site_id',$siteId);
			$qbCount->andwhere('i.site_id = :site_id')->setParameter('site_id',$siteId);
		}
        //return $qb->getQuery();
	    $results = array();
	    $results["items"] = $qb->getQuery()->getResult();
		
		if(isset($returnTotalItems))
		{
		    if(count($results["items"]) == $query["limit"])
		    {
		        $qbCount->select('COUNT(i.id)')->from('ZeegaDataBundle:Item', 'i');
    		    $results["total_items"] = intval($qbCount->getQuery()->getSingleScalarResult());
		    }
		    else
		    {
		        $results["total_items"] = count($results["items"]);
		    }
		}		  	
        return $results;
	}
	
	
    public function findCollections($userId,$siteId,$limit,$offset)
 	{
 		// there's a limitation on PostgreSQL 9.1 - the Collection parameter needs to remain hardcoded
 		// see http://stackoverflow.com/questions/10825444/postgres-query-is-very-slow-when-using-a-parameter-instead-of-an-hardcoded-strin/10828675#10828675
        $qb = $this->getEntityManager()->createQueryBuilder();

            // search query
    	$qb->select('i.id, i.title')
    	   ->from('ZeegaDataBundle:Item', 'i')
		   ->where('i.user_id = :user_id')
		   ->andwhere('i.media_type = :media_type')
		   ->andwhere('i.enabled = true')
		   ->andwhere('i.site_id = :site_id')
		   ->setParameter('user_id',$userId)
		   ->setParameter('media_type','Collection')
		   ->setParameter('site_id',$siteId);

            // execute the query
        return $qb->getQuery()->getArrayResult();
    }
}

