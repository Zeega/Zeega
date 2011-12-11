<?php

// src/Zeega/IngestBundle/Repository/ItemRepository.php
namespace Zeega\IngestBundle\Repository;

use Doctrine\ORM\EntityRepository;

class ItemRepository extends EntityRepository
{
    //  api/search
    public function searchItems($query)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        
        // search query
        $qb->select('i')
            ->from('ZeegaIngestBundle:Item', 'i')
            ->orderBy('i.id','DESC')
       		->setMaxResults($query['limit'])
       		->setFirstResult($query['page']);

        if(isset($query['queryString']))
        {
            $qb->where('i.title LIKE ?1')
               ->orWhere('i.media_creator_username LIKE ?1')
               ->orWhere('i.description LIKE ?1')
               ->setParameter(1,'%' . $query['queryString'] . '%');
        }
        
        if(isset($query['userId']))
      	{
			$qb->andWhere('i.user_id = ?2')
			   ->setParameter(2,$query['userId']);
		} 
		
		if(isset($query['collectionId']))
      	{
			 $qb->innerjoin('i.parent_items', 'c')
                ->andWhere('c.id = ?3')
                ->setParameter(3, $query['collectionId']);
		}
        
        if(isset($query['contentType']))
      	{
      	    $content_type = strtoupper($query['contentType']);

      	    if( $content_type == "AUDIO" ||
      	        $content_type == "VIDEO" ||
      	        $content_type == "IMAGE" ||
      	        $content_type == "COLLECTION" )
      	    {
      	        $qb->andWhere('i.type = ?4')
                   ->setParameter(4, $query['contentType']);
      	    }
		}
        
        // execute the query
        return $qb->getQuery()->getArrayResult();
    }
    
    //  api/search
    public function searchCollectionItems($query)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        
        // search query
        $qb->select('i')
            ->from('ZeegaIngestBundle:Item', 'i')
            ->innerjoin('i.parent_items', 'c')
            ->andWhere('c.id = ?1')
            ->setParameter(1, $query['collection_id'])
            ->orderBy('i.id','DESC')
       		->setMaxResults($query['limit'])
            ->setFirstResult($query['page']);
        
        // execute the query
        return $qb->getQuery()->getArrayResult();
    }
    
    //  api/collections/{col_id}
    public function searchCollectionById($id)
    {
     	return $this->getEntityManager()
				    ->createQueryBuilder()
				    ->add('select', 'i')
			        ->add('from', ' ZeegaIngestBundle:Item i')
			        ->andwhere('i.id = :id')
			        ->andwhere("i.type = 'Collection'")
			        ->setParameter('id',$id)
			        ->getQuery()
			        ->getArrayResult();
    }
    
    public function findIt($offset,$limit)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('i')
            ->from('ZeegaIngestBundle:Item', 'i')
            ->orderBy('i.id','DESC')
       		->setMaxResults($limit)
       		->setFirstResult($offset);
        return $qb->getQuery()->getArrayResult();         		   
    }
    
    public function findItems($query, $offset,$limit)
    {
        // $qb instanceof QueryBuilder
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('i')
            ->from('ZeegaIngestBundle:Item', 'i')
            ->where('i.title LIKE ?1')
            ->orWhere('i.media_creator_username LIKE ?1')
            ->orWhere('i.description LIKE ?1')
            ->orderBy('i.id','DESC')
       		->setMaxResults($limit)
       		->setFirstResult($offset);
        
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
    
      public function findItemByAttributionUrl($url)
    {
        $query = $this->getEntityManager()
				->createQuery(
					'SELECT i.id,i.type,i.title FROM ZeegaIngestBundle:Item i
					WHERE i.attribution_uri = :url'
				)->setParameter('url',$url);

			try {
				return $query->getSingleResult();
			} catch (\Doctrine\ORM\NoResultException $e) {
				return null;
			}  
    }
     
     
          
     public function findItemById($id)
     {
     	return $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 'i')
			   ->add('from', ' ZeegaIngestBundle:Item i')
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
			   ->add('from', ' ZeegaIngestBundle:Item i')
			   ->innerJoin('i.user', 'u')
			   ->andwhere('u.id = :id')
			   ->setParameter('id',$id)
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
			   		->from('ZeegaIngestBundle:Item', 'i');
			   
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
								->from('ZeegaIngestBundle:Item', 'j'.$i)
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
			   		->from('ZeegaIngestBundle:Item', 'i');
			   
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
								->from('ZeegaIngestBundle:Item', 'j'.$i)
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
			   		->from('ZeegaIngestBundle:Item', 'i');
			   
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
								->from('ZeegaIngestBundle:Item', 'j'.$i)
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
						->from('ZeegaIngestBundle:Item', 'i')
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
						->from('ZeegaIngestBundle:Item', 'i')
						->innerJoin('i.parent_collections', 'c')
						->andWhere('i.date_created_start >= :earliest')
						->andWhere('i.date_created_start< :latest')
						->setParameters(array('earliest'=>$request['time']['earliest'],'latest'=>$request['time']['latest']));
				}
			}
			elseif(!IS_NULL($request['geo'])){
						
				$query=$qb
						->select('DISTINCT c.id,c.title')
						->from('ZeegaIngestBundle:Item', 'i')
						->innerJoin('i.parent_collections', 'c')
						->andWhere($qb->expr()->between('i.geo_lat', $request['geo']['south'],$request['geo']['north']))
						->andWhere($qb->expr()->between('i.geo_lng', $request['geo']['west'],$request['geo']['east']));
			}
			else{
				$query=$qb
						->select('DISTINCT c.id,c.title')
						->from('ZeegaIngestBundle:Item', 'i')
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
			   ->add('from', 'ZeegaIngestBundle:Item i')
			   ->add('where', 'i.content_type != :tag')
			   ->setParameter('tag','Tag')
			   ->orderBy('i.id','DESC')
				->setMaxResults($limit)
				->setFirstResult($offset)
				->getQuery()
				->getArrayResult();

     }
}

