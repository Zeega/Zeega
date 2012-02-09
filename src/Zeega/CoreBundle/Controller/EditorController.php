<?php
//test
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
    
 
    
	public function adminAction($short){
	
			
    	$message='';
		$user = $this->get('security.context')->getToken()->getUser();
		if($user->getRoles()=='ROLE_SUPER_ADMIN') $super=true;
		else $super=false;
		$super=true;

		if ($super) {
			$site=$this->getDoctrine()
							->getRepository('ZeegaDataBundle:Site')
							->findSiteByShort($short,$user->getId());
			$newUser = new User();
			$form = $this->createForm(new UserType(), $newUser);    
			$request = $this->getRequest();				
			
			if ($request->getMethod() == 'POST') {
				$form->bindRequest($request);
				if ($form->isValid()) {
					$factory = $this->get('security.encoder_factory');
			
					$newUser = $form->getData();
					$newUser->setBio($newUser->getDisplayName()." is better known by the pseudonym Dziga Vertov. Born Denis Abelevich Kaufman in 1896. Father was a librarian. In 1916, started one of the world's first 'Laboratories of Hearing' to experiment with sound as art. In the 1920s, Kaufman adopted the name \"Dziga Vertov,\" which translates loosely as 'spinning top' and also was chosen because it makes the \"z-z-z-z\" sound when cranking a camera.");
					$newUser->setThumbUrl('http://mlhsite.org/gamma-james/images/vertov.jpeg');
					$newUser->setSalt(md5(time()));
					$encoder = $factory->getEncoder($newUser);
					$password = $encoder->encodePassword($newUser->getPassword(), $newUser->getSalt());
					$newUser->setUserRoles('ROLE_USER');
					$newUser->setPassword($password);
					
					
					$em = $this->getDoctrine()->getEntityManager();
					$em->persist($newUser);
					$site->addUser($newUser);
					$em->persist($site);
					$em->flush();
					$message=$newUser->getDisplayName()." has been added to ".$site->getTitle();
				}
			}
	
			
							
			if($site||$super){
				if($user->getRoles()=='ROLE_SUPER_ADMIN') $super=true;
				else $super=false;
				$admin=true;
				$super=true;
				$projects=$this->getDoctrine()
							->getRepository('ZeegaDataBundle:Project')
							->findProjectsBySite($site->getId());
				$users=	$this->getDoctrine()
							->getRepository('ZeegaDataBundle:Site')
							->findUsersBySite($site->getId());
				$newUser = new User();
				$form = $this->createForm(new UserType(), $newUser);    
				$request = $this->getRequest();
				
				return $this->render('ZeegaCoreBundle:Editor:site.admin.html.twig', array(
					// last displayname entered by the user
					'user_id' => $user->getId(),
					'displayname' => $user->getdisplayname(),
					'userrole' => $user->getRoles(),
					'site'=>$site,
					'title'=>$site->getTitle(),
					'short'=>$short,
					'adminMenu'=>false,
					'projectsMenu'=>true,
					'projects'=>$projects,
					'super'=>$super,
					'users'=>$users[0]['users'],
					'form' => $form->createView(),
					'message'=>$message,
					
				));
			}
			
			else return $this->render('ZeegaCoreBundle:Editor:error.html.twig');
    	}
    	else
    	{
    		return $this->render('ZeegaCoreBundle:Editor:error.html.twig');
    	}
   	}

    
    public function homeAction(){
    	
  		$user = $this->get('security.context')->getToken()->getUser();
  		/*
  		$newSite= new Site();
  		$form = $this->createForm(new SiteType(), $newSite);    
		$request = $this->getRequest();				
		$message="";
    	if ($request->getMethod() == 'POST') {
        	$form->bindRequest($request);
			if ($form->isValid()) {
				$em = $this->getDoctrine()->getEntityManager();
				$newSite=$form->getData();
				$newSite->addUser($user);
				$em->persist($newSite);
				$em->flush();
				$message=$newSite->getTitle()." has been added.";
       		}
       		else {
       			$message="Unable to add new site";
       		
       		}
    	}
  		
  		*/
 
  			
		$sites=$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Site')
					->findSitesByUser($user->getId());
		
		$site=$sites[0];
		$url=$this->generateUrl('ZeegaCoreBundle_site',array('short'=>$site['short']),true);
		
		return $this->redirect($this->generateUrl('ZeegaCoreBundle_site',array('short'=>$site['short']),true),302);
    		
    }

	public function siteAction($short){
	
	$user = $this->get('security.context')->getToken()->getUser();
	$session = $this->getRequest()->getSession();
	
	if($user->getRoles()=='ROLE_SUPER_ADMIN'){
		$super=true;
		$site=$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Site')
					->findByShort($short);
	 	
	 }
	else{
		$super=false;			
		$site=$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Site')
					->findSiteByShort($short,$user->getId());
	
	}
	if($site){
		
		
		
		$session = $this->getRequest()->getSession();
		$session->set('siteid',$site->getId());
		
		$admin=true;
		$projects=$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Project')
					->findProjectsBySite($site->getId());
	
	
	
		$myprojects=$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Project')
					->findProjectsBySiteAndUser($site->getId(),$user->getId());
	
		
		$sites=$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Site')
					->findSitesByUser($user->getId());
	return $this->render('ZeegaCoreBundle:Editor:site.html.twig', array(
	  	'user_id' => $user->getId(),
		'displayname' => $user->getDisplayName(),
		'myprojects'   => $myprojects,
		'allprojects'   => $projects,
		'site'=>$site,
		'sites'=>$sites,
		'num_sites'=>count($sites),
		'short'=>$short,
		'adminMenu'=>$admin,
		'super' => $super,
		'title'=>$site->getTitle(),
		'projectsMenu'=>false,
		'page'=>'site',
		
	));
	
	}
	
	//else return $this->forward('ZeegaCoreBundle:Editor:home');
	else return $this->redirect($this->generateUrl('ZeegaCoreBundle_home'), 301);
	
	
	}
	public function browserAction($short){
	
	$user = $this->get('security.context')->getToken()->getUser();
	if($user->getRoles()=='ROLE_SUPER_ADMIN') $super=true;
	else $super=false;
	$site=$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Site')
					->findSiteByShort($short,$user->getId());
					
	$sites=$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Site')
					->findSitesByUser($user->getId());
    $admin = false;
	if($site||$super){
		
			
			
		return $this->render('ZeegaCoreBundle:Editor:browser.html.twig', array(
			// last displayname entered by the user
			'displayname' => $user->getDisplayName(),
			'user_id' => $user->getId(),
			'title'   => $site->getTitle(),
			'short'=>$site->getShort(),
			'site' => $site,			
			'sites'=>$sites,
			'num_sites'=>count($sites),
			'super'=>$super,
			'adminMenu'=>$admin,
			'projectsMenu'=>true,
            'page'=>'editor',
            'myprojects'=>$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Project')
					->findProjectsBySiteAndUser($site->getId(),$user->getId())
			
		));
	
	
	}
	
	else{
	
		return $this->render('ZeegaCoreBundle:Editor:error.html.twig');
	
	}
	
	
	} 
	
	public function editorAction($short,$id)
	{	
		$user = $this->get('security.context')->getToken()->getUser();
		
		$super = ($user->getRoles() == 'ROLE_SUPER_ADMIN');
			
		$site=$this->getDoctrine()
						 ->getRepository('ZeegaDataBundle:Site')
						 ->findSiteByShort($short,$user->getId());
    	$admin = false;

		if($site||$super)
		{
			$sequences = $this->getDoctrine()
						   ->getRepository('ZeegaDataBundle:Sequence')
						   ->findSequencesByProject($id);
						
			$project = $this->getDoctrine()
							->getRepository('ZeegaDataBundle:Project')
							->findOneById($id);

			$sequence = $sequences[0];
			
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
			//return new Response(var_dump($params));
			//return new Response($this->forward('ZeegaApiBundle:Search:search', array(), $params)->getContent());
			
			$items = $this->forward('ZeegaApiBundle:Search:search', array(), $params)->getContent();
			$sites=$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Site')
					->findSitesByUser($user->getId());
			return $this->render('ZeegaCoreBundle:Editor:editor.html.twig', array(
				// last displayname entered by the user
					'displayname' => $user->getDisplayName(),
					'title'   => $site->getTitle(),
					'user_id' => $user->getId(),
					'projecttitle'   => $project->getTitle(),
					'projectid'   =>$project->getId(),
					'sequence'=>$sequence,
					'short'=>$site->getShort(),
					'super'=>$super,
					'adminMenu'=>$admin,
					'projectsMenu'=>true,
            		'page'=>'editor',
					'results' => $items,
					'collection_id' => $collection_id,
					'myprojects'=>$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Project')
					->findProjectsBySiteAndUser($site->getId(),$user->getId()),
					'site' => $site,						
					'sites'=>$sites,
					'num_sites'=>count($sites),
				));
		}	
		else
		{
			return $this->render('ZeegaCoreBundle:Editor:error.html.twig');
		}
	} 
	
	public function projectAction($short){
		$user = $this->get('security.context')->getToken()->getUser();
		if($user->getRoles()=='ROLE_SUPER_ADMIN') $super=true;
		else $super=false;
		$site=$this->getDoctrine()
						->getRepository('ZeegaDataBundle:Site')
						->findSiteByShort($short,$user->getId());
		$admin=$this->getDoctrine()
				->getRepository('ZeegaDataBundle:Site')
				->checkAdmin($short,$user->getId());
		if($site||$super){
				$project= new Project();
				$sequence = new Sequence();
				$frame = new Frame();
				$frame->setSequence($sequence);
				$project->setSite($site);
				$project->addUsers($user);
				$sequence->setProject($project);
				$sequence->setTitle('Untitled: '.date('l F j, Y h:i:s A'));
				$project->setTitle('Untitled: '.date('l F j, Y h:i:s A'));
				$em=$this->getDoctrine()->getEntityManager();
				$em->persist($sequence);
				$em->persist($project);
				$em->persist($frame);
				$em->flush();
				$response= $this->forward('ZeegaCoreBundle:Editor:editor', array(
						'id'  => $project->getId(),
						'short' =>  $short,
						'admin' => $admin,
						'super' => $super,
					));
				return $response;
		
		
		}
		
		else{
		
			return $this->render('ZeegaCoreBundle:Editor:error.html.twig');
		
		}
	
	
	}
	
	public function faqAction(){
		$user = $this->get('security.context')->getToken()->getUser();
		if($user->getRoles()=='ROLE_SUPER_ADMIN') $super=true;
		else $super=false;
		$sites=$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Site')
					->findSitesByUser($user->getId());
		return $this->render('ZeegaCoreBundle:Editor:faq.html.twig', array(
		'displayname' => $user->getDisplayName(),
		'title'=>'',
		'user_id' => $user->getId(),
		'super' => $super,
		'page'=>'faq',
		'myprojects'=>false,
		'site' => false,					
		'sites'=>false,
		'num_sites'=>count($sites),
		
		));
	} 
	
	public function siteadminAction(){
		return $this->render('ZeegaCoreBundle:Editor:siteadmin.html.twig',array(
			'user_id' => $user->getId(),
            'page'=>'home',
            ));
	} 
	
	public function settingsAction(){
		$user = $this->get('security.context')->getToken()->getUser();		
			$sites=$this->getDoctrine()
					->getRepository('ZeegaDataBundle:Site')
					->findSitesByUser($user->getId());
		if($user){
				$newUser = new User();
				$form = $this->createForm(new PasswordType(), $newUser);    
				$request = $this->getRequest();
				if($user->getRoles()=='ROLE_SUPER_ADMIN') $super=true;
				else $super=false;
				return $this->render('ZeegaCoreBundle:Editor:settings.html.twig', array(
				// last displayname entered by the user
				'email' => $user->getEmail(),
				'user_id' => $user->getId(),
				'displayname' => $user->getDisplayName(),
				'userrole' => $user->getRoles(),
				'bio'=>$user->getBio(),
				'thumb'=>$user->getThumbUrl(),
				'super'=>$super,
				'title'=>'',
				'page'=>'home',
				'form'=>$form->createView(),
				'myprojects'=>false,
				'site' => false,					
				'sites'=>false,

			));
    	}
    	else  $this->redirect($this->generateUrl('ZeegaCoreBundle_home'), 301);
    }
}