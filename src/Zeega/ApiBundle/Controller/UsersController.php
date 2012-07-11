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
        
        if($id == -1)
        {
        	$userView = $this->renderView('ZeegaApiBundle:Users:show.json.twig', array('user' => $loggedUser, 'editable' => true));
        }
        else
        {
			$user = $em->getRepository('ZeegaDataBundle:User')->findOneById($id);
			if(!isset($user))
			{
			    $userView = $this->renderView('ZeegaApiBundle:Users:show.json.twig');
			}
			else
			{
			    if($this->container->get('security.context')->isGranted('IS_AUTHENTICATED_FULLY') && $loggedUser->getId() == $user->getId())
    			{
    				$userView = $this->renderView('ZeegaApiBundle:Users:show.json.twig', array('user' => $user, 'editable' => true));
    			}
    			else
    			{
    				$userView = $this->renderView('ZeegaApiBundle:Users:show.json.twig', array('user' => $user, 'editable' => false));
    			}
    		}
        }
        return ResponseHelper::compressTwigAndGetJsonResponse($userView);
 	}
 	
    public function getUserProjectsAction($id)
    {
        $request = $this->getRequest();
        $limit = $request->query->get('limit');         //  string
        
        $em = $this->getDoctrine()->getEntityManager();
        $loggedUser = $this->get('security.context')->getToken()->getUser();
        
        if($id == -1)
        {
            $projects = $em->getRepository('ZeegaDataBundle:Project')->findProjectsByUser($loggedUser->getId(), $limit);
        	$userView = $this->renderView('ZeegaApiBundle:Users:show.json.twig', array('user' => $loggedUser, 'editable' => true, 'projects' => $projects));
        }
        else
        {
			$user = $em->getRepository('ZeegaDataBundle:User')->findOneById($id);
			if(!isset($user))
			{
			    $userView = $this->renderView('ZeegaApiBundle:Users:show.json.twig');
			}
			else
			{
                $projects = $em->getRepository('ZeegaDataBundle:Project')->findProjectsByUser($user->getId(), $limit);
			
			    if($this->container->get('security.context')->isGranted('IS_AUTHENTICATED_FULLY') && $loggedUser->getId() == $user->getId())
			    {
				    $userView = $this->renderView('ZeegaApiBundle:Users:show.json.twig', array('user' => $user, 'editable' => true, 'projects' => $projects));
			    }
			    else
			    {
				    $userView = $this->renderView('ZeegaApiBundle:Users:show.json.twig', array('user' => $user, 'editable' => false, 'projects' => $projects));
			    }
			}
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
    	$locationLatitude = $this->getRequest()->request->get('location_latitude');
    	$locationLongitude = $this->getRequest()->request->get('location_longitude');
    	
    	$user = $em->getRepository('ZeegaDataBundle:User')->find($id);
    	if(isset($bio)) $user->setBio($bio); 
    	if(isset($displayName)) $user->setDisplayName($displayName);
    	if(isset($thumbUrl)) $user->setThumbUrl($thumbUrl);
    	if(isset($location)) $user->setLocation($location);
    	if(isset($locationLatitude)) $user->setLocationLatitude($locationLatitude);
    	if(isset($locationLongitude)) $user->setLocationLongitude($locationLongitude);
    	
    	$em->persist($user);
        $em->flush();
		
		$userView = $this->renderView('ZeegaApiBundle:Users:show.json.twig', array('user' => $user, 'editable' => 'true'));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($userView);
    }
    
    public function postUserProfileimageAction($id)
	{
		$em = $this->getDoctrine()->getEntityManager();
		$loggedUser = $this->get('security.context')->getToken()->getUser();
		
		if(!isset($loggedUser) || $loggedUser->getId() != $id)
		{
			return new Response("Unauthorized", 401);
		}
		
		$files = $this->getRequest()->files;
		
		if(isset($files))
		{
			$imageFile = $files->get('imagefile');
			
			if(isset($imageFile))
			{
				$mimeType = $imageFile->getClientMimeType();
				$fileSize = $imageFile->getClientSize();
				$maxFileSize = $imageFile->getMaxFilesize();
				
				if($fileSize > $maxFileSize)
				{
					return new Response("{status: 'There was an error uploading your image. Please try to upload a smaller image.'}"); 
				}
				
				if($mimeType != "image/png" && $mimeType != 'image/jpeg')
				{
					return new Response("{status: 'The file you are trying to upload is not a valid image'}"); 
				}

				$imageName = uniqid() . ".jpg";
				$imagePath = $this->container->getParameter('path') . "/users/profileimages/";
				$imageTempPath = $this->container->getParameter('path')  . "/tmp/";
				$imageWebPath = $this->container->getParameter('hostname') . $this->container->getParameter('directory') . "content/users/profileimages/";
				
				$imageFile->move($imageTempPath, $imageFile->getClientOriginalName());
				$square = new \Imagick($imageTempPath . $imageFile->getClientOriginalName());
				
				if($square->getImageWidth() > $square->getImageHeight())
				{
					$x=(int) floor(($square->getImageWidth()-$square->getImageHeight())/2);
					$h=$square->getImageHeight();
					$square->chopImage($x, 0, 0, 0);
					$square->chopImage($x, 0, $h, 0);
				}	 
				else{
					$y=(int) floor(($square->getImageHeight()-$square->getImageWidth())/2);
					$w=$square->getImageWidth();
					$square->chopImage(0, $y, 0, 0);
					$square->chopImage(0, $y, 0, $w);
				}
				$square->thumbnailImage(144,0);
				$square->writeImage($imagePath . $imageName);
				
				$user = $em->getRepository('ZeegaDataBundle:User')->find($id);
				$user->setThumbUrl($imageWebPath . $imageName);
				$em->persist($user);
		        $em->flush();
		        
		        $imageWebPath = $imageWebPath . $imageName;
		        return new Response("{status: 'Success', thumbnail_url: '$imageWebPath'}"); 
			}
		}
		
	}
 }