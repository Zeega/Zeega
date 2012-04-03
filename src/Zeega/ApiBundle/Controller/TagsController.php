<?php
namespace Zeega\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

use Zeega\DataBundle\Entity\ItemTags;
use Zeega\CoreBundle\Helpers\ResponseHelper;
use Zeega\CoreBundle\Helpers\ItemCustomNormalizer;
use Zeega\DataBundle\Repository\ItemTagsRepository;
use Doctrine\ORM\Query\ResultSetMapping;

class TagsController extends Controller
{
    //  get_collections GET    /api/collections.{_format}
    public function getTagsAction()
    {
		$em = $this->getDoctrine()->getEntityManager();

        $tags = $em->getRepository('ZeegaDataBundle:Tag')->findPaginated(100,0);
        
        $tagsView = $this->renderView('ZeegaApiBundle:Tags:index.json.twig', array('tags' => $tags));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($tagsView);
    }    

    // get_collection GET    /api/collections/{id}.{_format}
    public function getTagAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('ZeegaDataBundle:Tag')->find($id);

        $tagView = $this->renderView('ZeegaApiBundle:Tags:show.json.twig', array('tag' => $entity));
        
        return ResponseHelper::compressTwigAndGetJsonResponse($tagView);
    }
}
