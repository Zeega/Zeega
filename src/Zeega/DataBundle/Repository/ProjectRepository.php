<?php

namespace Zeega\DataBundle\Repository;

use Doctrine\ORM\EntityRepository;

class ProjectRepository extends EntityRepository
{
    public function findProjectsByUser($userId,$limit = null,$published = null)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->add('select', 'p,u')
			->add('from', 'ZeegaDataBundle:Project p')
            ->join('p.users', 'u')
            ->add('where', 'u.id = :userId')
            ->setParameter('userId',$userId)
            ->andwhere('p.enabled = true')
            ->orderBy('p.id','DESC');
 				       
 		if(null !== $published) {
 	        $qb->andwhere('p.published = :published')->setParameter('published', $published);
 		}

        if(null !== $limit) {
            $qb->setMaxResults($limit);
        }

 		return $qb->getQuery()->getResult();
    }

    public function findProjectsByUserSmall($userId)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('p.id, p.title')
            ->add('from', 'ZeegaDataBundle:Project p')
            ->join('p.users', 'u')
            ->add('where', 'u.id = :userId')
            ->setParameter('userId',$userId)
            ->andwhere('p.enabled = true')
            ->orderBy('p.id','DESC');
                       
        return $qb->getQuery()->getArrayResult();
    }


    public function findProjectsCountByDates( $dateBegin, $dateEnd )
    {

        
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('Count(p)')
            ->add('from', 'ZeegaDataBundle:Project p')
            ->add('where', 'p.published = 1')
            ->andwhere('p.dateCreated < :dateEnd')
            ->andwhere('p.dateCreated > :dateBegin')
            ->setParameters(array('dateEnd' => $dateEnd, 'dateBegin' => $dateBegin ));
                      
        return $qb->getQuery()->getResult();
    }


    public function findActiveUsersCountByDates( $dateBegin, $dateEnd, $new = null, $numZeegas = null, $datePrevious = null )
    {

        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('Count( Distinct u.id )')
            ->add('from', 'ZeegaDataBundle:Project p')
            ->join('p.users', 'u')
            ->add('where', 'p.published = 1')
            ->andwhere('p.dateCreated < :dateEnd')
            ->andwhere('p.dateCreated > :dateBegin')
            ->setParameters(array('dateEnd' => $dateEnd, 'dateBegin' => $dateBegin ));
          
        if(null !== $new){
            $qb->andwhere('u.createdAt < :dateEnd')
               ->andwhere('u.createdAt > :dateBegin');

        }
        if(null !== $numZeegas){
            $qb->andWhere('(Select count(i) of ZeegaDataBundle:Item i where i.dateCreated > :dateBegin AND i.dateCreated < :dateEnd And i.enabled=true And i.user = u.id And i.mediaType = :project ) > :numZeegas')
                ->setParameter("numZeegas", $numZeegas)
                ->setParameter("project", "project");
        }

        if(null !== $datePrevious ){
            $qb->andWhere('(Select count(j) of ZeegaDataBundle:Item j where j.dateCreated > :datePrevious AND j.dateCreated < :dateBegin And j.enabled=true And j.user = u.id And j.mediaType = :project ) > :numZeegas')
                ->setParameter("datePrevious", $datePrevious );
        }

        return $qb->getQuery()->getResult();
    }

    public function findNewUsersCountByDates( $dateBegin, $dateEnd )
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('Count( u )')
            ->add('from', 'ZeegaDataBundle:User u')
            ->where('u.createdAt < :dateEnd')
            ->andwhere('u.createdAt > :dateBegin')
            ->setParameters(array('dateEnd' => $dateEnd, 'dateBegin' => $dateBegin ));

        return $qb->getQuery()->getResult();
    }




}
