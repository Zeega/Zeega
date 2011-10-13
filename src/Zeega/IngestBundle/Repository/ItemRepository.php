<?php

// src/Zeega/IngestBundle/Repository/ItemRepository.php
namespace Zeega\IngestBundle\Repository;

use Doctrine\ORM\EntityRepository;

class ItemRepository extends EntityRepository
{
      public function findItemByAttributionUrl($url)
    {
        $query = $this->getEntityManager()
				->createQuery(
					'SELECT i.item_url,i.content_type,i.title FROM ZeegaIngestBundle:Item i
					WHERE i.attribution_url = :url'
				)->setParameter('url',$url);

			try {
				return $query->getSingleResult();
			} catch (\Doctrine\ORM\NoResultException $e) {
				return null;
			}  
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

