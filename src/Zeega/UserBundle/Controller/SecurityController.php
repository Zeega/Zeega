<?php

namespace Zeega\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\SecurityContext;
use Zeega\DataBundle\Entity\User;
use Zeega\DataBundle\Entity\Project;
use Zeega\DataBundle\Entity\Site;

use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;

class SecurityController extends Controller
{
    public function loginAction()
    {
        $request = $this->getRequest();
        $session = $request->getSession();

        // get the login error if there is one
        if ($request->attributes->has(SecurityContext::AUTHENTICATION_ERROR)) {
            $error = $request->attributes->get(SecurityContext::AUTHENTICATION_ERROR);
        } else {
            $error = $session->get(SecurityContext::AUTHENTICATION_ERROR);
        }

        return $this->render('ZeegaUserBundle:Security:login.html.twig', array(
            // last username entered by the user
            'last_username' => $session->get(SecurityContext::LAST_USERNAME),
            'error'         => $error,
        ));
    }
    
    
    public function createAction()
    {
    	$factory = $this->get('security.encoder_factory');
    	
		$user = new User();
		$user->setSalt(md5(time()));
		$encoder = $factory->getEncoder($user);
		$password = $encoder->encodePassword('burns', $user->getSalt());
		$user->setUsername('jamesburns');
		$user->setUserRoles('ROLE_USER');
		$user->setEmail('burns@metalab.harvard.edu');
		$user->setFirstName('James');
		$user->setLastName('Burns');
		$user->setPassword($password);
		
		
		$userTwo = new User();
		$userTwo->setSalt(md5(time()));
		$encoder = $factory->getEncoder($userTwo);
		$password = $encoder->encodePassword('bond', $userTwo->getSalt());
		$userTwo->setUsername('jamesbond');
		$userTwo->setUserRoles('ROLE_ADMIN');
		$userTwo->setEmail('bond@metalab.harvard.edu');
		$userTwo->setFirstName('James');
		$userTwo->setLastName('Bond');
		$userTwo->setPassword($password);
		
		$site= new Site();
		$site->setTitle('Group One');
		
		$siteTwo= new Site();
		$siteTwo->setTitle('Group Two');
		
		$project = new Project();
		$project->setTitle('Project One');
		$project->setSite($site);
		
		
		$projectTwo = new Project();
		$projectTwo->setTitle('Project Two');
		$projectTwo->setSite($site);
		
		$projectThree = new Project();
		$projectThree->setTitle('Project Three');
		$projectThree->setSite($siteTwo);
		
		
		$projectFour = new Project();
		$projectFour->setTitle('Project One');
		$projectFour->setSite($siteTwo);
		
		
		
		
		
    	$em=$this->getDoctrine()->getEntityManager();
    	$em->persist($user);
    	$em->persist($userTwo);
    	
    	$em->persist($site);
    	$em->persist($siteTwo);
    	
    	
    	
    	$em->persist($project);
    	$em->persist($projectTwo);
    	$em->persist($projectThree);
    	$em->persist($projectFour);
    	
    	$user->addSite($site);
    	$user->addSite($siteTwo);
    	$userTwo->addSite($siteTwo);
    	
    	
    	
    	$em->flush();
    
    }
    
}