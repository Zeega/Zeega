<?php

namespace Zeega\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\DataBundle\Entity\Frame;
use Zeega\DataBundle\Entity\Layer;
use Zeega\DataBundle\Entity\Sequence;
use Zeega\DataBundle\Entity\Site;
use Zeega\DataBundle\Entity\Project;
use Zeega\DataBundle\Entity\User;

class SitesController extends Controller
{
    
     
	 // `post_site`   [POST] /sites
    public function postSiteAction()
    {
    	if($request->request->get('title')){
    	
    		$site= new Site();
    		$site->setTitle($request->request->get('title'));
    		$em=$this->getDoctrine()->getEntityManager();
			$em->persist($site);
			return new Response(json_encode($site));
    	}
    	else{
    	
    	return new Response('Failure');
    	}
    }

	// `get_site`     [GET] /sites/{site_id}
    public function getSiteAction($site_id)
    {
    	$site=$this->getDoctrine()
        ->getRepository('ZeegaDataBundle:Site')
        ->findSiteById($site_id);
    	return new Response(json_encode($site[0]));
        
    
    } 
    
    public function deleteSiteUserAction($site_id,$user_id){
    
    	
    	$site=$this->getDoctrine()
        ->getRepository('ZeegaDataBundle:Site')
        ->find($site_id);
        $user=$this->getDoctrine()
        ->getRepository('ZeegaUserBundle:User')
        ->find($user_id);
        $site->removeUsers($user);
        $em=$this->getDoctrine()->getEntityManager();
		$em->persist($site);
    	return new Response('Success');
    
    }
    
    
     // `post_site`   [POST] site/{site_id}/project
    public function postSiteProjectAction($site_id)
    {
    	$user = $this->get('security.context')->getToken()->getUser();
    	$request = $this->getRequest();
		
		if($request->request->get('title'))$title=$request->request->get('title');
		if($request->request->get('collection_id'))
		{
			$session = $this->getRequest()->getSession();
			$session->set("collection_id", $request->request->get('collection_id'));
		} 
		
		else $title='Untitled Project';
    	$site=$this->getDoctrine()
        ->getRepository('ZeegaDataBundle:Site')
        ->find($site_id);
    	$project= new Project();
    	$project->setDateCreated(new \DateTime("now"));
    	$project->setEnabled(true);
    	$project->setPublished(false);

		//$project->setAttr(array('cover_image'=>'http://dev.zeega.org/joseph/web/images/default_cover.png'));
    	$project->setAttr(array('author'=>$user->getDisplayName(), 'cover_image'=>'http://dev.zeega.org/joseph/web/images/default_cover.png' ));
    	
		$sequence = new Sequence();
		$frame = new Frame();
		$frame->setSequence($sequence);
		$frame->setProject($project);
		$project->setSite($site);
		$project->addUser($user);
		$sequence->setProject($project);
		$sequence->setTitle('Intro Sequence');
		$project->setTitle($title);
		$em=$this->getDoctrine()->getEntityManager();
		$em->persist($sequence);
		$em->persist($project);
		$em->persist($frame);
		$em->flush();
		return new Response($project->getId());
    }
}
