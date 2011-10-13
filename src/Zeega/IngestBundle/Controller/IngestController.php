<?php

namespace Zeega\IngestBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Zeega\IngestBundle\Entity\Media;
use Zeega\IngestBundle\Entity\Tag;
use Zeega\IngestBundle\Entity\Item;

use Imagick;
use DateTime;
use SimpleXMLElement;

class IngestController extends Controller
{
    
  

	

	public function uploadAction($data)
    {
    	 $doc= $this->getDoctrine();
    	 $loader = $this->get('item_loader');
    
    	 if(is_file((string)'docs/'.$data.'.js')){
    	 	$json = json_decode(file_get_contents ('docs/'.$data.'.js'));
    	  	foreach($json	as $args){
				if($args->thumbUrl&&$args->itemUrl){
					$loader->loadItem($doc,$args);
				}
    	 	}
    	 	 return new Response('Upload Successful');
    	 }
    	 else{
    	 	
    	 	return new Response('File not found:'+$data+'.js');
    	 
    	 }
    	 
    	
    	 
    }
	 
  	  
    
     public function thumbAction($query="Help")
    {
    	 
    	 $doc= $this->getDoctrine();
    	 $loader = $this->get('item_loader');
    
    	 $loader->loadTagThumbs($doc);
    	 
    	 return $this->render('ZeegaIngestBundle:Default:index.html.twig', array('name' => $query));
   
    }
    
     public function mediadataAction($query="Help")
    {
    	 
    	 $doc= $this->getDoctrine();
    	 $loader = $this->get('item_loader');
    
    	 $loader->loadMediaData($doc);
    	 
    	 return $this->render('ZeegaIngestBundle:Default:index.html.twig', array('name' => $query));
   
    }
    
    
}
