<?php

// src/Zeega/EditorBundle/Repository/EditorRepository.php
namespace Zeega\DataBundle\Repository;

use Doctrine\ORM\EntityRepository;

use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\User;


class EditorRepository extends EntityRepository
{


	 public function findRoutesByProject($id){
   	 	return $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 'r')
			   ->add('from', ' ZeegaDataBundle:Route r')
			   ->join('r.project','p')
			   ->add('where', 'p.id = :id')
			   ->setParameter('id',$id)
			   ->getQuery()->getArrayResult();
   	 
   	 }
   	 
   	  public function findProjectById($id){
   	 	return $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 'p')
			   ->add('from', ' ZeegaDataBundle:Project p')
			   ->add('where', 'p.id = :id')
			   ->setParameter('id',$id)
			   ->getQuery()->getArrayResult();
   	 }
   	 
	 public function findPlaygroundsByUser($id){
   	 	return $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 's')
			   ->add('from', ' ZeegaDataBundle:Playground s')
			   ->join('s.users','u')
			   ->andwhere('u.id = :id')
			   ->setParameter('id',$id)
			   ->getQuery()->getArrayResult();
   	 
   	 }
     public function findPlaygroundByShort($short,$id)
     {
     	$query= $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 's')
			   ->add('from', ' ZeegaDataBundle:Playground s')
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
     
     
          public function findPlaygroundByUser($id)
     {
     	return $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 'p')
			   ->add('from', ' ZeegaDataBundle:Playground p')
			   ->join('p.users','u')
			   ->andwhere('u.id = :id')
			   ->setParameter('id',$id)
			   ->getQuery()
			   ->getResult();

		  
     }
     
     
     
      public function checkAdmin($short,$id)
     {
     	$query= $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 's')
			   ->add('from', ' ZeegaDataBundle:Playground s')
			   ->join('s.admins','u')
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
   
   
   	public function findProjectsByPlayground($id)
     {
     	$query= $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 'p')
			   ->add('from', ' ZeegaDataBundle:Project p')
			   ->innerJoin('p.playground', 'g')
			   ->add('where', 'g.id = :id')
			   ->setParameter('id',$id)
			   ->orderBy('p.id','DESC')
			   ->getQuery();


			return $query->getArrayResult();

     }
     
     
     
      	public function findUsersByPlayground($id)
     {
     	$query= $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 's,u')
			   ->add('from', ' ZeegaDataBundle:Playground s')
			   ->innerJoin('s.users', 'u')
			   ->add('where', 's.id = :id')
			   ->setParameter('id',$id)
				->getQuery();


			return $query->getArrayResult();

     }
     
 
     
     
     
   
     
      public function findProjectsByPlaygroundAndUser($playgroundId,$userId)
     {
     	$query= $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 'p')
			   	->add('from', 'ZeegaDataBundle:Project p')
			   ->innerJoin('p.playground', 's')
			   ->join('p.users', 'u')
			   ->add('where', 'u.id = :userId')
			   ->andWhere('s.id = :playgroundId')
			   ->setParameters(array('playgroundId'=>$playgroundId,'userId'=>$userId))
				 ->orderBy('p.id','DESC')
				 ->getQuery();


			return $query->getArrayResult();

     }
     
     
   
     public function findByShort($short)
     {
     	$query= $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 's')
			   ->add('from', ' ZeegaDataBundle:Playground s')
			   ->add('where', 's.short = :short')
			   ->setParameter('short',$short)
				->getQuery();

		
			try {
				return $query->getSingleResult();
			} catch (\Doctrine\ORM\NoResultException $e) {
				return null;
			}  
     }
   
   
   	public function findByPlayground($id)
     {
     	$query= $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 'p')
			   ->add('from', ' ZeegaDataBundle:Project p')
			   ->innerJoin('p.playground', 'g')
			   ->add('where', 'g.id = :id')
			   ->setParameter('id',$id)
				->getQuery();

		
			return $query->getArrayResult();
			
     }
     
 
     
     
     
   
     
      public function findByPlaygroundAndUser($playgroundId,$userId)
     {
     	$query= $this->getEntityManager()
				->createQueryBuilder()
				->add('select', 'p')
			   	->add('from', 'ZeegaDataBundle:Project p')
			   ->innerJoin('p.playground', 's')
			   ->join('p.user', 'u')
			   ->add('where', 'u.id = :userId')
			   ->andWhere('s.id = :playgroundId')
			   ->setParameters(array('playgroundId'=>$playgroundId,'userId'=>$userId))
				->getQuery();

		
			return $query->getArrayResult();
			
     }
     
      public function findRouteById($id)
    {
     
        
        	return $this->getEntityManager()
            ->createQuery('SELECT r FROM ZeegaDataBundle:Route r
            				WHERE r.id = :id')
     		->setParameter('id',$id)
     		->getArrayResult();
     }
     
     
     
       public function findRoute($id)
    {
     
        
        	return $this->getEntityManager()
            ->createQuery('SELECT r FROM ZeegaDataBundle:Route r
            				WHERE r.id = :id')
     		->setParameter('id',$id)
     		->getResult();
     }
     
      public function findNodeById($id)
    {
     
        
        	return $this->getEntityManager()
            ->createQuery('SELECT n FROM ZeegaDataBundle:Node n
            				WHERE n.id = :id')
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
     
     

     
     
     
      public function findNodesByRouteId($id)
    {
     
        
        	return $this->getEntityManager()
            ->createQueryBuilder()
            ->add('select', 'n')
            ->add('from', 'ZeegaDataBundle:Node n')
            ->add('where', 'n.route = :id')
     		->setParameter('id',$id)
     		->orderBy('n.route_index','ASC')
     		->getQuery()
     		->getArrayResult();
     }
     
     
     
      
     
     
     
  
}
