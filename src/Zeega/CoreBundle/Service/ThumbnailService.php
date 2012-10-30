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

    public function getItemThumbnail($url, $mediaType)
    {
        try
        {     
            if($mediaType != 'Collection') {                
                $host = $this->container->getParameter('static_host');
                $thumbnailServerUrl =  $host . "scripts/item.php?url=".$url.'&type='.$mediaType;
                $thumbnailJSON = file_get_contents($thumbnailServerUrl);
                
                $zeegaThumbnail = json_decode($thumbnailJSON,true);
                
                if(null !== $zeegaThumbnail && array_key_exists("thumbnail_url", $zeegaThumbnail)) {
                    return $zeegaThumbnail["thumbnail_url"];    
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
}