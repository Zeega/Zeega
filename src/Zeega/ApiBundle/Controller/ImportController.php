<?php
namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

class ImportController extends Controller
{
	private static $supportedUrls = $array("youb");
	
    // get_tag_related   GET    /api/tags/{tagid}/related.{_format}
    public function getUrlInfo($url)
    {
		/*
		$tag = $em->getRepository('ZeegaIngestBundle:Tag')->find($tagid);
		
        $tagsView = $this->renderView('ZeegaApiBundle:Tags:similar.json.twig', array('tags' => $tags, 'similar' => $tag));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($tagsView);
		*/
    }

    
	// post_collections POST   /api/collections.{_format}
    public function postUrl($url)
    {
	
	}
	
	private function isUrlSupported($url)
	{
		$supportedUrls = $array(
			"youb"
			);
			
		return false;
	}
}
