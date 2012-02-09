<?php

// src/Zeega/IngestBundle/Repository/ItemRepository.php
namespace Zeega\DataBundle\Repository;

use Doctrine\ORM\EntityRepository;
use DateInterval;

use DateTime;

class ItemRepository extends EntityRepository
{
    private function buildSearchQuery($qb, $query)
    {
        if(isset($query['queryString']))
        {
            $qb->where('i.title LIKE :query_string')
               ->orWhere('i.media_creator_username LIKE :query_string')
               ->orWhere('i.description LIKE :query_string')
               ->setParameter('query_string','%' . $query['queryString'] . '%');
        }
        
        if(isset($query['userId']))
      	{
			$qb->andWhere('i.user_id = ?2')
			   ->setParameter(2,$query['userId']);
		}
		
		if(isset($query['playgroundId']))
      	{
			$qb->andWhere('i.playground_id = :playground')
			   ->setParameter('playground',$query['playgroundId']);
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

      	  	$qb->andWhere('i.type <> :not_content_type')->setParameter('not_content_type', $query['notContentType']);
		}
		
        if(isset($query['contentType']))
      	{
      	    $content_type = strtoupper($query['contentType']);

      	  	$qb->andWhere('i.type = ?4')->setParameter(4, $query['contentType']);
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
			 $qb->groupBy('i.id');      	
			 $qb->innerjoin('i.tags', 'it')
			    ->innerjoin('it.tag','t')
                ->andWhere('t.name IN (:tags_name)')
                ->having('COUNT(DISTINCT t.id) = :tags_name_count')
                ->setParameter('tags_name', $query['tagsName'])
                ->setParameter('tags_name_count', count($query['tagsName']));
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
		$qb->select('COUNT(distinct i)')
	       ->from('ZeegaDataBundle:Item', 'i');
		   
	    $qb = $this->buildSearchQuery($qb, $query);
		
		return array_sum($qb->getQuery()->getArrayResult());
		
		//return 0;
	}
	
	public function getTotalItems($query)
	{
		
		$qb = $this->getEntityManager()->createQueryBuilder();
		$qb->select('COUNT(distinct i)')
	       ->from('ZeegaDataBundle:Item', 'i');
		   
	    $qb = $this->buildSearchQuery($qb, $query);
		$qb->andWhere('i.type <> :count_filter')->setParameter('count_filter', 'Collection');
		
		return array_sum($qb->getQuery()->getArrayResult());
		
		//return 0;
	}
	
	public function getTotalCollections($query)
	{
		$qb = $this->getEntityManager()->createQueryBuilder();
		$qb->select('COUNT(i)')
	       ->from('ZeegaDataBundle:Item', 'i');

	    $qb = $this->buildSearchQuery($qb, $query);
		$qb->andWhere('i.type = :count_filter')->setParameter('count_filter', 'Collection');
		return array_sum($qb->getQuery()->getArrayResult());
	}

    //  api/search
    public function searchItems($query)
    {    
        $qb = $this->getEntityManager()->createQueryBuilder();
    
        // search query
        $qb->select('distinct i')
            ->from('ZeegaDataBundle:Item', 'i')
            ->orderBy('i.id','DESC')
       		->setMaxResults($query['limit'])
       		->setFirstResult($query['limit'] * $query['page']);
        
        $qb = $this->buildSearchQuery($qb, $query);

        // execute the query
        return $qb->getQuery()->getArrayResult();
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
			        ->andwhere("i.type = 'Collection'")
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
    
    
    
    public function findIt($offset,$limit)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('i')
            ->from('ZeegaDataBundle:Item', 'i')
            ->orderBy('i.id','DESC')
       		->setMaxResults($limit)
       		->setFirstResult($query['limit'] * $query['page']);
        return $qb->getQuery()->getArrayResult();         		   
    }
    
    public function findItems($query, $offset,$limit)
    {
        // $qb instanceof QueryBuilder
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('i')
            ->from('ZeegaDataBundle:Item', 'i')
            ->where('i.title LIKE ?1')
            ->orWhere('i.media_creator_username LIKE ?1')
            ->orWhere('i.description LIKE ?1')
            ->orderBy('i.id','DESC')
       		->setMaxResults($limit)
       		->setFirstResult($query['limit'] * $query['offset']);
        
        // filter by type or by userId
        if($query['contentType'] == 'mine')
      	{
			$qb->innerJoin('i.user', 'u')
			   ->andWhere('u.id = ?3')
			   ->setParameter(3,$query['userId']);
		}
        elseif($query['contentType'] != 'all')
        {
            $qb->andWhere('i.type = ?2')
                ->setParameter(2, $query['contentType']);       
        }         
       	
       	if(is_array($query['userPlaygrounds']) && sizeof($query['userPlaygrounds']) > 0)
       	{
       	    $qb->andWhere('i.playground = ?4')
                ->setParameter(4, $query['userPlaygrounds'][0]['id']);       
       	}
       	
       	// get query and add parameter - for some reason set parameter in this
       	// situation only works like this (query->setParameter vs querybuilder->setParameter) 	   
        $q = $qb->getQuery();         		   
        $q->setParameter(1, '%' . $query['queryString'] . '%');
        
        return $q->getArrayResult();
    }
    /*
      public function findItemByAttributionUrl($url)
    {
        $query = $this->getEntityManager()
				->createQuery(
					'SELECT i.id,i.type,i.title FROM ZeegaDataBundle:Item i
					WHERE i.attribution_uri = :url'
				)->setParameter('url',$url);

			try {
				return $query->getSingleResult();
			} catch (\Doctrine\ORM\NoResultException $e) {
				return null;
			}  
    }
     */
     
          
     public function findItemById($id)
     {
     	return $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 'i')
			   ->add('from', ' ZeegaDataBundle:Item i')
			   ->andwhere('i.id = :id')
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
			   ->setParameter('id',$id)
			    ->orderBy('i.id','DESC')
			   ->getQuery()
			   ->setMaxResults(15)
			   ->getArrayResult();
     }
     
     public function findUserItemsByPlayground($id,$pid)
     {
     	return $this->getEntityManager()
			   ->createQueryBuilder()
			   ->add('select', 'i.id,i.title,i.thumbnail_url')
			   ->add('from', ' ZeegaDataBundle:Item i')
			   ->innerJoin('i.user', 'u')
			   ->andwhere('u.id = :id')
			   ->andwhere('i.playground_id = :pid')
			   ->setParameters(array('id'=>$id,'pid'=>$pid))
			    ->orderBy('i.id','DESC')
			   ->getQuery()
			   ->setMaxResults(15)
			   ->getArrayResult();
     }
     
     
     public function findItemsGeoTime($request)
   		{
   			$qbs=array();
   			$qb=$this->getEntityManager()
				->createQueryBuilder();
				
			
			$query=$qb
					->select('Count(i)')
			   		->from('ZeegaDataBundle:Item', 'i');
			   
			if($request['contentType']=='all'){
				$query->add('where', 'i.content_type != :tag')
			   		->setParameter('tag','Tag');
			}
			else{
				$query->add('where', 'i.content_type = :contentType')
			   		->setParameter('contentType',$request['contentType']);
			}
			
			if(!IS_NULL($request['tags'])){
				$i=0;
				foreach($request['tags'] as $tag){
					$i++;
				
					$qbs[$i]=$this->getEntityManager()
								->createQueryBuilder()
								->select('j'.$i.'.id')
								->from('ZeegaDataBundle:Item', 'j'.$i)
								->innerJoin('j'.$i.'.parent_collections', 'c'.$i)
								->add('where', 'j'.$i.'.id = i.id')
								->andWhere('c'.$i.'.title = ?'.$i);
			   					
				
					$query->andWhere($qb->expr()->exists($qbs[$i]->getDql()))
						->setParameter($i,$tag);

				}
			}
			
			if(!IS_NULL($request['time'])){
				if(!IS_NULL($request['geo'])){
					$query->andWhere($qb->expr()->between('i.geo_lat', $request['geo']['south'],$request['geo']['north']))
								->andWhere($qb->expr()->between('i.geo_lng', $request['geo']['west'],$request['geo']['east']))
								->andWhere('i.date_created_start >= :earliest')
								->andWhere('i.date_created_start < :latest')
								->setParameters(array('earliest'=>$request['time']['earliest'],'latest'=>$request['time']['latest']));
				}
				else{
						$query->andWhere('i.date_created_start >= :earliest')
								->andWhere('i.date_created_start < :latest')
								->setParameters(array('earliest'=>$request['time']['earliest'],'latest'=>$request['time']['latest']));
				}
			}
			elseif(!IS_NULL($request['geo'])){
						
				$query->andWhere($qb->expr()->between('i.geo_lat', $request['geo']['south'],$request['geo']['north']))
							->andWhere($qb->expr()->between('i.geo_lng', $request['geo']['west'],$request['geo']['east']));
			
			
			}
			if(!IS_NULL($request['limit']))$query->setMaxResults($request['limit']);
			if(!IS_NULL($request['offset']))$query->setFirstResult($request['offset']);
		   return $query
			->getQuery()
			->getSingleScalarResult();
			  
     }
     public function findItemsGeoTimeDetails($request)
   		{
   			$qbs=array();
   			$qb=$this->getEntityManager()
				->createQueryBuilder();
				
			
			$query=$qb
					->select('i')
			   		->from('ZeegaDataBundle:Item', 'i');
			   
			if($request['contentType']=='all'){
				$query->add('where', 'i.content_type != :tag')
			   		->setParameter('tag','Tag');
			}
			elseif($request['contentType']=='mine'){
			
				$query->innerJoin('i.user', 'u')
			   		->add('where', 'u.id =:userId')
			   		->setParameter('userId',$request['userId']);
			}
			else{
				$query->add('where', 'i.content_type = :contentType')
			   		->setParameter('contentType',$request['contentType']);
			}
			
			if(!IS_NULL($request['tags'])){
				$i=0;
				foreach($request['tags'] as $tag){
					$i++;
				
					$qbs[$i]=$this->getEntityManager()
								->createQueryBuilder()
								->select('j'.$i.'.id')
								->from('ZeegaDataBundle:Item', 'j'.$i)
								->innerJoin('j'.$i.'.parent_collections', 'c'.$i)
								->add('where', 'j'.$i.'.id = i.id')
								->andWhere('c'.$i.'.title = ?'.$i);
			   					
				
					$query->andWhere($qb->expr()->exists($qbs[$i]->getDql()))
						->setParameter($i,$tag);

				}
			}
			if(!IS_NULL($request['time'])){
				if(!IS_NULL($request['geo'])){
					$query->andWhere($qb->expr()->between('i.geo_lat', $request['geo']['south'],$request['geo']['north']))
								->andWhere($qb->expr()->between('i.geo_lng', $request['geo']['west'],$request['geo']['east']))
								->andWhere('i.date_created_start >= :earliest')
								->andWhere('i.date_created_start < :latest')
								->setParameters(array('earliest'=>$request['time']['earliest'],'latest'=>$request['time']['latest']));
				}
				else{
						$query->andWhere('i.date_created_start >= :earliest')
								->andWhere('i.date_created_start < :latest')
								->setParameters(array('earliest'=>$request['time']['earliest'],'latest'=>$request['time']['latest']));
				}
			}
			elseif(!IS_NULL($request['geo'])){
						
				$query->andWhere($qb->expr()->between('i.geo_lat', $request['geo']['south'],$request['geo']['north']))
							->andWhere($qb->expr()->between('i.geo_lng', $request['geo']['west'],$request['geo']['east']));
			
			
			}
			if(!IS_NULL($request['limit']))$query->setMaxResults($request['limit']);
			if(!IS_NULL($request['offset']))$query->setFirstResult($request['offset']);
			
			   return $query
			   	->orderBy('i.id','DESC')
				->getQuery()
				->getArrayResult();
			  
     }
     public function findItemsGeoTimeDetailsObject($request)
   		{
   			$qbs=array();
   			$qb=$this->getEntityManager()
				->createQueryBuilder();
				
			
			$query=$qb
					->select('i')
			   		->from('ZeegaDataBundle:Item', 'i');
			   
			if($request['contentType']=='all'){
				$query->add('where', 'i.content_type != :tag')
			   		->setParameter('tag','Tag');
			}
			else{
				$query->add('where', 'i.content_type = :contentType')
			   		->setParameter('contentType',$request['contentType']);
			}
			
			if(!IS_NULL($request['tags'])){
				$i=0;
				foreach($request['tags'] as $tag){
					$i++;
				
					$qbs[$i]=$this->getEntityManager()
								->createQueryBuilder()
								->select('j'.$i.'.id')
								->from('ZeegaDataBundle:Item', 'j'.$i)
								->innerJoin('j'.$i.'.parent_collections', 'c'.$i)
								->add('where', 'j'.$i.'.id = i.id')
								->andWhere('c'.$i.'.title = ?'.$i);
			   					
				
					$query->andWhere($qb->expr()->exists($qbs[$i]->getDql()))
						->setParameter($i,$tag);

				}
			}
			if(!IS_NULL($request['time'])){
				if(!IS_NULL($request['geo'])){
					$query->andWhere($qb->expr()->between('i.geo_lat', $request['geo']['south'],$request['geo']['north']))
								->andWhere($qb->expr()->between('i.geo_lng', $request['geo']['west'],$request['geo']['east']))
								->andWhere('i.date_created_start >= :earliest')
								->andWhere('i.date_created_start < :latest')
								->setParameters(array('earliest'=>$request['time']['earliest'],'latest'=>$request['time']['latest']));
				}
				else{
						$query->andWhere('i.date_created_start >= :earliest')
								->andWhere('i.date_created_start < :latest')
								->setParameters(array('earliest'=>$request['time']['earliest'],'latest'=>$request['time']['latest']));
				}
			}
			elseif(!IS_NULL($request['geo'])){
						
				$query->andWhere($qb->expr()->between('i.geo_lat', $request['geo']['south'],$request['geo']['north']))
							->andWhere($qb->expr()->between('i.geo_lng', $request['geo']['west'],$request['geo']['east']));
			
			
			}
			
			if(!IS_NULL($request['limit']))$query->setMaxResults($request['limit']);
			if(!IS_NULL($request['offset']))$query->setFirstResult($request['offset']);
				
			
			return $query
				->getQuery()
				->getResult();
			  
     }
     public function findTagsGeoTime($request)
   		{
   			$qb=$this->getEntityManager()
				->createQueryBuilder();
				
			if(!IS_NULL($request['time'])){
				if(!IS_NULL($request['geo'])){
					$query=$qb
						->select('DISTINCT c.id,c.title')
						->from('ZeegaDataBundle:Item', 'i')
						->innerJoin('i.parent_collections', 'c')
						->andWhere($qb->expr()->between('i.geo_lat', $request['geo']['south'],$request['geo']['north']))
						->andWhere($qb->expr()->between('i.geo_lng', $request['geo']['west'],$request['geo']['east']))
						->andWhere('i.date_created_start >= :earliest')
						->andWhere('i.date_created_start< :latest')
						->setParameters(array('earliest'=>$request['time']['earliest'],'latest'=>$request['time']['latest']));
				}
				else{
					$query=$qb
						->select('DISTINCT c.id,c.title')
						->from('ZeegaDataBundle:Item', 'i')
						->innerJoin('i.parent_collections', 'c')
						->andWhere('i.date_created_start >= :earliest')
						->andWhere('i.date_created_start< :latest')
						->setParameters(array('earliest'=>$request['time']['earliest'],'latest'=>$request['time']['latest']));
				}
			}
			elseif(!IS_NULL($request['geo'])){
						
				$query=$qb
						->select('DISTINCT c.id,c.title')
						->from('ZeegaDataBundle:Item', 'i')
						->innerJoin('i.parent_collections', 'c')
						->andWhere($qb->expr()->between('i.geo_lat', $request['geo']['south'],$request['geo']['north']))
						->andWhere($qb->expr()->between('i.geo_lng', $request['geo']['west'],$request['geo']['east']));
			}
			else{
				$query=$qb
						->select('DISTINCT c.id,c.title')
						->from('ZeegaDataBundle:Item', 'i')
						->innerJoin('i.parent_collections', 'c');
			}
			if(!IS_NULL($request['limit']))$query->setMaxResults($request['limit']);
			if(!IS_NULL($request['offset']))$query->setFirstResult($request['offset']);
			
			return $query
				->getQuery()
				->getArrayResult();
			  
     }
     
     
     
     //LEGACY
     
       public function findItemsWithLimit($offset,$limit)
    {
			return $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 'i')
			   ->add('from', 'ZeegaDataBundle:Item i')
			   ->add('where', 'i.content_type != :tag')
			   ->setParameter('tag','Tag')
			   ->orderBy('i.id','DESC')
				->setMaxResults($limit)
				->setFirstResult($offset)
				->getQuery()
				->getArrayResult();

     }
}

