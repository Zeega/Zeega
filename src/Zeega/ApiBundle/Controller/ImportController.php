<?php
namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

use Zeega\IngestBundle\Entity\ItemTags;
use Zeega\IngestBundle\Entity\Item;
use Zeega\ApiBundle\Helpers\ResponseHelper;
use Zeega\ApiBundle\Helpers\ItemCustomNormalizer;
use Zeega\IngestBundle\Repository\ItemTagsRepository;
use Doctrine\ORM\Query\ResultSetMapping;
use Zeega\IngestBundle\Parser\ParserFlickr;
use \ReflectionMethod;

class ImportController extends Controller
{
	private $supportedServices = array( 
		"#https?://(?:www\.)?flickr\.com/photos/[^/]+/([0-9]+)#" => array("ParserClass" => "Zeega\IngestBundle\Parser\ParserFlickr", "IsSet" => false),
		"#https?://(?:www\.)?flickr\.com/photos/[^/]+/sets/([0-9]+)#" => array("ParserClass" => "Zeega\IngestBundle\Parser\ParserFlickr", "IsSet" => true),
		);
	
	// get_tag_related   GET    /api/tags/{tagid}/related.{_format}
    public function getParserValidateAction()
    {
		$url = $this->getRequest()->query->get('url');
		$results = array("is_valid"=>false, "is_set"=>false);
		
		foreach ($this->supportedServices as $parserRegex => $parserInfo)
		{
			if (preg_match($parserRegex, $url)) 
			{
				$parserClass = $parserInfo["ParserClass"];
				$isSet = $parserInfo["IsSet"];
				
				$parserMethod = new ReflectionMethod($parserClass, 'isUrlSupported'); // reflection is slow, but it's probably ok here
				$isValid = $parserMethod->invokeArgs(new $parserClass, array($url));
				
				$results = array("is_valid"=>$isValid, "is_set"=>$isSet);
				
				if($isValid)
				{
					if($isSet)
					{
						$parserMethod = new ReflectionMethod($parserClass, 'getSetInfo'); // reflection is slow, but it's probably ok here
					}
					else
					{
						$parserMethod = new ReflectionMethod($parserClass, 'parseSingleItem');
					}
					
					$isSet = ($isSet) ? 'true' : 'false'; // twig wasn't rendering 'false' for some reason
					$isValid = ($isValid) ? 'true' : 'false';
					
					$response = $parserMethod->invokeArgs(new $parserClass, array($url));
					$item = $response["items"];
				
					$itemView = $this->renderView('ZeegaApiBundle:Import:info.json.twig', array('item' => $item, 'is_collection' => $isSet, 'is_valid' => $isValid));
			        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
				}
			}
		}

		$itemView = $this->renderView('ZeegaApiBundle:Import:info.json.twig', array('item' => null, 'is_collection' => 0, 'is_valid' => 0));
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
    }
		
    // get_tag_related   GET    /api/tags/{tagid}/related.{_format}
    public function postParserPersistAction()
    {
		$url = $this->getRequest()->request->get('attribution_uri');
		//return new Response($url);
		foreach ($this->supportedServices as $parserRegex => $parserInfo)
		{
			if (preg_match($parserRegex, $url)) 
			{
				$user = $this->get('security.context')->getToken()->getUser();
				$em = $this->getDoctrine()->getEntityManager();
				
				$parserClass = $parserInfo["ParserClass"];
				$isSet = $parserInfo["IsSet"];

				if($isSet)
				{
					$collection = new Item();

				    $collection->setTitle($this->getRequest()->request->get('title'));
					$collection->setDescription($this->getRequest()->request->get('description'));
			        $collection->setType($this->getRequest()->request->get('type'));
			        $collection->setSource($this->getRequest()->request->get('source'));
			        $collection->setUser($user);
			        $collection->setUri($this->getRequest()->request->get('uri'));
			        $collection->setAttributionUri($this->getRequest()->request->get('attribution_uri'));
					$collection->setThumbnailUrl($this->getRequest()->request->get('thumbnail_url'));
			        $collection->setChildItemsCount($this->getRequest()->request->get('child_items_count'));
			        $collection->setMediaCreatorUsername($this->getRequest()->request->get('media_creator_username'));
			        $collection->setMediaCreatorRealname($this->getRequest()->request->get('media_creator_realname'));
					
					$parserMethod = new ReflectionMethod($parserClass, 'parseSetItems'); // reflection is slow, but it's probably ok here
					$response = $parserMethod->invokeArgs(new $parserClass, array($url,$collection));
					$collection = $response["items"];
					
					$collection->setUser($user);
					$collectionItems = $collection->getChildItems();
					
					foreach($collectionItems as $item)
			        {
						$item->setUser($user);
						$em->persist($item->getMetadata());
						$em->persist($item->getMedia());
						$em->flush();
						$em->persist($item);
						$em->flush();
					}
					
					$collection->setUser($user);
					
					$em->persist($collection);
					$em->flush();
					//return new Response("we're good to go");
					$itemView = $this->renderView('ZeegaApiBundle:Import:info.json.twig', array('item' => $collection, 'is_collection' => true, 'is_valid' => true));
			        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
				}
				else
				{
					return $this->forward('ZeegaApiBundle:Items:postItems', array(), array());
				}
			} 
		}
		
		$itemView = $this->renderView('ZeegaApiBundle:Import:info.json.twig', array('item' => null, 'is_collection' => 0, 'is_valid' => 0));
        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);		
    }
}
