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

class ApcCacheService
{
    public function isEnabled() {
        return extension_loaded('apc') && ini_get('apc.enabled');
    }

    public function exists( $key ) {
        return apc_exists ( $key );
    }

    public function fetch( $key ) {
        return apc_fetch ( $key );
    }

    public function save( $key, $data, $ttl = 3600 )  {
        return apc_add( $key, $data, $ttl );
    }
}
