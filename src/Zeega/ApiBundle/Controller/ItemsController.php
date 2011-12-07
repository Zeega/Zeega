<?php
namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

use Zeega\IngestBundle\Entity\Item;
use Zeega\IngestBundle\Entity\Tag;
use Zeega\IngestBundle\Entity\ItemTags;
use Zeega\ApiBundle\Helpers\ItemCustomNormalizer;
use Zeega\ApiBundle\Helpers\ResponseHelper;

class ItemsController extends Controller
{
    // get_item_tags GET    /api/items/{itemId}/tags.{_format}
    public function getItemTagsAction($itemId)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $item = $em->getRepository('ZeegaIngestBundle:Item')->find($itemId);

        if (!$item) 
        {
            throw $this->createNotFoundException('Unable to find the Item with the id ' . $itemId);
        }
        
        $tags = $item->getTags();
        
        return ResponseHelper::encodeAndGetJsonResponse($tags);
    }   
    
    // post_items_tags  POST   /api/items/{itemId}/tags.{_format}
    public function getItemzTagsAction($itemId)
    {
        $user = $this->get('security.context')->getToken()->getUser();
        if($user == "anon.")
        {
            $em = $this->getDoctrine()->getEntityManager();
            $user = $em->getRepository('ZeegaUserBundle:User')->find(1);
        }
        
        $em = $this->getDoctrine()->getEntityManager();

        $item = $em->getRepository('ZeegaIngestBundle:Item')->find($itemId);

        if (!$item) 
        {
            throw $this->createNotFoundException('Unable to find the Item with the id . $itemId');
        }
        
        $tags_list = $this->getRequest()->request->get('newTags');
        //$tags_list = array('bananas');
        
        foreach($tags_list as $tagName)
        {
            $tag = $em->getRepository('ZeegaIngestBundle:Tag')->findOneByName($tagName);
            
            if (!$tag) 
            {
                $tag = new Tag();
                $tag->setName($tagName);
                $tag->setDateCreated(new \DateTime("now"));
                $tag->setUser($user->getId());
                $em->persist($tag);
                $em->flush();
            }
            
            $item_tag = new ItemTags;
            $item_tag->setItemId($item->getId());
            $item_tag->setTagId($tag->getId());
            $item_tag->setTag($tag);
            $item_tag->setItem($item);
            $item_tag->setUser($user);
            $item_tag->setTagDateCreated(new \DateTime("now"));

            $em->persist($item_tag);
            $em->flush();
        }
        
        return ResponseHelper::encodeAndGetJsonResponse($item);
    }
    
    // put_collections_items   PUT    /api/collections/{project_id}/items.{_format}
    public function putItemsTagsAction($project_id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('ZeegaIngestBundle:Item')->find($project_id);

        if (!$entity) 
        {
            throw $this->createNotFoundException('Unable to find Collection entity.');
        }
        $items_list = $this->getRequest()->request->get('newItemIDS');
        $logger = $this->get('logger');
        $logger->info('We just got the logger');        
        $logger->info(var_dump($this->getRequest()->request->get('newItemIDS')));
        // this is terrible...
        foreach($items_list as $item)
        {
            
            
            $child_entity = $em->getRepository('ZeegaIngestBundle:Item')->find($item);

            if (!$child_entity) 
            {
                throw $this->createNotFoundException('Unable to find Item entity.');
            }    
            
            $entity->addItem($child_entity);            
        }
        
        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($entity);
        $em->flush();
        
        $serializer = new Serializer(array(new ItemCustomNormalizer()),array('json' => new JsonEncoder()));
        $json = $serializer->serialize($entity, 'json');
        
        $response = new Response($json);
        $response->headers->set('Content-Type', 'application/json');
        return $response;
       
    }
   
    // Private methods 
    
    private function populateCollectionWithRequestData($request_data)
    {    
        $user = $this->get('security.context')->getToken()->getUser();
        if($user == "anon.")
        {
            $em = $this->getDoctrine()->getEntityManager();
            $user = $em->getRepository('ZeegaUserBundle:User')->find(1);
        }
        
        if (!$request_data) 
            throw $this->createNotFoundException('Collection object is not defined.');
        
        $title = $request_data->get('title');
        $new_items = $request_data->get('newItemIDS');
        
        $collection = new Item();
        $collection->setType('Collection');
        $collection->setSource('Collection');
        $collection->setUri('http://zeega.org');
        $collection->setAttributionUri("http://zeega.org");
        $collection->setUser($user);
        $collection->setChildItemsCount(0);
        $collection->setMediaCreatorUsername($user->getUsername());
        $collection->setMediaCreatorRealname($user->getDisplayName());
        $collection->setTitle($title);
        
        if (isset($new_items))
        {
            $collection->setChildItemsCount(count($new_items));
            $first = True;
            foreach($new_items as $item)
            {
                
                $child_entity = $em->getRepository('ZeegaIngestBundle:Item')->find($item);

                if (!$child_entity) 
                {
                    throw $this->createNotFoundException('Unable to find Item entity.');
                }    

                $collection->addItem($child_entity);
                if($first == True)
                {
                    $collection->setThumbnailUrl($child_entity->getThumbnailUrl());
                    $first = False;
                }
            }
        }
        
        return $collection;
    }
}