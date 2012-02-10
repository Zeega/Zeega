<?php
//test
namespace Zeega\EditorBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Zeega\EditorBundle\Entity\Item;
use Zeega\EditorBundle\Entity\Route;
use Zeega\EditorBundle\Entity\Project;
use Zeega\EditorBundle\Entity\Playground;
use Zeega\EditorBundle\Entity\Node;
use Zeega\UserBundle\Entity\User;
use Zeega\EditorBundle\Form\Type\UserType;
use Zeega\EditorBundle\Form\Type\PlaygroundType;
use Zeega\EditorBundle\Form\Type\PasswordType;

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
			$playground=$this->getDoctrine()
							->getRepository('ZeegaEditorBundle:Playground')
							->findPlaygroundByShort($short,$user->getId());
			$newUser = new User();
			$form = $this->createForm(new UserType(), $newUser);    
			$request = $this->getRequest();				
			
			if ($request->getMethod() == 'POST') {
				$form->bindRequest($request);
				if ($form->isValid()) {
					$factory = $this->get('security.encoder_factory');
			
					$newUser = $form->getData();
					$newUser->setBio($newUser->getDisplayName()." is better known by the pseudonym Dziga Vertov. Born Denis Abelevich Kaufman in 1896. Father was a librarian. In 1916, started one of the world's first 'Laboratories of Hearing' to experiment with sound as art. In the 1920s, Kaufman adopted the name \"Dziga Vertov,\" which translates loosely as 'spinning top' and also was chosen because it makes the \"z-z-z-z\" sound when cranking a camera.");
					$newUser->setThumbUrl('http://mlhplayground.org/gamma-james/images/vertov.jpeg');
					$newUser->setSalt(md5(time()));
					$encoder = $factory->getEncoder($newUser);
					$password = $encoder->encodePassword($newUser->getPassword(), $newUser->getSalt());
					$newUser->setUserRoles('ROLE_USER');
					$newUser->setPassword($password);
					
					
					$em = $this->getDoctrine()->getEntityManager();
					$em->persist($newUser);
					$playground->addUser($newUser);
					$em->persist($playground);
					$em->flush();
					$message=$newUser->getDisplayName()." has been added to ".$playground->getTitle();
				}
			}
	
			
							
			if($playground||$super){
				if($user->getRoles()=='ROLE_SUPER_ADMIN') $super=true;
				else $super=false;
				$admin=true;
				$super=true;
				$projects=$this->getDoctrine()
							->getRepository('ZeegaEditorBundle:Project')
							->findProjectsByPlayground($playground->getId());
				$users=	$this->getDoctrine()
							->getRepository('ZeegaEditorBundle:Playground')
							->findUsersByPlayground($playground->getId());
				$newUser = new User();
				$form = $this->createForm(new UserType(), $newUser);    
				$request = $this->getRequest();
				
				return $this->render('ZeegaEditorBundle:Editor:playground.admin.html.twig', array(
					// last displayname entered by the user
					'user_id' => $user->getId(),
					'displayname' => $user->getdisplayname(),
					'userrole' => $user->getRoles(),
					'playground'=>$playground,
					'title'=>$playground->getTitle(),
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
			
			else return $this->render('ZeegaEditorBundle:Editor:error.html.twig');
    	}
    	else
    	{
    		return $this->render('ZeegaEditorBundle:Editor:error.html.twig');
    	}
   	}

    
    public function homeAction(){
    	
  		$user = $this->get('security.context')->getToken()->getUser();
  		/*
  		$newPlayground= new Playground();
  		$form = $this->createForm(new PlaygroundType(), $newPlayground);    
		$request = $this->getRequest();				
		$message="";
    	if ($request->getMethod() == 'POST') {
        	$form->bindRequest($request);
			if ($form->isValid()) {
				$em = $this->getDoctrine()->getEntityManager();
				$newPlayground=$form->getData();
				$newPlayground->addUser($user);
				$em->persist($newPlayground);
				$em->flush();
				$message=$newPlayground->getTitle()." has been added.";
       		}
       		else {
       			$message="Unable to add new playground";
       		
       		}
    	}
  		
  		*/
 
  			
		$playgrounds=$this->getDoctrine()
					->getRepository('ZeegaEditorBundle:Playground')
					->findPlaygroundsByUser($user->getId());
		
		$playground=$playgrounds[0];
		$url=$this->generateUrl('ZeegaEditorBundle_playground',array('short'=>$playground['short']),true);
		
		return $this->redirect($this->generateUrl('ZeegaEditorBundle_playground',array('short'=>$playground['short']),true),302);
    		
    }

	public function playgroundAction($short){
	
	$user = $this->get('security.context')->getToken()->getUser();
	$session = $this->getRequest()->getSession();
	
	if($user->getRoles()=='ROLE_SUPER_ADMIN'){
		$super=true;
		$playground=$this->getDoctrine()
					->getRepository('ZeegaEditorBundle:Playground')
					->findByShort($short);
	 	
	 }
	else{
		$super=false;			
		$playground=$this->getDoctrine()
					->getRepository('ZeegaEditorBundle:Playground')
					->findPlaygroundByShort($short,$user->getId());
	
	}
	if($playground){
		
		
		
		$session = $this->getRequest()->getSession();
		$session->set('playgroundid',$playground->getId());
		
		$admin=true;
		$projects=$this->getDoctrine()
					->getRepository('ZeegaEditorBundle:Project')
					->findProjectsByPlayground($playground->getId());
	
	
	
		$myprojects=$this->getDoctrine()
					->getRepository('ZeegaEditorBundle:Project')
					->findProjectsByPlaygroundAndUser($playground->getId(),$user->getId());
	
		
		$playgrounds=$this->getDoctrine()
					->getRepository('ZeegaEditorBundle:Playground')
					->findPlaygroundsByUser($user->getId());
	return $this->render('ZeegaEditorBundle:Editor:playground.html.twig', array(
	  	'user_id' => $user->getId(),
		'displayname' => $user->getDisplayName(),
		'myprojects'   => $myprojects,
		'allprojects'   => $projects,
		'playground'=>$playground,
		'playgrounds'=>$playgrounds,
		'num_playgrounds'=>count($playgrounds),
		'short'=>$short,
		'adminMenu'=>$admin,
		'super' => $super,
		'title'=>$playground->getTitle(),
		'projectsMenu'=>false,
		'page'=>'playground',
		
	));
	
	}
	
	//else return $this->forward('ZeegaEditorBundle:Editor:home');
	else return $this->redirect($this->generateUrl('ZeegaEditorBundle_home'), 301);
	
	
	}
	public function browserAction($short){
	
	$user = $this->get('security.context')->getToken()->getUser();
	if($user->getRoles()=='ROLE_SUPER_ADMIN') $super=true;
	else $super=false;
	$playground=$this->getDoctrine()
					->getRepository('ZeegaEditorBundle:Playground')
					->findPlaygroundByShort($short,$user->getId());
					
	$playgrounds=$this->getDoctrine()
					->getRepository('ZeegaEditorBundle:Playground')
					->findPlaygroundsByUser($user->getId());
    $admin = false;
	if($playground||$super){
		
			
			
		return $this->render('ZeegaEditorBundle:Editor:browser.html.twig', array(
			// last displayname entered by the user
			'displayname' => $user->getDisplayName(),
			'user_id' => $user->getId(),
			'title'   => $playground->getTitle(),
			'short'=>$playground->getShort(),
			'playground' => $playground,			
			'playgrounds'=>$playgrounds,
			'num_playgrounds'=>count($playgrounds),
			'super'=>$super,
			'adminMenu'=>$admin,
			'projectsMenu'=>true,
            'page'=>'editor',
            'myprojects'=>$this->getDoctrine()
					->getRepository('ZeegaEditorBundle:Project')
					->findProjectsByPlaygroundAndUser($playground->getId(),$user->getId())
			
		));
	
	
	}
	
	else{
	
		return $this->render('ZeegaEditorBundle:Editor:error.html.twig');
	
	}
	
	
	} 
	
	public function editorAction($short,$id)
	{	
		$user = $this->get('security.context')->getToken()->getUser();
		
		$super = ($user->getRoles() == 'ROLE_SUPER_ADMIN');
			
		$playground=$this->getDoctrine()
						 ->getRepository('ZeegaEditorBundle:Playground')
						 ->findPlaygroundByShort($short,$user->getId());
    	$admin = false;

		if($playground||$super)
		{
			$routes = $this->getDoctrine()
						   ->getRepository('ZeegaEditorBundle:Route')
						   ->findRoutesByProject($id);
						
			$project = $this->getDoctrine()
							->getRepository('ZeegaEditorBundle:Project')
							->findOneById($id);

			$route = $routes[0];
			
			$params = array('playground'=>$playground->getId());
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
			$playgrounds=$this->getDoctrine()
					->getRepository('ZeegaEditorBundle:Playground')
					->findPlaygroundsByUser($user->getId());
			return $this->render('ZeegaEditorBundle:Editor:editor.html.twig', array(
				// last displayname entered by the user
					'displayname' => $user->getDisplayName(),
					'title'   => $playground->getTitle(),
					'user_id' => $user->getId(),
					'projecttitle'   => $project->getTitle(),
					'projectid'   =>$project->getId(),
					'route'=>$route,
					'short'=>$playground->getShort(),
					'super'=>$super,
					'adminMenu'=>$admin,
					'projectsMenu'=>true,
            		'page'=>'editor',
					'results' => $items,
					'collection_id' => $collection_id,
					'myprojects'=>$this->getDoctrine()
					->getRepository('ZeegaEditorBundle:Project')
					->findProjectsByPlaygroundAndUser($playground->getId(),$user->getId()),
					'playground' => $playground,						
					'playgrounds'=>$playgrounds,
					'num_playgrounds'=>count($playgrounds),
				));
		}	
		else
		{
			return $this->render('ZeegaEditorBundle:Editor:error.html.twig');
		}
	} 
	
	public function projectAction($short){
		$user = $this->get('security.context')->getToken()->getUser();
		if($user->getRoles()=='ROLE_SUPER_ADMIN') $super=true;
		else $super=false;
		$playground=$this->getDoctrine()
						->getRepository('ZeegaEditorBundle:Playground')
						->findPlaygroundByShort($short,$user->getId());
		$admin=$this->getDoctrine()
				->getRepository('ZeegaEditorBundle:Playground')
				->checkAdmin($short,$user->getId());
		if($playground||$super){
				$project= new Project();
				$route = new Route();
				$node = new Node();
				$node->setRoute($route);
				$project->setPlayground($playground);
				$project->addUsers($user);
				$route->setProject($project);
				$route->setTitle('Untitled: '.date('l F j, Y h:i:s A'));
				$project->setTitle('Untitled: '.date('l F j, Y h:i:s A'));
				$em=$this->getDoctrine()->getEntityManager();
				$em->persist($route);
				$em->persist($project);
				$em->persist($node);
				$em->flush();
				$response= $this->forward('ZeegaEditorBundle:Editor:editor', array(
						'id'  => $project->getId(),
						'short' =>  $short,
						'admin' => $admin,
						'super' => $super,
					));
				return $response;
		
		
		}
		
		else{
		
			return $this->render('ZeegaEditorBundle:Editor:error.html.twig');
		
		}
	
	
	}
	
	public function faqAction(){
		$user = $this->get('security.context')->getToken()->getUser();
		if($user->getRoles()=='ROLE_SUPER_ADMIN') $super=true;
		else $super=false;
		$playgrounds=$this->getDoctrine()
					->getRepository('ZeegaEditorBundle:Playground')
					->findPlaygroundsByUser($user->getId());
		return $this->render('ZeegaEditorBundle:Editor:faq.html.twig', array(
		'displayname' => $user->getDisplayName(),
		'title'=>'',
		'user_id' => $user->getId(),
		'super' => $super,
		'page'=>'faq',

		'num_playgrounds'=>count($playgrounds),
		
		));
	} 
	
	public function siteadminAction(){
		return $this->render('ZeegaEditorBundle:Editor:siteadmin.html.twig',array(
			'user_id' => $user->getId(),
            'page'=>'home',
            ));
	} 
	
	public function settingsAction(){
		$user = $this->get('security.context')->getToken()->getUser();		
			$playgrounds=$this->getDoctrine()
					->getRepository('ZeegaEditorBundle:Playground')
					->findPlaygroundsByUser($user->getId());
		if($user){
				$newUser = new User();
				$form = $this->createForm(new PasswordType(), $newUser);    
				$request = $this->getRequest();
				if($user->getRoles()=='ROLE_SUPER_ADMIN') $super=true;
				else $super=false;
				return $this->render('ZeegaEditorBundle:Editor:settings.html.twig', array(
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
			

			));
    	}
    	else  $this->redirect($this->generateUrl('ZeegaEditorBundle_home'), 301);
    }
}