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
use Zeega\IngestBundle\Parser\ParserFlickr;
use \ReflectionMethod;

class ImportController extends Controller
{
	private $supportedServices = array( 
		"Zeega\IngestBundle\Parser\ParserFlickr" => "#https?://(?:www\.)?flickr\.com/photos/([^/]+)/?#"
		);
	
		
    // get_tag_related   GET    /api/tags/{tagid}/related.{_format}
    public function getImportAction()
    {
		$url = $this->getRequest()->query->get('url');

		foreach ($this->supportedServices as $parserClass => $parserRegex)
		{
			if (preg_match($parserRegex, $url)) 
			{
				$parserMethod = new ReflectionMethod($parserClass, 'parseSingleItem');
				$item = $parserMethod->invokeArgs(new $parserClass, array($url));
				$user = $this->get('security.context')->getToken()->getUser();
	    		$item->setUser($user);

				$em=$this->getDoctrine()->getEntityManager();
				$em->persist($item->getMetadata());
				$em->persist($item->getMedia());
				$em->flush();
				$em->persist($item);
				$em->flush();

				
			} else {
			    return new Response("A match was not found.");
			}
		}
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
