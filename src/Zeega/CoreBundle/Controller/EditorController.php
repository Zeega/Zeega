<?php
namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Zeega\DataBundle\Entity\Item;
use Zeega\DataBundle\Entity\Sequence;
use Zeega\DataBundle\Entity\Project;
use Zeega\DataBundle\Entity\Site;
use Zeega\DataBundle\Entity\Frame;
use Zeega\DataBundle\Entity\User;
use Zeega\CoreBundle\Form\Type\UserType;
use Zeega\CoreBundle\Form\Type\SiteType;
use Zeega\CoreBundle\Form\Type\PasswordType;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;

class EditorController extends Controller
{
    public function homeAction()
    {
        $session = $this->getRequest()->getSession();
        $site = $session->get('site');
        
        if(isset($site))
        {
            return $this->forward('ZeegaCoreBundle:Editor:site',array('short'=>$site->getShort()),array());
        }
		else
		{
		    $user = $this->get('security.context')->getToken()->getUser();
    		$sites = $user->getSites();
    		
    		if(isset($sites) && count($sites) > 0)
    		{
    		    return $this->forward('ZeegaCoreBundle:Editor:site',array('short'=>$sites[0]->getShort()),array());
    		}
		}
		
		// by default go home - this should never happen
		//return $this->forward('ZeegaCoreBundle:Editor:site',array('short'=>'home'),array());
    }

	public function siteAction($short)
	{
		$user = $this->get('security.context')->getToken()->getUser();
		$site = $this->getDoctrine()->getRepository('ZeegaDataBundle:Site')->findOneByShort($short);

        if(!isset($site))
        {
            $site = $this->getDoctrine()->getRepository('ZeegaDataBundle:Site')->findOneByShort('home');
        }
        
        $projects = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findProjectsBySite($site->getId());

		$session = $this->getRequest()->getSession();

        // store an attribute for reuse during a later user request
        $session->set('site', $site);

		return $this->render('ZeegaCoreBundle:Editor:site.html.twig', array('allprojects' => $projects, 'page'=>'site',));
	}

	public function browserAction($short)
	{
		return $this->render('ZeegaCoreBundle:Editor:browser.html.twig', array('page'=>'editor'));
	} 
	
	public function editorAction($short,$id)
	{	
		$user = $this->get('security.context')->getToken()->getUser();
		
		$site = $this->getDoctrine()->getRepository('ZeegaDataBundle:Site')->findOneByShort($short);
		$sequences = $this->getDoctrine()
					   ->getRepository('ZeegaDataBundle:Sequence')
					   ->findSequencesByProject($id);
					
		$project = $this->getDoctrine()
						->getRepository('ZeegaDataBundle:Project')
						->findOneById($id);
		$projectLayers =  $this->getDoctrine()
							   ->getRepository('ZeegaDataBundle:Layer')
							   ->findLayersByProject($id);
		$sequence = $sequences[0];
		
		// create project from collections browser
		$params = array('site'=>$site->getId());
		$session = $this->getRequest()->getSession();
		$collection_id = $session->get("collection_id");
		
		if(isset($collection_id))
		{
			$params['collection'] = $collection_id;
			
			$session->remove("collection_id"); // reads and deletes from session
		}
		else
		{
			$collection_id = -1;
		}
		
		$params["r_itemswithcollections"] = 0;
		$params["r_items"] = 1;
		$params["user"] = -1;
		
		$items = $this->forward('ZeegaApiBundle:Search:search', array(), $params)->getContent();
		$projectData = $this->forward('ZeegaApiBundle:Projects:getProject', array("id" => $id))->getContent();
		
		$userCollections = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findUserCollections($user->getId(), $site->getId());
		//return $this->forward('ZeegaApiBundle:Projects:getProject', array("id" => $id));
		
		return $this->render('ZeegaCoreBundle:Editor:editor.html.twig', array(
				'projecttitle'   => $project->getTitle(),
				'projectid'   =>$project->getId(),
				'project'   =>$project,
				'sequence'=>$sequence,
				'sequences'=>$sequences,
				'projectLayers' => $projectLayers,
           		'page'=>'editor',
				'results' => $items,
				'collection_id' => $collection_id,
				'project_data' => $projectData,
				'user_collections' => $userCollections,
			));
	} 
	
	public function faqAction()
	{
	    $user = $this->get('security.context')->getToken()->getUser();

		return $this->render('ZeegaCoreBundle:Editor:faq.html.twig', array('page'=>'faq'));
    } 
}