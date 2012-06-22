<?php
namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

use Zeega\DataBundle\Entity\Item;
use Zeega\CoreBundle\Helpers\ItemCustomNormalizer;
use Zeega\CoreBundle\Helpers\ResponseHelper;

class UsersController extends Controller
{
    /**
     * Parses a url and creates a Zeega item if the url is valid and supported.
     * Path: GET items/parser
     *
     * @param String  $url  Url to be parsed
     * @param Boolean  $loadChildItems  If true the child item of the item will be loaded. Should be used for large collections if only the collection description is wanted.
	 * @return Array|response
     */    
    public function getUserAction($id)
    {
    	$em = $this->getDoctrine()->getEntityManager();
        $loggedUser = $this->get('security.context')->getToken()->getUser();
        
        $user = $em->getRepository('ZeegaDataBundle:User')->findOneById($id);
        
		if(isset($loggedUser) || $loggedUser->getId() == $id)
		{
			$userView = $this->renderView('ZeegaApiBundle:Users:show.json.twig', array('user' => $user, 'editable' => true));
		}
		else
		{
			$userView = $this->renderView('ZeegaApiBundle:Users:show.json.twig', array('user' => $user, 'editable' => false));
		}
        
        return ResponseHelper::compressTwigAndGetJsonResponse($userView);
 	}
 	
 	// put_collections_items   PUT    /api/collections/{project_id}/items.{_format}
    public function putUsersAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();
		$loggedUser = $this->get('security.context')->getToken()->getUser();
		
		if(!isset($loggedUser) || $loggedUser->getId() != $id)
		{
			return new Response("Unauthorized", 401);
		}
				
    	$bio = $this->getRequest()->request->get('bio');
    	$displayName = $this->getRequest()->request->get('display_name');
    	$thumbUrl = $this->getRequest()->request->get('thumbnail_url');
    	$location = $this->getRequest()->request->get('location');
    	$createdAt = $this->getRequest()->request->get('created_at');
    	$locationLatitude = $this->getRequest()->request->get('location_latitude');
    	$locationLongitude = $this->getRequest()->request->get('location_longitude');
    	
    	$user = $em->getRepository('ZeegaDataBundle:User')->find($id);
    	if(isset($bio)) $user->setBio($bio); 
    	if(isset($displayName)) $user->setDisplayName($displayName);
    	if(isset($thumbUrl)) $user->setThumbUrl($thumbUrl);
    	if(isset($location)) $user->setLocation($location);
    	if(isset($createdAt)) $user->setCreatedAt($createdAt);
    	if(isset($locationLatitude)) $user->setLocationLatitude($locationLatitude);
    	if(isset($locationLongitude)) $user->setLocationLongitude($locationLongitude);
    	
    	$em->persist($user);
        $em->flush();
		
		$userView = $this->renderView('ZeegaApiBundle:Users:show.json.twig', array('user' => $user));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($userView);
    }
 }