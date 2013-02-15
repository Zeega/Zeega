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

use Symfony\Component\HttpFoundation\Response;

use Zeega\DataBundle\Entity\Item;
use Zeega\CoreBundle\Helpers\ItemCustomNormalizer;
use Zeega\CoreBundle\Helpers\ResponseHelper;
use Zeega\CoreBundle\Controller\BaseController;

class ThumbnailService
{
    public function __construct($doctrine, $serviceContainer)
    {
        $this->container = $serviceContainer;
        $this->doctrine = $doctrine;
    }

    public function getItemThumbnail($url, $size = 4)
    {
        try
        {     
            $host = $this->container->getParameter('static_host');

            if( !isset($host) || empty($host) ) {
                return null;
            }

            $thumbnailServerUrl =  "$host/image?url=$url";
            $thumbnailJSON = file_get_contents($thumbnailServerUrl);
            
            $zeegaThumbnail = json_decode($thumbnailJSON,true);
            
            if ( null !== $zeegaThumbnail && is_array($zeegaThumbnail) ) {
                if($size == 4) {
                    if ( array_key_exists("image_url_4", $zeegaThumbnail) ) {
                        return $zeegaThumbnail["image_url_4"];    
                    }                  
                } else if($size == 5) {
                    if ( array_key_exists("image_url_5", $zeegaThumbnail) ) {
                        return $zeegaThumbnail["image_url_5"];    
                    }
                } else if($size == 6) {
                    if ( array_key_exists("image_url_6", $zeegaThumbnail) ) {
                        return $zeegaThumbnail["image_url_6"];    
                    }
                }    
            }
        }
        catch(Exception $e)
        {
            // add log
            return null;
        }
        return null;
    }

    public function getFrameThumbnail($id)
    {
        try
        {     
            $host = $this->container->getParameter('static_host');

            if( !isset($host) || empty($host) ) {
                return null;
            }
            
            $thumbnailServerUrl =  "$host/frame/$id";
            return file_get_contents($thumbnailServerUrl);
        }
        catch(Exception $e)
        {
            // add log
            return null;
        }
        return null;
    }
}