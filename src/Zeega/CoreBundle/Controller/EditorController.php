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
    public function homeAction(){
    	
  		$user = $this->get('security.context')->getToken()->getUser();
  			
		$sites=$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Site')
					->findSitesByUser($user->getId());
		
		$site=$sites[0];
		$url=$this->generateUrl('ZeegaCoreBundle_site',array('short'=>$site['short']),true);
		
		return $this->redirect($this->generateUrl('ZeegaCoreBundle_site',array('short'=>$site['short']),true),302);
    		
    }

	public function siteAction($short)
	{
	
		$user = $this->get('security.context')->getToken()->getUser();
		$session = $this->getRequest()->getSession();
	
		$site = $this->getDoctrine()->getRepository('ZeegaDataBundle:Site')->findSiteByShort($short,$user->getId());

		$projects = $this->getDoctrine()->getRepository('ZeegaDataBundle:Project')->findProjectsBySite($site->getId());
	
		return $this->render('ZeegaCoreBundle:Editor:site.html.twig', array(
			'allprojects'   => $projects,
			'page'=>'site',
		));
	}

	public function browserAction($short)
	{
		$user = $this->get('security.context')->getToken()->getUser();
		
		return $this->render('ZeegaCoreBundle:Editor:browser.html.twig', array('page'=>'editor'));
	} 
	
	public function editorAction($short,$id)
	{	
		$user = $this->get('security.context')->getToken()->getUser();
		
		$site=$this->getDoctrine()
						 ->getRepository('ZeegaDataBundle:Site')
						 ->findSiteByShort($short,$user->getId());
		$sequences = $this->getDoctrine()
					   ->getRepository('ZeegaDataBundle:Sequence')
					   ->findSequencesByProject($id);
					
		$project = $this->getDoctrine()
						->getRepository('ZeegaDataBundle:Project')
						->findOneById($id);

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
		
		$items = $this->forward('ZeegaApiBundle:Search:search', array(), $params)->getContent();
		
		
		return $this->render('ZeegaCoreBundle:Editor:editor.html.twig', array(
				'projecttitle'   => $project->getTitle(),
				'projectid'   =>$project->getId(),
				'sequence'=>$sequence,
           		'page'=>'editor',
				'results' => $items,
				'collection_id' => $collection_id,
			));
	} 
	
	public function faqAction()
	{
	    $user = $this->get('security.context')->getToken()->getUser();

		$sites=$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Site')
					->findSitesByUser($user->getId());

		return $this->render('ZeegaCoreBundle:Editor:faq.html.twig', array('page'=>'faq'));
    } 
}