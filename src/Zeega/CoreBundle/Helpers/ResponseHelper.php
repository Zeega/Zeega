<?php

namespace Zeega\CoreBundle\Helpers;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Zeega\CoreBundle\Helpers\ItemCustomNormalizer;

class ResponseHelper
{
    static public function compressTwigAndGetJsonResponse($renderedTwig)
    {
        //$renderedTwig = preg_replace('/\s+/','',$renderedTwig);
		
        //$renderedTwig = preg_replace(array('/\s{2,}/','/\n/','/\p{Zl}/'), '',$renderedTwig);
        //$renderedTwig = preg_replace(array('/\s:\s/'), ':',$renderedTwig);
        //$renderedTwig = preg_replace('/\s+/', '', $renderedTwig);
        
        //array("\r", "\r\n", "\n")
        $renderedTwig = str_replace("\&quot","&quot",$renderedTwig);
        $response = new Response($renderedTwig);
     	$response->headers->set('Content-Type', 'application/json; charset=UTF-8');
        return $response;
    }
    
    static public function getJsonResponse($entityArray)
    {
        $response = new Response(json_encode($entityArray));
     	$response->headers->set('Content-Type', 'application/json; charset=UTF-8');
        // return the results
        return $response;
    }
    
    static public function encodeAndGetJsonResponse($entityArray)
    {
        $serializer = new Serializer(array(new ItemCustomNormalizer()),array('json' => new JsonEncoder()));
        $json = $serializer->serialize($entityArray, 'json');
        
        $response = new Response($json);
     	$response->headers->set('Content-Type', 'application/json');
        // return the results
        return $response;
    }
}