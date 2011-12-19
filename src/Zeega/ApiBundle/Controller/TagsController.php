<?php
namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

use Zeega\IngestBundle\Entity\ItemTags;
use Zeega\ApiBundle\Helpers\ResponseHelper;
use Zeega\ApiBundle\Helpers\ItemCustomNormalizer;
use Zeega\IngestBundle\Repository\ItemTagsRepository;
use Doctrine\ORM\Query\ResultSetMapping;

class TagsController extends Controller
{
    // get_tag_related   GET    /api/tags/{tagid}/related.{_format}
    public function getTagSimilarAction($tagid)
    {
        // get this code out of here - use entity instead
        $em = $this->getDoctrine()->getEntityManager();

        $conn = $this->get('database_connection');
		
		
        $tags = $conn->fetchAll('select Tag.*,TagCorrelation.correlation_index from TagCorrelation inner join Tag on TagCorrelation.tag_related_id = Tag.id 
                                 where TagCorrelation.tag_id = ? order by correlation_index DESC LIMIT 20 OFFSET 0',
                                 array($tagid));
		
		/*
		$query = array();
		$query['tag_id'] = $tagid;
		$query['limit'] = 20;
		$query['offset'] = 0;
		
		$tags = $em->getRepository('ZeegaIngestBundle:TagCorrelation')->searchRelatedTags($query);
		*/
		//return new Response(json_encode($tags));
		
		$tag = $em->getRepository('ZeegaIngestBundle:Tag')->find($tagid);
		
        $tagsView = $this->renderView('ZeegaApiBundle:Tags:similar.json.twig', array('tags' => $tags, 'similar' => $tag));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($tagsView);
    }

    //  get_collections GET    /api/collections.{_format}
    public function getTagsAction()
    {
		$em = $this->getDoctrine()->getEntityManager();

        $tags = $em->getRepository('ZeegaIngestBundle:Tag')->findPaginated(100,0);
        
        $tagsView = $this->renderView('ZeegaApiBundle:Tags:index.json.twig', array('tags' => $tags));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($tagsView);
    }    

    // get_collection GET    /api/collections/{id}.{_format}
    public function getTagAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('ZeegaIngestBundle:Tag')->find($id);

        $tagView = $this->renderView('ZeegaApiBundle:Tags:show.json.twig', array('tag' => $entity));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($tagView);
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
