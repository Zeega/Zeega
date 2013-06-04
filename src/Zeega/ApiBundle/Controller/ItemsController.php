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
use Symfony\Component\Validator\Mapping\Cache\ApcCache;
use Zeega\DataBundle\Document\Item;
use Zeega\ApiBundle\Controller\ApiBaseController;


class ItemsController extends ApiBaseController
{
    public function getItemsSearchAction()
    {
        try {
            // TO-DO: Auth
            $queryParser = $this->get('zeega_query_parser');
            $query = $queryParser->parseRequest($this->getRequest()->query);
            $results = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->searchItems($query);
            $resultsCount = 0;
            $user = $this->getUser();
            $editable = $this->isUserAdmin($user) || $this->isUserQuery( $query, $user );
            $itemView = $this->renderView('ZeegaApiBundle:Items:index.json.twig', array(
                'items' => $results, 
                'items_count' => $resultsCount, 
                'editable' => $editable, 
                'request' => array('query'=>$query)));

            return new Response($itemView);            
        } catch ( \BadFunctionCallException $e ) {
            return parent::getStatusResponse( 422, $e->getMessage() );
        } catch (\Exception $e) {
            return parent::getStatusResponse( 500, $e->getMessage() );
        }
    }

    /**
     * Parses a url and creates a Zeega item if the url is valid and supported.
     * - Path: GET items/parser
     * - Query string parameters:
     *     - url -  URL to be parsed
     *     - Boolean  $loadChildItems  If true the child item of the item will be loaded. Should be used for large collections if only the collection description is wanted.
     * @return Array|response
     */    
    public function getItemsParserAction()
    {
        try {
            // TO-DO: Auth
            $apiKey = $this->getRequest()->query->has('api_key') ? $this->getRequest()->query->get('api_key') : null;
            $user = $this->getUser( $apiKey );           
            $url  = $this->getRequest()->query->get('url');
            $response = $this->get('zeega_parser')->load($url);
            $itemView = $this->renderView('ZeegaApiBundle:Items:index.json.twig', array(
                'items' => $response["items"], 
                'request' => array("parser" => $response["details"])));

            return new Response($itemView);
        } catch ( \BadFunctionCallException $e ) {
            return parent::getStatusResponse( 422, $e->getMessage() );
        } catch (\Exception $e) {
            return parent::getStatusResponse( 500, $e->getMessage() );
        }
    }

    public function getItemAction($id)
    {
        try {
            $queryParser = $this->get("zeega_query_parser");
            $query = $queryParser->parseRequest( $this->getRequest()->query );
                 
            $dm = $this->get('doctrine_mongodb')->getManager();
            $item = $dm->getRepository("ZeegaDataBundle:Item")->findOneById($id);
            
            $user = $this->getUser();
            $editable = $this->isUserAdmin($user) || $this->isItemOwner( $item, $user );
            $itemView = $this->renderView( "ZeegaApiBundle:Items:show.json.twig", array(
                "item" => $item, 
                "editable" => $editable ) );

            return new Response($itemView);
        } catch ( \BadFunctionCallException $e ) {
            return parent::getStatusResponse( 422, $e->getMessage() );
        } catch (\Exception $e) {
            return parent::getStatusResponse( 500, $e->getMessage() );
        }
    }
    
    public function getItemsAction()
    {
        try {
            $query = $this->getRequest()->query->all();
            $query["sort"] = "date-desc";
            
            return $this->forward('ZeegaApiBundle:Items:getItemsSearch', array(), $query);
        } catch ( \BadFunctionCallException $e ) {
            return parent::getStatusResponse( 422, $e->getMessage() );
        } catch (\Exception $e) {
            return parent::getStatusResponse( 500, $e->getMessage() );
        }
    }

    public function deleteItemAction($itemId)
    {
        try {
            if ( !isset($itemId) ) {
                return parent::getStatusResponse( 422, "The item id parameter is mandatory and must be an integer" );
            }
            $dm = $this->getDoctrine();
            $item = $dm->getRepository('ZeegaDataBundle:Item')->find($itemId);
            if ( !isset($item) ) {
                return parent::getStatusResponse( 400, "The item with the id $itemId does not exist" );
            }
            $dm->remove($item);
            $dm->flush();

            return parent::getStatusResponse( 200 );
        } catch ( \BadFunctionCallException $e ) {
            return parent::getStatusResponse( 422, $e->getMessage() );
        } catch (\Exception $e) {
            return parent::getStatusResponse( 500, $e->getMessage() );
        }
    }

    public function postItemsAction()
    {
        try {
            // authorization
            $apiKey = $this->getRequest()->query->has('api_key') ? $this->getRequest()->query->get('api_key') : null;
            $user = $this->getUser($apiKey);
            if( !isset($user) ) {
                return parent::getStatusResponse(401);   
            }

            $requestData = $this->getRequest()->request;
            if($requestData->has('id') && $requestData->get('id') !== null && $requestData->get('child_items') && $requestData->get('child_items') !== null) {
                $requestData->set('new_items', $requestData->get('child_items'));
                $requestData->set('child_items', null);

                return $this->forward('ZeegaApiBundle:Items:putItemItems', array("itemId"=>$requestData->get('id')), array());
            }

            $itemService = $this->get('zeega.item');
            $item = $itemService->parseItem($requestData->all(), $user);
            $dm = $this->get('doctrine_mongodb')->getManager();
            $dm->persist($item);
            $dm->flush();
            $itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => $item));

            return new Response($itemView);
        } catch ( \BadFunctionCallException $e ) {
            return parent::getStatusResponse(422, $e->getMessage());
        } catch ( \Exception $e ) {
            return parent::getStatusResponse(500, $e->getMessage());
        } 
    }
    
    // delete_items_tags  DELETE   /api/items/{itemId}/tags/{tagName}.{_format}
    public function deleteItemTagsAction($itemId, $tagName)
    {
        try {
            // authorization
            $apiKey = $this->getRequest()->query->has('api_key') ? $this->getRequest()->query->get('api_key') : null;
            $user = $this->getUser($apiKey);
            if ( !isset($user) ) {
                return parent::getStatusResponse(401);   
            }

            $em = $this->getDoctrine()->getEntityManager();
            $item = $em->getRepository('ZeegaDataBundle:Item')->find($itemId);
            if ( !isset($item) ) {
                return parent::getStatusResponse( 400, "The item with the id $itemId does not exist" );
            }

            if ( $this->isUserAdmin($user) || $this->isItemOwner($item, $user) ) {
                $tags = $item->getTags();
                if ( isset($tags) ) {
                    if ( in_array($tagName,$tags) ) {
                        unset($tags["$tagName"]);
                        $item->setTags($tags);
                        $item->setDateUpdated( new \DateTime("now") );
                        $em->persist($item);
                        $em->flush();
                    }
                }

                return new Response($itemsView);
            } else {
                return parent::getStatusResponse(403);
            }
        } catch ( \BadFunctionCallException $e ) {
            return parent::getStatusResponse(422, $e->getMessage());
        } catch ( \Exception $e ) {
            return parent::getStatusResponse(500, $e->getMessage());
        }
    }
    
    public function putItemsAction($itemId)
    {
        try {
            if ( !isset($itemId) ) {
                return parent::getStatusResponse(422, "The item id parameter is mandatory and must be an integer");
            }    
            // authorization
            $apiKey = $this->getRequest()->query->has('api_key') ? $this->getRequest()->query->get('api_key') : null;
            $user = $this->getUser($apiKey);
            if ( !isset($user) ) {
                return parent::getStatusResponse(401);   
            }

            $em = $this->getDoctrine();
            $item = $em->getRepository('ZeegaDataBundle:Item')->find($itemId);
            if (!$item) {
                return parent::getStatusResponse( 400, "The child item with the id $itemId does not exist" );
            }  

            $requestData = $this->getRequest()->request;        
            $itemService = $this->get('zeega.item');
            $itemRequestData = $requestData->all();
            if(isset($itemRequestData["child_items"])) {
                $itemRequestData["child_items"] = null;
            }
            $item = $itemService->parseItem($itemRequestData, $user, $item);
            
            if ( $this->isUserAdmin($user) || $this->isItemOwner($item, $user) ) {
                $em->persist($item);
                $em->flush();
                $editable = $this->isUserAdmin($user) || $this->isItemOwner( $item, $user );
                $itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array(
                    "item" => $item,
                    "editable" => $editable));

                return new Response($itemView);
            } else {
                return parent::getStatusResponse(403);
            }
        } catch ( \BadFunctionCallException $e ) {
            return parent::getStatusResponse(422, $e->getMessage());
        } catch ( \Exception $e ) {
            return parent::getStatusResponse(500, $e->getMessage());
        }    
    }
}
