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
		"#https?://(?:www\.)?flickr\.com/photos/[^/]+/([0-9]+)#" => array("ParserClass" => "Zeega\IngestBundle\Parser\ParserFlickr", "IsSet" => false),
		"#https?://(?:www\.)?flickr\.com/photos/[^/]+/sets/([0-9]+)#" => array("ParserClass" => "Zeega\IngestBundle\Parser\ParserFlickr", "IsSet" => true),
		);
	
	// get_tag_related   GET    /api/tags/{tagid}/related.{_format}
    public function getImportCheckAction()
    {
		$url = $this->getRequest()->query->get('url');
		$results = array("is_valid"=>false, "is_set"=>false);
		
		foreach ($this->supportedServices as $parserRegex => $parserInfo)
		{
			if (preg_match($parserRegex, $url)) 
			{
				$parserClass = $parserInfo["ParserClass"];
				$isSet = $parserInfo["IsSet"];
				
				$parserMethod = new ReflectionMethod($parserClass, 'getItemThumbnail'); // reflection is slow, but it's probably ok here
				$thumbnail = $parserMethod->invokeArgs(new $parserClass, array($url));
				
				$results = array("is_valid"=>true, "is_set"=>$isSet, "thumbnail" =>$thumbnail);
			}
		}

		return ResponseHelper::getJsonResponse($results);
    }
		
    // get_tag_related   GET    /api/tags/{tagid}/related.{_format}
    public function getImportAction()
    {
		$url = $this->getRequest()->query->get('url');

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
					$parserMethod = new ReflectionMethod($parserClass, 'parseSet'); // reflection is slow, but it's probably ok here
					$collection = $parserMethod->invokeArgs(new $parserClass, array($url));
					
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
					return new Response("we're good to go");
				}
				else
				{
					$parserMethod = new ReflectionMethod($parserClass, 'parseSingleItem');
					$item = $parserMethod->invokeArgs(new $parserClass, array($url));

					$user = $this->get('security.context')->getToken()->getUser();
		    		$item->setUser($user);

					$em = $this->getDoctrine()->getEntityManager();
					$em->persist($item->getMetadata());
					$em->persist($item->getMedia());
					$em->flush();
					$em->persist($item);
					$em->flush();
					$itemView = $this->renderView('ZeegaApiBundle:Items:show.json.twig', array('item' => $item, 'tags' => array()));
			        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
				}
			} 
		}
    }
}
