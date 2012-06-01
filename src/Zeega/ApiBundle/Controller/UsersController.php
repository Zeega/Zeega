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
        
        $user = $em->getRepository('ZeegaDataBundle:User')->findOneById($id);
        $userView = $this->renderView('ZeegaApiBundle:Users:show.json.twig', array('user' => $user));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($userView);

 	}
 }