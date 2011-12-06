<?php
//test
namespace Zeega\IngestBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Zeega\IngestBundle\Entity\Item;
use Zeega\IngestBundle\Entity\Media;
use Zeega\IngestBundle\Entity\Metadata;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;
use Zeega\UserBundle\Entity\User;
use Zeega\EditorBundle\Entity\Playground;
use Imagick;
use DateTime;

class ItemsController extends Controller
{
    
    public function getItemsAction()
    {} // `get_items`    [GET] /Items

    public function postItemsAction()
    {
    	
    	$user = $this->get('security.context')->getToken()->getUser();
		$request = $this->getRequest();
		
		
		if($request->request->get('attribution_url')&&$request->request->get('content_type')&&$request->request->get('item_url')){
 			
			$em=$this->getDoctrine()->getEntityManager();
			
			$session=$request->getSession();
			
			if($session->get('Playground')) $playground=$session->get('Playground');
			else {
				$playgrounds=$this->getDoctrine()
							->getRepository('ZeegaEditorBundle:Playground')
							->findPlaygroundByUser($user->getId());
				$playground=$playgrounds[0];
			}		
							
			$item= new Item();
			$media = new Media();
			$metadata = new Metadata();
			
			
			$item->setAttributionUri($request->request->get('attribution_uri'));
			$item->setType($request->request->get('type'));
			$item->setUri($request->request->get('uri'));
			$item->setUser($user);
			$item->setPlayground($playground);

	    	if($request->request->get('title')) $item->setTitle($request->request->get('title'));
			else $item->setTitle('Untitled');
			
			if($request->request->get('media_creator_username')) $item->setMediaCreatorUsername($request->request->get('media_creator_username'));
			else $item->setMediaCreatorUsername('Unknown');
			
			if($request->request->get('media_creator_realname')) $item->setMediaCreatorRealname($request->request->get('media_creator_realname'));
			else $item->setMediaCreatorRealname('Unknown');
			
			if($request->request->get('media_geo_latitude')) $item->setMediaGeoLatitude($request->request->get('media_geo_latitude'));
			if($request->request->get('media_geo_longitude')) $item->setMediaGeoLongitude($request->request->get('media_geo_longitude'));
			
			if($request->request->get('media_date_created')) $item->setDateCreated($request->request->get('date_created'));
			if($request->request->get('media_date_created_end	')) $item->setDateCreatedEnd($request->request->get('date_created_end'));
			
			
			if($request->request->get('source')) $item->setSource($request->request->get('source'));
			if($request->request->get('description')) $item->setDescription($request->request->get('description'));
			if($request->request->get('text')) $item->setText($request->request->get('text'));
			
			
			if($request->request->get('format')) $media->setFormat($request->request->get('format'));
			if($request->request->get('bit_rate')) $media->setBitRate($request->request->get('bit_rate'));
			if($request->request->get('duration')) $media->setDuration($request->request->get('duration'));
			if($request->request->get('width')) $media->setWidth($request->request->get('width'));
			if($request->request->get('height')) $media->setHeight($request->request->get('height'));
			if($request->request->get('aspect_ratio')) $media->setAspectRatio($request->request->get('aspect_ratio'));
			
			if($request->request->get('archive')) $metadata->setArchive($request->request->get('archive'));
			if($request->request->get('license')) $metadata->setLicense($request->request->get('license'));
			if($request->request->get('attributes')) $metadata->setAttributes($request->request->get('attributes'));
			if($request->request->get('location')) $metadata->setLocation($request->request->get('location'));
			
			
			/*  Create Thumbnail Image : If no thumbnail is provided, thumbnail of attribution url is created */
			
			
			$thumbUrl=false;
			
			if($request->request->get('thumbnail_url')){
				$metadata->setThumbnailUrl($request->request->get('thumbnail_url'));		
			
				$name=tempnam('/var/www/'.$this->get('container')->getParameter('directory').'web/images/tmp/','image'.$item->getId());
				file_put_contents($name,$img);
				$square = new Imagick($name);
				//$thumb = $square->clone();

				if($square->getImageWidth()>$square->getImageHeight()){
					//$thumb->thumbnailImage(144, 0);
					$x=(int) floor(($square->getImageWidth()-$square->getImageHeight())/2);
					$h=$square->getImageHeight();		
					$square->chopImage($x, 0, 0, 0);
					$square->chopImage($x, 0, $h, 0);
				} 
				else{
					//$thumb->thumbnailImage(0, 144);
					$y=(int) floor(($square->getImageHeight()-$square->getImageWidth())/2);
					$w=$square->getImageWidth();
					$square->chopImage(0, $y, 0, 0);
					$square->chopImage(0, $y, 0, $w);
				}
			
				$square->thumbnailImage(144,0);
			
				//$thumb->writeImage('/var/www/'.$this->get('container')->getParameter('directory').'web/images/items/'.$item->getId().'_t.jpg');
				
				$square->writeImage('/var/www/'.$this->get('container')->getParameter('directory').'web/images/items/'.$item->getId().'_s.jpg');
				$item->setThumbnailUrl($this->get('container')->getParameter('hostname').$this->get('container')->getParameter('directory').'web/images/items/'.$item->getId().'_s.jpg');
			}
			
			else $item->setThumbnailUrl($this->get('container')->getParameter('hostname').$this->get('container')->getParameter('directory').'web/images/templates/'.$item->getType().'.jpg');
			
			
			$item->setMetadata($metadata);
			$item->setMedia($media);
			
			$em->persist($item->getMetadata());
			$em->persist($item->getMedia());
			$em->flush();
			$em->persist($item);
			$em->flush();
			
			$response=$this->getDoctrine()
								->getRepository('ZeegaIngestBundle:Item')
								->findItemById($item->getId());					
			return new Response(json_encode($response[0]['id']));
	}


	} // `post_items`   [POST] /Items

    public function getItemAction($item_id)
    {
    	//TODO: Include Join with media/metadata
    	
    	return new Response(json_encode($this->getDoctrine()
        ->getRepository('ZeegaIngestBundle:Item')
        ->findItemById($item_id)));
    
    } // `get_item`     [GET] /Items/{item_id}

    public function editItemAction($item_id)
    {} // `edit_item`    [GET] /Items/{item_id}/edit

    public function putItemAction($item_id)
    {

    	//TODO -allow items to be updated in the editor
    
    
    
    } // `put_item`     [PUT] /Items/{item_id}

    public function deleteItemAction($item_id)
    {

    	$em = $this->getDoctrine()->getEntityManager();
     	$item = $em->getRepository('ZeegaIngestBundle:Item')->find(8783);
    	
    	
    	$em->remove($item);
    	$em->flush();
    	return new Response('SUCCESS',200);
    
    
    } // `delete_item`  [DELETE] /Items/{item_id}

   
}