<?php

namespace Zeega\IngestBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Zeega\IngestBundle\Entity\Media;
use Zeega\IngestBundle\Entity\Metadata;
use Zeega\IngestBundle\Entity\Tag;
use Zeega\IngestBundle\Entity\Item;

use Imagick;
use DateTime;


class IngestController extends Controller
{
    
  

	
	public function indexAction($page)
	
	
    {
    		$start=$page*100+1;
			$originalUrl='http://dev.zeega.org/tweetoutput.php';
			$ch = curl_init();
			$timeout = 5; // set to zero for no timeout
			curl_setopt ($ch, CURLOPT_URL, $originalUrl);
			curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
			$file_contents = curl_exec($ch);
			curl_close($ch);
			//$contents=htmlspecialchars($file_contents, ENT_COMPAT, 'UTF-8');
  			$tweets=json_decode($file_contents);
  			print_r($tweets);
  			for($i=0;$i<1;$i++){
				$tweet=$tweets[0];
				return new Response($file_contents);
				$user = $this->get('security.context')->getToken()->getUser();
				$request = $this->getRequest();
			
				$em=$this->getDoctrine()->getEntityManager();
				$em->getConnection()->setCharset('utf8');
				$playgrounds=$this->getDoctrine()
								->getRepository('ZeegaEditorBundle:Playground')
								->findPlaygroundByUser($user->getId());
									$playground=$playgrounds[0];
						
								
				$item= new Item();
				$media = new Media();
				$metadata = new Metadata();
				
				$item->setChildItemsCount(0);
				
				$item->setAttributionUri('http://twitter.com/'.$tweet['username']);
				$item->setType('Tweet');
				$item->setUri($tweet['twitter_id']);
				$item->setUser($user);
				$item->setPlayground($playground);
	
				$item->setTitle($tweet['username']);
				
				$item->setMediaCreatorUsername($tweet['username']);
				$item->setMediaCreatorRealname('Unknown');
				
				if(!IS_NULL($tweet['t_lat']))$item->setMediaGeoLatitude($tweet['t_lat']);
				if(!IS_NULL($tweet['t_lon']))$item->setMediaGeoLongitude($tweet['t_lon']);
				
				$dateCreated=new DateTime($tweet['time']);
				$item->setMediaDateCreated($dateCreated);
				
				$item->setSource('Tweet');
				//$item->setDescription($photo['Description']);
				$item->setText($tweet['text']);
				$em->persist($item);
				$em->flush();
				
				
				$media->setFormat('text');
				
				$metadata->setArchive('Twitter');
				$metadata->setLocation($tweet['Location']);
			
				$metadata->setThumbnailUrl($tweet['profile_image_url']);		
				@$img=file_get_contents($tweet['profile_image_url']);
				$name=tempnam('/var/www/'.$this->container->getParameter('directory').'images/tmp/','image'.$item->getId());
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
			
				$thumb->writeImage('/var/www/'.$this->container->getParameter('directory').'images/items/'.$item->getId().'_t.jpg');
				
				$square->writeImage('/var/www/'.$this->container->getParameter('directory').'images/items/'.$item->getId().'_s.jpg');
				$item->setThumbnailUrl($this->container->getParameter('hostname').$this->container->getParameter('directory').'images/items/'.$item->getId().'_s.jpg');
			
				
				$item->setMetadata($metadata);
				$item->setMedia($media);
				
				$em->persist($item->getMetadata());
				$em->persist($item->getMedia());
				$em->flush();
				$em->persist($item);
				$em->flush();
			}
			
			
			$res=$this->getDoctrine()
								->getRepository('ZeegaIngestBundle:Item')
								->find(1);					
			$m=$res->getMetadata();
			return new Response($m->getLocation());
    
    }

	public function indAction($page)
	
	
    {
    
    		$start=$page*100+1;
			$originalUrl='http://shinsai.yahooapis.jp/v1/Archive/search?appid=IfTSsNaxg677fkdnZjdrLefkAcTvm90BSHOkb9g0zgMlvH266n3lGx8_0KAywh1Vog--&type=photo&start='.$start.'&results=100&output=php';
			$ch = curl_init();
			$timeout = 5; // set to zero for no timeout
			curl_setopt ($ch, CURLOPT_URL, $originalUrl);
			curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
			$file_contents = curl_exec($ch);
			curl_close($ch);
			$content=unserialize($file_contents);
			$photos=$content['ArchiveData']['Result'];
  			
  			for($i=0;$i<100;$i++){
				$photo=$photos[$i];
				
				$user = $this->get('security.context')->getToken()->getUser();
				$request = $this->getRequest();
			
				$em=$this->getDoctrine()->getEntityManager();
				$em->getConnection()->setCharset('utf8');
				$playgrounds=$this->getDoctrine()
								->getRepository('ZeegaEditorBundle:Playground')
								->findPlaygroundByUser($user->getId());
									$playground=$playgrounds[0];
						
								
				$item= new Item();
				$media = new Media();
				$metadata = new Metadata();
				
				$item->setChildItemsCount(0);
				
				$item->setAttributionUri('http://archive.shinsai.yahoo.co.jp/entry/'.$photo['Id'].'/');
				$item->setType('Image');
				$item->setUri($photo['PhotoData']['OriginalUrl']);
				$item->setUser($user);
				$item->setPlayground($playground);
	
				$item->setTitle($photo['Address']);
				
				$item->setMediaCreatorUsername('Unknown');
				$item->setMediaCreatorRealname('Unknown');
				
				$item->setMediaGeoLatitude($photo['Lat']);
				$item->setMediaGeoLongitude($photo['Lon']);
				
				$dateCreated=new DateTime($photo['OrgDate']);
				$item->setMediaDateCreated($dateCreated);
				
				$item->setSource('Image');
				$item->setDescription($photo['Description']);
				$em->persist($item);
				$em->flush();
				
				
				$media->setFormat('jpg');
				$media->setWidth($photo['PhotoData']['OriginalWidth']);
				$media->setHeight($photo['PhotoData']['OriginalHeight']);
				
				$aspectRatio=$photo['PhotoData']['OriginalWidth']/$photo['PhotoData']['OriginalHeight'];
				$media->setAspectRatio($aspectRatio);
				
				$metadata->setArchive('Yahoo (Shinsai Archive)');
				$metadata->setLocation($photo['Address']);
			
				$metadata->setThumbnailUrl($photo['PhotoData']['ThumbnailUrl']);		
				@$img=file_get_contents($photo['PhotoData']['ThumbnailUrl']);
				$name=tempnam('/var/www/'.$this->container->getParameter('directory').'images/tmp/','image'.$item->getId());
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
			
				$thumb->writeImage('/var/www/'.$this->container->getParameter('directory').'images/items/'.$item->getId().'_t.jpg');
				
				$square->writeImage('/var/www/'.$this->container->getParameter('directory').'images/items/'.$item->getId().'_s.jpg');
				$item->setThumbnailUrl($this->container->getParameter('hostname').$this->container->getParameter('directory').'images/items/'.$item->getId().'_s.jpg');
			
				
				$item->setMetadata($metadata);
				$item->setMedia($media);
				
				$em->persist($item->getMetadata());
				$em->persist($item->getMedia());
				$em->flush();
				$em->persist($item);
				$em->flush();
			}
			
			
			$res=$this->getDoctrine()
								->getRepository('ZeegaIngestBundle:Item')
								->find(1);					
			$m=$res->getMetadata();
			return new Response($m->getLocation());
			
    	
    }
	 
  	  
    

    
    
}
