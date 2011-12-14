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
    //  get_collections GET    /api/items.{_format}
    public function getItemsAction()
    {
        $query = array();
        
        $request = $this->getRequest();
        //  api global parameters
		$query["page"]  = $request->query->get('page');      //  string
		$query["limit"] = $request->query->get('limit');     //  string
		
		//  collection specific parameters
        $query['returnCollections'] = 1;
        
        //  set defaults for missing parameters  
		if(!isset($query['page']))          $query['page'] = 0;
		if(!isset($query['limit']))         $query['limit'] = 100;
		if($query['limit'] > 100) 	        $query['limit'] = 100;
        
         //  execute the query
 		$queryResults = $this->getDoctrine()
 					        ->getRepository('ZeegaIngestBundle:Item')
 					        ->searchItems($query);								

        $tagsView = $this->renderView('ZeegaApiBundle:Items:index.json.twig', array('items' => $queryResults));
        return ResponseHelper::compressTwigAndGetJsonResponse($tagsView);
    }
    
    // get_collection GET    /api/item/{id}.{_format}
    public function getItemAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();
        
        $item = $em->getRepository('ZeegaIngestBundle:Item')->findOneById($id);
        $itemTags = $em->getRepository('ZeegaIngestBundle:ItemTags')->findByItem($id);
        
        $itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => $item, 'tags' => $itemTags));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
    }
    
    // get_item_tags GET    /api/items/{itemId}/tags.{_format}
    public function getItemTagsAction($itemId)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $tags = $em->getRepository('ZeegaIngestBundle:ItemTags')->searchItemTags($itemId);

        $tagsView = $this->renderView('ZeegaApiBundle:Items:tags.json.twig', array('tags' => $tags, 'item_id'=>$itemId));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($tagsView);
    }
    
    // get_item_tags GET    /api/items/{itemId}/tags.{_format}
    public function getItemSimilarAction($itemId)
    {
        $em = $this->getDoctrine()->getEntityManager();

        // get item tags
        $tags = $em->getRepository('ZeegaIngestBundle:ItemTags')->searchItemTags($itemId);
        
        $tagsId = array();
        foreach($tags as $tag)
        {
            array_push($tagsId, $tag["id"]);
        }
        
        $tagsId = join(",",$tagsId);
        
        // get items with the same tags
        $items = $em->getRepository('ZeegaIngestBundle:Item')->searchItemsByTags($tagsId);
        
        // render results
        $itemsView = $this->renderView('ZeegaApiBundle:Items:index.json.twig', array('items' => $items));        
        return ResponseHelper::compressTwigAndGetJsonResponse($itemsView);
    }   
    
    // post_items_tags  POST   /api/items/{itemId}/tags.{_format}
    public function putItemsTagsAction($itemId)
    {
        $user = $this->get('security.context')->getToken()->getUser();
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