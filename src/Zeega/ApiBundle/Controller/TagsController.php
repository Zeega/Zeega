<?php
namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

use Zeega\IngestBundle\Entity\Tag;
use Zeega\ApiBundle\Helpers\ResponseHelper;
use Zeega\ApiBundle\Helpers\ItemCustomNormalizer;

class TagsController extends Controller
{
    //  get_collections GET    /api/collections.{_format}
    public function getTagsAction()
    {
        $em = $this->getDoctrine()->getEntityManager();

        $tags = $em->getRepository('ZeegaIngestBundle:Tag')->findAll();
        
        return ResponseHelper::encodeAndGetJsonResponse($tags);
    }    

    // get_collection GET    /api/collections/{id}.{_format}
    public function getTagAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('ZeegaIngestBundle:Tag')->find($id);

        if (!$entity) 
        {
            throw $this->createNotFoundException('Unable to find Tag entity.');
        }

        return ResponseHelper::encodeAndGetJsonResponse($entity);
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