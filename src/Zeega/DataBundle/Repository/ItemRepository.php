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
    public function findOneById($id){
        if (is_numeric($id) ) {
            $item = parent::findOneBy(array("rdbms_id" => $id));
        } else {
            $item = parent::findOneById($id);
        }        
        return $item;
    }

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

        if (isset($query['tags'])) {
             $qb->field('tags')->equals($query['tags']);
        }
        
        return $qb;
    }

    public function findByQuery($query)
    {  
        if ( isset($query["text"]) ) {
            $command = array("text" => "Item", "search" => $query["text"]);
            $filter = array();

            if ( isset($query["user"]) ) {
                $filter["user"] = new \MongoId($query["user"]);
            }

            if ( isset($query["type"]) ) {
                $filter["media_type"] = $query["type"];
                // negation { $ne: "Audio" }}
            }

            $command["filter"] = $filter;

            $connection = $this->getDocumentManager()->getConnection();
            $database = $this->getDocumentManager()->getConfiguration()->getDefaultDB();
            $results = $connection->selectDatabase($database)->command($command);
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
}
