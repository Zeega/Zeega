<?php

namespace Zeega\DataBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class ProjectRepository extends DocumentRepository
{
    public function findOneById($id){
        if (is_numeric($id) ) {
            $project = parent::findOneBy(array("rdbms_id" => (int)$id));
        } else {
            $project = parent::findOneById($id);
        }        
        return $project;
    }

    public function findProjectsByUser($userId,$limit = null,$published = null)
    {
        $qb = $this->createQueryBuilder('Project')
            ->select('user','id','title','uri', 'cover_image', 'authors', 'date_created', 'editable')
            ->eagerCursor(true)
            ->field('user.id')->equals($userId)
            ->field('enabled')->equals(true)
            ->sort('date_created','DESC');
        
        if(null !== $published) {
            $qb->field('published')->equals($published);
        }

        if(null !== $limit) {
            $qb->limit($limit);
        }

        return $qb->getQuery()->execute();
    }

    public function findProjectsByUserSmall($userId)
    {
        $connection = $this->getDocumentManager()->getConnection();
        $database = $this->getDocumentManager()->getConfiguration()->getDefaultDB();
        $results = $connection
            ->selectDatabase($database)
            ->Project
            ->find(array('user.$id'=>new \MongoId($userId), 'enabled' => true),array("id" => 1, "title" => 1))
            ->sort(array('id', -1));
        
        return iterator_to_array($results);
    }

    public function findByQuery($query)
    {
        $qb = $this->createQueryBuilder('Project')
                    ->select('user','id','title','uri', 'cover_image', 'authors', 'date_created', 'tags')
                    ->field('user')->prime(true)
                    ->eagerCursor(true)
                    ->limit($query['limit'])
                    ->skip($query['limit'] * $query['page'])
                    ->sort('created_at','DESC');

        if (isset($query["tags"])) {
            $qb->field('tags.name')->equals($query["tags"]);
        }

        return $qb->getQuery()->execute();    
    }

    public function findProjectFrame($projectId, $frameId) {
        $project = $this->createQueryBuilder('ZeegaDataBundle:Project')
                ->field('id')->equals($projectId)
                ->eagerCursor(true)
                ->select('frames')
                ->getQuery()
                ->getSingleResult();

        if ( !isset($project) || !$project instanceof MongoProject) {
            return null;
        } 

        $frames = $project->getFrames();
        $frame = $project->getFrames()->filter(
            function($fram) use ($frameId){
                return $fram->getId() == $frameId;
            }
        )->first();
        
        if ( !isset($frame) || !$frame instanceof MongoFrame) {
            return null;  
        } else {
            return $frame;
        }
    }

    public function findProjectFrameWithLayers($projectId, $frameId) {
        $project = $this->createQueryBuilder('ZeegaDataBundle:Project')
                ->field('id')->equals($projectId)
                ->select('frames','layers')
                ->eagerCursor(true)
                ->getQuery()
                ->getSingleResult();

        if ( !isset($project) ) {
            return "null";
        } 

        
        $frame = $project->getFrames()->filter(
            function($fram) use ($frameId){
                return $fram->getId() == $frameId;
            }
        )->first();
        
        if ( !isset($frame) ) {
            return null;  
        } 

        $layersIds = $frame->getLayers();

        if ( isset($layersIds) && is_array($layersIds) ) {
            $layers = $project->getLayers()->filter(
                function($layr) use ($layersIds){
                    return in_array($layr->getId(), $layersIds);
                }
            );

            if ( isset($layers) ) {
                return array("frame"=> $frame, "layers" => $layers);
            }
        }

        return array("frame"=> $frame, "layers" => array());
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
