<?php
//test
namespace Zeega\IngestBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Zeega\IngestBundle\Entity\Item;
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
		$request = $this->getRequest();
		if($request->request->get('attribution_url')&&$request->request->get('content_type')&&$request->request->get('item_url')){
 			$user = $this->get('security.context')->getToken()->getUser();
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
			
			
			$item->setAttributionUrl($request->request->get('attribution_url'));
			$item->setContentType($request->request->get('content_type'));
			$item->setItemUrl($request->request->get('item_url'));
			$item->setUser($user);
			$item->setPlayground($playground);

	    	if($request->request->get('title')) $item->setTitle($request->request->get('title'));
			else $item->setTitle('Untitled');
			if($request->request->get('creator')) $item->setCreator($request->request->get('creator'));
			else $item->setCreator('Unknown');
			
			if($request->request->get('geo_lat')) $item->setGeoLat($request->request->get('geo_lat'));
			if($request->request->get('geo_lng')) $item->setGeoLng($request->request->get('geo_lng'));
			
			if($request->request->get('date_created_start')) $item->setDateCreatedStart($request->request->get('date_created_start'));
			if($request->request->get('date_created_end	')) $item->setDateCreatedEnd($request->request->get('date_created_end	'));
			
			
			if($request->request->get('archive')) $item->setArchive($request->request->get('archive'));
			
			if($request->request->get('source_type')) $item->setSourceType($request->request->get('source_type'));
			else $item->setSourceType($request->request->get('content_type'));
			
			if($request->request->get('item_uri')) $item->setItemUri($request->request->get('item_uri'));
			
		
			$em->persist($item);
			$em->flush();
			
			/*  Create Thumbnail Image : If no thumbnail is provided, thumbnail of attribution url is created */
			
			
			$thumbUrl=false;
			
			if($request->request->get('thumb_url')){
				$thumbUrl=$request->request->get('thumb_url');
				@$img=file_get_contents($thumbUrl);
			}
			
			
			
			if(!$thumbUrl||$img==FALSE){
				exec('/opt/webcapture/webpage_capture -t 50x50 -crop '.$request->request->get('attribution_url').' /var/www/images/items',$output);
				$url=explode(":/var/www/",$output[4]);
				$thumbUrl='http://core.zeega.org/'.$url[1];
				@$img=file_get_contents($thumbUrl);
			}
		
		
			if($img==FALSE){
				return new Response(json_encode('Failed to Add'));	

			}
			else{		
			
				$name=tempnam("/var/www/images/tmp/","image".$item->getId());
				file_put_contents($name,$img);
				$square = new Imagick($name);
				$thumb = $square->clone();

				if($square->getImageWidth()>$square->getImageHeight()){
					$thumb->thumbnailImage(144, 0);
					$x=(int) floor(($square->getImageWidth()-$square->getImageHeight())/2);
					$h=$square->getImageHeight();		
					$square->chopImage($x, 0, 0, 0);
					$square->chopImage($x, 0, $h, 0);
				} 
				else{
					$thumb->thumbnailImage(0, 144);
					$y=(int) floor(($square->getImageHeight()-$square->getImageWidth())/2);
					$w=$square->getImageWidth();
					$square->chopImage(0, $y, 0, 0);
					$square->chopImage(0, $y, 0, $w);
				}
			
				$square->thumbnailImage(144,0);
			
				$thumb->writeImage('/var/www/images/items/'.$item->getId().'_t.jpg');
				$square->writeImage('/var/www/images/items/'.$item->getId().'_s.jpg');
			
		
		
				$response=$this->getDoctrine()
								->getRepository('ZeegaIngestBundle:Item')
								->findItemById($item->getId());					
				return new Response(json_encode($response[0]['id']));
			}
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

    	//TODO -allow items to be updated in the editor
    
    
    } // `delete_item`  [DELETE] /Items/{item_id}

   
}