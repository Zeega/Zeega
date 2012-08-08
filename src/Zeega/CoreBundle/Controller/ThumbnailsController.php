<?php
namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

use Zeega\DataBundle\Entity\Item;
use Zeega\CoreBundle\Helpers\ItemCustomNormalizer;
use Zeega\CoreBundle\Helpers\ResponseHelper;

class ThumbnailsController extends Controller
{
    public function getItemThumbnailAction($itemId)
    {
        try
        {      
            $request = $this->getRequest();
        	$itemUri = $request->query->get('uri');
        	$itemMediaType  = $request->query->get('media_type');
        
            if(!isset($itemUri) || !isset($itemMediaType))
            {
                return ResponseHelper::getJsonResponse(array(
                    "status" => "Invalid request. Please ensure that you are sending correct values for the media_image and media_type.",
                    "request" => array("item_id" => $itemId, "uri" => $itemUri, "media_type" => $itemMediaType)
                    ));
            }
        
            if($itemMediaType != 'Collection')
            {
                if($itemMediaType != 'Image' && isset($itemUri))
                {
                    $itemMediaType = 'Image';
                }
            
                $host = $this->container->getParameter('hostname');
                $thumbnailServerUrl =  $host . "static/scripts/item.php?id=$itemId&url=".$itemUri.'&type='.$itemMediaType;
                return json_decode(file_get_contents($thumbnailServerUrl),true);
            }
        }
        catch(Exception $e)
        {
            return ResponseHelper::getJsonResponse(array(
                "status" => "Something went wrong. Please ensure that you are sending correct values for the media_image and media_type.",
                "request" => array("item_id" => $itemId, "uri" => $itemUri, "media_type" => $itemMediaType),
                "error" => $e->getMessage()
                ));
            
        }
    }
}