<?php

namespace Zeega\IngestBundle;

use Zeega\IngestBundle\Entity\Media;
use Zeega\IngestBundle\Entity\Tag;
use Zeega\IngestBundle\Entity\Item;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Imagick;
use DateTime;



		
		
class ItemLoader
{
	
	
	public function loadItem($doc, $args){
		
		
		$title=(String)$args->title;
		
		
		$itemUrl=(String)$args->itemUrl;
		$attributionUrl=(String)$args->attributionUrl;
		$thumbUrl=(String)$args->thumbUrl;
		
		if(isset($args->creator))$creator=(String)$args->creator;
		else $creator=null;
		if(isset($args->geoLat))$geoLat=$args->geoLat;
		else $geoLat=null;
		if(isset($args->geoLng))$geoLng=$args->geoLng;
		else $geoLng=null;
		
		$tags=$args->tags;
		$contentType=$args->contentType;
		
		if (IS_NULL($doc->getRepository('ZeegaIngestBundle:Item')->findItemByUrl($itemUrl))) {
		
		
			//Create random date for testing purposes
			
			$time = (int) strtotime("10 September 1900"); 
			$time2 = (int) strtotime("24 June 2011"); 
			
			$date1 = date("m d Y",rand( $time , $time2  ) ); //Must be called once before becoming random, ??? 
			$year = date("Y", rand( $time , $time2  ));
			$month = date("m", rand( $time , $time2  ));
			$day = date("d", rand( $time , $time2  ));
			
			$date = new DateTime();
			
			$date->setDate($year,$month,$day);
			
			//End random date
		
		
			$em=$doc->getEntityManager();
			
			$item = new Item();
			$item->setItemUrl($itemUrl);
			$item->setAttributionUrl($attributionUrl);
			$item->setTitle($title);
			$item->setCreator($creator);
			$item->setGeoLat($geoLat);
			$item->setGeoLng($geoLng);
			
			$item->setDateCreatedStart($date);
			$item->setDateCreatedEnd($date);
			
			$item->setContentType($contentType);
			
			
			
			$tempTags=array();
			$tempTagIds=array();
			
			if(count($tags)>0){
				foreach($tags as $tag){
					$tag=ucwords($tag);
					if(!in_array($tag,$tempTags)){
					array_push($tempTags,$tag);
					$tagItem = $doc
					->getRepository('ZeegaIngestBundle:Item')
					->findTagByTitle($tag);
					
					
					if (IS_NULL($tagItem)) {
						$tagItem = new Item();
						$tagItem->setTitle($tag);
						$tagItem->setItemUrl($tag);
						$tagItem->setDateCreatedStart($date);
						$tagItem->setDateCreatedEnd($date);
						$tagItem->setContentType("Tag");
						$em->persist($tagItem);
						$em->flush();
					}
					
					if(!in_array($tagItem->getId(),$tempTagIds)){
					 array_push($tempTagIds,$tagItem->getId());
					 $item->addParentCollections($tagItem);
					}
					}
					
				}
			}
			
				try{
				$em->persist($item);
				$em->flush();
				
				
				
				
	
	
				/* Open Image */
				 
				 $img=file_get_contents($thumbUrl);
				 $name=tempnam("images/tmp/","image".$item->getId());
				 file_put_contents($name,$img);
	
	
				$square = new Imagick($name);
				//$thumb = $square->clone();
			
				
				
				if($square->getImageWidth()>$square->getImageHeight()){
				//$thumb->thumbnailImage(100, 0);
				$x=(int) floor(($square->getImageWidth()-$square->getImageHeight())/2);
				$h=$square->getImageHeight();
				
				$square->chopImage($x, 0, 0, 0);
				$square->chopImage($x, 0, $h, 0);
				} 
				else{
				//$thumb->thumbnailImage(0, 100);
				$y=(int) floor(($square->getImageHeight()-$square->getImageWidth())/2);
				$w=$square->getImageWidth();
				$square->chopImage(0, $y, 0, 0);
				$square->chopImage(0, $y, 0, $w);
				}
				
					
				//$thumb->writeImage('images/thumbs/'.$item->getId().'_t.jpg');
				
				
				
				$square->thumbnailImage(75,0);
				$square->writeImage('images/thumbs/'.$item->getId().'_s.jpg');
			
				unlink($name);
				}
				catch (Exception $e){
				
				}
			}
	
	}
	
	public function createItemThumb($attributionUrl,$thumbUrl=null){
	
		if(IS_NULL($thumbUrl)){
			exec('/opt/webcapture/webpage_capture -t 50x50 -crop http://alpha1.zeega.org/web/gamma/node.html#'.$id.' /var/www/images/nodes',$output);
			$url=explode(":/var/www/",$output[4]);
			$thumbUrl='http://alpha1.zeega.org/'.$url[1];
		}
		
		$img=file_get_contents($thumbUrl);
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
		
		$thumb->writeImage('/var/www/images/items/'.$item->getId().'_t.jpg');
		$square->thumbnailImage(144,0);
		$square->writeImage('/var/www/images/items/'.$item->getId().'_s.jpg');
	
	}
	


	public function loadTagThumbs($doc){
	
	
		$tags = $doc
				->getRepository('ZeegaIngestBundle:Item')
				->findAllCollections();
		foreach($tags as $tag){
		
		$item= $doc
				->getRepository('ZeegaIngestBundle:Item')
				->findOneByCollectionId($tag['id']);
		if($item){		
			 $id=$item[0]['id'];
			 $uri=$item[0]['id'];
			 
			 if(is_file("images/thumbs/".$id."_s.jpg")){
		     $img=file_get_contents("images/thumbs/".$id."_s.jpg");
			 $name=tempnam("images/tmp/","image".$item[0]['id']);
			 file_put_contents($name,$img);


			$square = new Imagick($name);
			$square->writeImage('images/thumbs/'.$tag['id'].'_s.jpg');
		
			unlink($name);
		
		}	}
		}
	
	}
	
	public function loadMediaData($doc){
	
	
		$i=0;
		$em=$doc->getEntityManager();
		$items = $doc
				->getRepository('ZeegaIngestBundle:Item')
				->findAllByType('Video');
		
		foreach($items as $item){
	
			if(IS_NULL($item->getMedia())){
				$media=new Media();
				$filename=$item->getItemUrl();
				
				
				$img=file_get_contents($filename);
				$name=tempnam("images/tmp/","file-");
				file_put_contents($name,$img);
				$img=null; 
				unset($img);
				
				$getID3 = new \getid3_getid3 ();
		
				// Analyze file and store returned data in $ThisFileInfo
				$ThisFileInfo = $getID3->analyze($name);
		
				
				//echo "File Format:".$ThisFileInfo['fileformat']."<br>";
				//echo "File Size:".$ThisFileInfo['filesize']."<br>";
				
				$media->setFileFormat($ThisFileInfo['fileformat']);
				$media->setSize($ThisFileInfo['filesize']);
				
				$item->setMedia($media);
				
				
				// time based Media
				/*
				echo "File Length (seconds):".$ThisFileInfo['playtime_seconds']."<br>";
				echo "Bit Rate:".$ThisFileInfo['bitrate']."<br>";
				*/
				
				//$media->setDuration($ThisFileInfo['video']['playtime_seconds']);
				//$media->setBitRate($ThisFileInfo['video']['bitrate']);
				
				$media->setDuration($ThisFileInfo['playtime_seconds']);
				$media->setBitRate($ThisFileInfo['bitrate']);
				
				//visual Media
				
				//echo "Width: ".$ThisFileInfo['video']['resolution_x']."<br>";
				//echo "Height: ".$ThisFileInfo['video']['resolution_y']."<br>";
				
				$media->setWidth($ThisFileInfo['video']['resolution_x']);
				$media->setHeight($ThisFileInfo['video']['resolution_y']);
				
				//echo '<pre>'.htmlentities(print_r($ThisFileInfo, true)).'</pre>';
				//echo"*************************<br>";
				//echo"*************************<br>";
					
				$i++;
				$em->persist($media);
				$em->persist($item);
				$em->flush();
				$getID3 =null;
				
				unset($getID3);
				unlink($name);
				
				
				
				}
			}
		
	}
	
	
	


}
