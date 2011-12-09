<?php

namespace Zeega\ApiBundle\Helpers;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Zeega\ApiBundle\Helpers\ItemCustomNormalizer;

class ResponseHelper
{
    static public function getJsonResponse($entityArray)
    {
        $response = new Response(json_encode($entityArray));
     	$response->headers->set('Content-Type', 'application/json');
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