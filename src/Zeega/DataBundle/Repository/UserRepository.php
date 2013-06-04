<?php

namespace Zeega\DataBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class UserRepository extends DocumentRepository
{
    public function findOneById($id){
        if (is_numeric($id) ) {
            $user = parent::findOneBy(array("rdbms_id" => (int)$id));
        } else {
            $user = parent::findOneById($id);
        }        
        return $user;
    }
}
