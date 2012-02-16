<?php

// src/Zeega/EditorBundle/Repository/EditorRepository.php
namespace Zeega\DataBundle\Repository;

use Doctrine\ORM\EntityRepository;

use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\User;


class EditorRepository extends EntityRepository
{


	 public function findSequencesByProject($id){
   	 	return $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 'r')
			   ->add('from', ' ZeegaDataBundle:Sequence r')
			   ->join('r.project','p')
			   ->add('where', 'p.id = :id')
			   ->setParameter('id',$id)
			   ->getQuery()->execute();
   	 
   	 }
   	 
   	 public function findSitesByUser($id){
   	 	return $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 's')
			   ->add('from', ' ZeegaDataBundle:Site s')
			   ->join('s.users','u')
			   ->andwhere('u.id = :id')
			   ->setParameter('id',$id)
			   ->getQuery()->getArrayResult();
   	 
   	 }
     public function findSiteByShort($short,$id)
     {
     	$query= $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 's')
			   ->add('from', ' ZeegaDataBundle:Site s')
			   ->join('s.users','u')
			   ->add('where', 's.short = :short')
			   ->andwhere('u.id = :id')
			   ->setParameters(array('short'=>$short,'id'=>$id))
			   ->getQuery();


			try {
				return $query->getSingleResult();
			} catch (\Doctrine\ORM\NoResultException $e) {
				return false;
			}  
     }
     
     
          public function findSiteByUser($id)
     {
     	return $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 'p')
			   ->add('from', ' ZeegaDataBundle:Site p')
			   ->join('p.users','u')
			   ->andwhere('u.id = :id')
			   ->setParameter('id',$id)
			   ->getQuery()
			   ->getResult();

		  
     }
     
    public function findProjectsBySite($id)
     {
     	$query= $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 'p')
			   ->add('from', ' ZeegaDataBundle:Project p')
			   ->innerJoin('p.site', 'g')
			   ->add('where', 'g.id = :id')
			   ->setParameter('id',$id)
			   ->orderBy('p.id','DESC')
			   ->getQuery();


			return $query->getArrayResult();

     }
     
       public function findProjectsBySiteAndUser($siteId,$userId)
     {
     	$query= $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 'p')
			   	->add('from', 'ZeegaDataBundle:Project p')
			   ->innerJoin('p.site', 's')
			   ->join('p.users', 'u')
			   ->add('where', 'u.id = :userId')
			   ->andWhere('s.id = :siteId')
			   ->setParameters(array('siteId'=>$siteId,'userId'=>$userId))
				 ->orderBy('p.id','DESC')
				 ->getQuery();


			return $query->getArrayResult();

     }

      public function findSequenceById($id)
    {
     
        
        	return $this->getEntityManager()
            ->createQuery('SELECT r FROM ZeegaDataBundle:Sequence r
            				WHERE r.id = :id')
     		->setParameter('id',$id)
     		->getArrayResult();
     }
     
    public function findLayerById($id)
    {
     
        
        	return $this->getEntityManager()
            ->createQuery('SELECT l FROM ZeegaDataBundle:Layer l
            				WHERE l.id = :id')
     		->setParameter('id',$id)
     		->getArrayResult();
     }
     
     

     
     
     
      public function findFramesBySequenceId($id)
    {
     
        
        	return $this->getEntityManager()
            ->createQueryBuilder()
            ->add('select', 'n')
            ->add('from', 'ZeegaDataBundle:Frame n')
            ->add('where', 'n.sequence = :id')
     		->setParameter('id',$id)
     		->orderBy('n.sequence_index','ASC')
     		->getQuery()
     		->getArrayResult();
     }
     
     
    public function findLayersByProject($projectId)
    {
		/*
		SELECT sequences_layers.sequence_id, Layer.*
		from Layer inner join sequences_layers on Layer.id = sequences_layers.layer_id
		where sequences_layers.sequence_id in ()
		*/
		
		return $this->getEntityManager()
        			->createQueryBuilder()
        			->add('select', 'u.id,l')
        			->add('from', 'ZeegaDataBundle:Layer l')
					->innerJoin('l.sequences', 'u')
 					->getQuery()
 					->getArrayResult();
	}
     
     
     
  
}
