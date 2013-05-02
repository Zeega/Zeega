<?php

namespace Zeega\DataBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class ProjectRepository extends DocumentRepository
{
    public function findProjectsByUser($userId,$limit = null,$published = null)
    {
        $qb = $this->createQueryBuilder('Project')
            ->select('user','id','title','uri', 'coverImage', 'authors', 'dateCreated')
            ->eagerCursor(true)
            ->field('user.id')->equals($userId);
        
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
}
