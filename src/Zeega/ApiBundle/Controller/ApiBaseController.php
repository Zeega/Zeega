<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\ApiBundle\Controller;

use Symfony\Component\HttpFoundation\Response;

use Zeega\CoreBundle\Controller\BaseController;

class ApiBaseController extends BaseController
{
    protected function getErrorResponse($errorCode, $errorMessage = null)
    {
        if ( null === $errorCode ) {
            throw new \BadFunctionCallException('The errorCode parameter cannot be null');
        }
        
        switch ( $errorCode ) {
            case 400:   // bad request
                $message = "The request could not be understood by the server due to malformed syntax.";
                break;
            case 401:
                $message = "The request requires user authentication";
                break;
            case 403:
                $message = "Forbidden";
                break;
            case 422:
                $message = "Unprocessable Entity";
                break;
            case 500:
                $message = "Internal Server Error - The server encountered an unexpected condition which prevented it from fulfilling the request.";
                break;
            default:
                $message = "Internal Server Error - The server encountered an unexpected condition which prevented it from fulfilling the request.";
                break;
        }

        if ( null !== $errorMessage) {
            $responseContent = array("code" => $errorCode, "message" => $errorMessage);    
        } else {
            $responseContent = array("code" => $errorCode, "message" => $message);    
        }
        
        return new Response( json_encode($responseContent) );
    }
}