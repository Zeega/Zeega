<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\CoreBundle\Service;

class IdService
{
    public function __construct($redis) 
    {
        $this->redis = $redis;
    }

    public function generateId() 
    {
        $projectId = $this->redis->incr("project-sequence");

        if ( is_integer($projectId) ) {
            return $projectId;
        } else {
            return new \MongoId();
        }
    }
}

