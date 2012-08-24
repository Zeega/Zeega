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
	        $em = $this->getDoctrine()->getEntityManager();
	        $item = $em->getRepository('ZeegaDataBundle:Item')->find($itemId);
            
            if(null === $item)
            {
            	return ResponseHelper::getJsonResponse(array(
                    "status" => "Invalid request. The item doesn't exist",
                    "request" => array("item_id" => $itemId)
                    ));
            }
            
        	$itemUri = $item->getUri();
        	$itemMediaType  = $item->getMediaType();
        	$itemThumbnail  = $item->getThumbnailUrl();
        
            if($itemMediaType != 'Collection')
            {
                if($itemMediaType != 'Image' && isset($itemThumbnail))
                {
                    $itemMediaType = 'Image';
                    $itemUri = $itemThumbnail;
                }
                /*
                $host = $this->container->getParameter('hostname');
                $thumbnailServerUrl =  "http:" . $host . "static/scripts/item.php?id=$itemId&url=".$itemUri.'&type='.$itemMediaType;
            	$thumbnailJSON = file_get_contents($thumbnailServerUrl);
            	
            	$zeegaThumbnail = json_decode($thumbnailJSON,true);
            	
                if(isset($zeegaThumbnail) && isset($zeegaThumbnail["thumbnail_url"]))
                {
                	$item->setThumbnailUrl($zeegaThumbnail["thumbnail_url"]);
                	$em->persist($item);
                    $em->flush();
                        
                }
                return new Response($thumbnailJSON);
                */
                return new Response("https://dev.zeega.org/zeega/web/images/zeega-logo-header.png");
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