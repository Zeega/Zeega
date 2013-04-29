<?php

// src/Zeega/\CoreBundle\/Repository/ItemRepository.php
/*namespace Zeega\DataBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;
use Doctrine\Common\Collections;
use DateInterval;
use Doctrine\ORM\Query\ResultSetMapping;
use DateTime;
*/
namespace Zeega\DataBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;
use Zeega\DataBundle\Document\Item;

class ItemRepository extends DocumentRepository
{
    private function buildSearchQuery($qb, $query)
    {
        if(isset($query['user'])) {
            $qb->field('user')->equals($query['user']);
        }
                
        if(isset($query['type'])) {
            $mediaTypes = explode(" AND ", $query['type']);
            foreach($mediaTypes as $mediaType) {
                if("project" !== $mediaType) {
                    $mediaType = ucfirst($mediaType);
                }

                if(preg_match("/-/",$query['type'])) {
                    $mediaType = str_replace("-","",$mediaType);
                    $qb->field('mediaType')->notEqual($mediaType);
                } else {
                    $qb->field('mediaType')->equals($mediaType);
                }
            }
        }
        
        if (isset($query['archive'])) {
             $qb->field('archive')->equals($query['archive']);
        }
        
        return $qb;
    }

    public function searchItems($query)
    {  
        if ( isset($query["text"]) ) {
            $connection = $this->getDocumentManager()->getConnection();
            $database = $this->getDocumentManager()->getConfiguration()->getDefaultDB();
            $results = $connection->selectDatabase($database)->prime(true)->command(array("text" => "Item", "search" => $query["text"]));            
            $items = array();

            if ( isset($results) && isset($results["results"]) ) {
                foreach($results["results"] as $result) {            
                    $item = new Item();
                    $this->getDocumentManager()->getHydratorFactory()->hydrate($item, $result["obj"]);
                    array_push($items,$item);    
                }    
            }            
            
            return $items;
        } else {        
            $qb = $this->createQueryBuilder('Item')
                    ->field('user')->prime(true)
                    ->eagerCursor(true)
                    ->limit($query['limit'])
                    ->skip($query['limit'] * $query['page']);

            if(isset($query['sort'])) {
                $sort = $query['sort'];
                if($sort == 'date-desc') {
                    $qb->sort('dateCreated','DESC');
                } else if($sort == 'date-asc') {
                    $qb->sort('dateCreated','ASC');
                } else {
                    $qb->sort('id','DESC');
                }
            } else {
                $qb->sort('id','DESC');
            }

            $qb = $this->buildSearchQuery($qb, $query);
            
            return $qb->getQuery()->execute();
        }
    }
    
    /*
    public function getTotalItems($query)
    {
        
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('COUNT(i)')
           ->from('ZeegaDataBundle:Item', 'i');
           
        $qb = $this->buildSearchQuery($qb, $query);
        $qb->andWhere('i.mediaType <> :count_filter')->setParameter('count_filter', 'Collection');
        
        return intval($qb->getQuery()->getSingleScalarResult());
        
        //return 0;
    }
    
    //  api/search
    
    //  api/search
    public function findOneByIdWithUser($id)
    {   
        $em = $this->getEntityManager();
        $qb = $em->createQueryBuilder();
    
        // search query
        $qb->select('i,u.displayName,u.username,u.id as userId, u.thumbUrl')
            ->from('ZeegaDataBundle:Item', 'i')
            ->innerjoin('i.user', 'u')
            ->orderBy('i.id','DESC')
            ->where('i.id = :id')
            ->setParameter('id', $id);
        
        $res = $qb->getQuery()->getArrayResult();
        if(isset($res) && is_array($res) && count($res) == 1 && count($res[0]) == 5 ) {
            $result = $res[0][0];
            $result["displayName"] = $res[0]["displayName"];
            $result["username"] = $res[0]["username"];
            $result["userId"] = $res[0]["userId"];
            $result["userThumbnail"] = $res[0]["thumbUrl"];
            return $result;
        }
        return null;
    }
    
    //  api/search
    public function searchCollectionItems($query)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        
        // search query
        $qb->select('i')
           ->from('ZeegaDataBundle:Item', 'i')
           ->orderBy('i.id','ASC')
           ->setMaxResults($query['limit'])
           ->setFirstResult($query['limit'] * $query['page']);

        $qb = $this->buildSearchQuery($qb, $query);

        // execute the query
        return $qb->getQuery()->getArrayResult();
    }
    
    public function findUriByUserArchive($userId, $archive, $maxResults = null)
    {
        $em = $this->getEntityManager();
        $qb = $em->createQueryBuilder();
    
        // search query
        $qb->select('i.uri')
            ->from('ZeegaDataBundle:Item', 'i')
            ->where('i.user = :userId')
            ->andWhere('i.archive = :archive')
            ->setParameter('userId', $userId)
            ->setParameter('archive', $archive)
            ->orderBy('i.id','DESC');

        if(null !== $maxResults && is_int($maxResults)) {
            $qb->setMaxResults($maxResults);
        }
        
        $doctrineResults = $qb->getQuery()->getResult();
        
        if(null !== $doctrineResults) {
            // getting rid of the nested array hydrated by Doctrine; currently there's no way to avoid this without writing a new hydrator
            $return = array();
            array_walk_recursive($doctrineResults, function($a) use (&$return) { $return[] = $a; });
            return array_flip($return);
        } else {
            return null;
        }
    }

    public function findInId($ids) {
        $em = $this->getEntityManager();
        
    
        // search query
        $qb = $em->createQueryBuilder()
            ->select('i')
            ->from('ZeegaDataBundle:Item', 'i')
            ->where('i.id in (:ids)')
            ->setParameter('ids',$ids);
        
        return $qb->getQuery()->getResult(); 
    }
    */
}
