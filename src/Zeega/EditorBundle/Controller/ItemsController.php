<?php
//test
namespace Zeega\EditorBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Zeega\EditorBundle\Entity\Item;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityRepository;

class ItemsController extends Controller
{
    
    public function getItemsAction()
    {} // `get_items`    [GET] /Items

    public function postItemsAction()
    {

    	//TODO: Post Item functionality
 
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