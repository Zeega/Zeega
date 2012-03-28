<?php
namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

use Zeega\DataBundle\Entity\ItemTags;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\Site;
use Zeega\CoreBundle\Helpers\ResponseHelper;
use Zeega\CoreBundle\Helpers\ItemCustomNormalizer;
use Zeega\DataBundle\Repository\ItemTagsRepository;
use Doctrine\ORM\Query\ResultSetMapping;
use Zeega\ExtensionsBundle\Parser\AbsoluteUrl\ParserAbsoluteUrl;
use \ReflectionMethod;

class ParserController extends Controller
{
	// get_tag_related   GET    /api/tags/{tagid}/related.{_format}
    public function getParserValidateAction()
    {
		$url = $this->getRequest()->query->get('url');
		$parser = $this->get('zeega_parser');
		
		// parse the url with the ExtensionsBundle\Parser\ParserService
		$response = $parser->load($url,true);
		
		$item = $response["items"];
		$isSet = ($response["is_set"]) ? 'true' : 'false'; 
		$message = isset($response["message"]) ? $response["message"] : " ";
		$success = $response["success"] ? 'true' : 'false'; // twig wasn't rendering 'false' for some reason
		
		$itemView = $this->renderView('ZeegaApiBundle:Import:info.json.twig', array('item' => $item, 'is_collection' => $isSet, 'is_valid' => $success, 'message' => $message));

	    return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
    }
		
    // get_tag_related   GET    /api/tags/{tagid}/related.{_format}
    public function postParserPersistAction()
    {
        $url = $this->getRequest()->query->get('url');
		$parser = $this->get('zeega_parser');
		
		// parse the url with the ExtensionsBundle\Parser\ParserService
		$isUrlValid = $parser->validate($url);
		
		if($isUrlValid == true)
		{
		    
		}
		
		$item = $response["items"];
		$isSet = ($response["is_set"]) ? 'true' : 'false'; 
		$message = isset($response["message"]) ? $response["message"] : " ";
		$success = $response["success"] ? 'true' : 'false'; // twig wasn't rendering 'false' for some reason
		
		if($success == false)
		{
		    $itemView = $this->renderView('ZeegaApiBundle:Import:info.json.twig', array('item' => $item, 'is_collection' => $isSet, 'is_valid' => $success, 'message' => $message));
    	    return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
		}
		
		if($isSet)
		{
		    $user = $this->get('security.context')->getToken()->getUser();
    		$em = $this->getDoctrine()->getEntityManager();
            
		    $site = $this->getDoctrine()
    				     ->getRepository('ZeegaDataBundle:Site')
    				     ->findSiteByUser($user->getId());

			$collection = new Item();
				
			$collection->setSite($site[0]);
					
			$collection->setTitle($this->getRequest()->request->get('title'));
			$collection->setDescription($this->getRequest()->request->get('description'));
	        $collection->setMediaType("Collection");
	        $collection->setLayerType("Collection");
			$collection->setArchive($this->getRequest()->request->get('archive'));
	        $collection->setUser($user);
	        $collection->setUri($this->getRequest()->request->get('uri'));
	        $collection->setAttributionUri($this->getRequest()->request->get('attribution_uri'));
			$collection->setThumbnailUrl($this->getRequest()->request->get('thumbnail_url'));
	        $collection->setChildItemsCount($this->getRequest()->request->get('child_items_count'));
	        $collection->setDateCreated(new \DateTime("now"));
	        $collection->setMediaCreatorUsername($this->getRequest()->request->get('media_creator_username'));
	        $collection->setMediaCreatorRealname($this->getRequest()->request->get('media_creator_realname'));
	        $collection->setEnabled(true);
	        $collection->setPublished(true);

			$parserMethod = new ReflectionMethod($parserClass, 'getCollection'); // reflection is slow, but it's probably ok here
			$response = $parserMethod->invokeArgs(new $parserClass, array($url, $setId, $collection));
			$collection = $response["items"];
		
			$collection->setUser($user);
			$collectionItems = $collection->getChildItems();
		
			foreach($collectionItems as $item)
	        {
				$item->setUser($user);
				$item->setSite($site[0]);
				$item->setEnabled(true);
		        $item->setPublished(true);
				$em->flush();
				$em->persist($item);
				$em->flush();
			}
		
			$collection->setUser($user);
			
			$message = isset($response["message"]) ? $response["message"] : " ";
			
			$em->persist($collection);
			$em->flush();

			$itemView = $this->renderView('ZeegaApiBundle:Import:info.json.twig', array('item' => $collection, 'is_collection' => true, 'is_valid' => true, 'message' => $message));
	        return ResponseHelper::compressTwigAndGetJsonResponse($itemView);
		}
		else
		{
			return $this->forward('ZeegaApiBundle:Items:postItems', array(), array());
		}
    }
}
