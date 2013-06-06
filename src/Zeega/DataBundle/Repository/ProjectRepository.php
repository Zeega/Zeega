<?php

namespace Zeega\DataBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;
use Zeega\DataBundle\Document\Project;

class ProjectRepository extends DocumentRepository
{
    public function findOneById($id){
        if ( is_numeric($id) ) {
            $project = parent::findOneBy(array("rdbms_id_published" => (int)$id));
            // this should be an $or query, but doesn't seem to work yet on ODM
            if ( !isset($project) ) {
                $project = parent::findOneBy(array("rdbms_id" => (int)$id));                
            }
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
        if ( isset($query["text"]) ) {
            $command = array(
                "text" => "Project", 
                "search" => $query["text"],
                "project" => array("id"=>1,'user'=>1,'title'=>1,'uri'=>1, 'cover_image'=>1, 'authors'=>1, 'date_created'=>1, 'editable'=>1)
                );
            $filter = array();

            if ( isset($query["user"]) ) {
                $filter["user"] = new \MongoId($query["user"]);
            }

            $command["filter"] = $filter;

            $connection = $this->getDocumentManager()->getConnection();
            $database = $this->getDocumentManager()->getConfiguration()->getDefaultDB();
            $results = $connection->selectDatabase($database)->command($command);
            $projects = array();

            if ( isset($results) && isset($results["results"]) ) {

                foreach($results["results"] as $result) {            
                    $project = new Project();
                    $this->getDocumentManager()->getHydratorFactory()->hydrate($project, $result["obj"]);
                    array_push($projects,$project);
                }    
            }            
            
            return $projects;
        } else {        
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

            if (isset($query["user"])) {
                $qb->field('user.id')->equals($query["user"]);
            }

            return $qb->getQuery()->execute();
        }
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
}
