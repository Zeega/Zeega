<?php

namespace Zeega\SearchBundle\Controller;

use Zeega\IngestBundle\Entity\Media;
use Zeega\IngestBundle\Entity\Tag;
use Zeega\IngestBundle\Entity\Item;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use DateTime;
class SearchController extends Controller
{
   
  
  
    public function searchAction(){
		$user = $this->get('security.context')->getToken()->getUser();
		$queries=$this->getRequest()->get('query');
		$results=array();
		
		if(is_array($queries) &&sizeof($queries)>0){
		
			foreach($queries as $query){
			
			
				/** CHECK FOR SEARCH PARAMETERS, USE DEFAULTS WHEN NECESSARY */
				
				
				$query['userId']=$user->getId();
				
				if(!isset($query['output']))$query['output']=array();
				else $output=$query['output'];
				if(!isset($query['contentType']))$query['contentType']='all';
				if(!isset($output['type']))$output['type']='time';
				if(!isset($output['resolution']))$output['resolution']=1;
				if(!isset($output['limit']))$output['limit']=null;
				if(!isset($output['offset']))$output['offset']=null;
				
				if($output['type']=='item') $output['resolution']=1;
				
				$query['limit']=$output['limit'];
				$query['offset']=$output['offset'];
				
				
				if(!isset($query['time'])&&$output['type']!='time') $query['time']=NULL;
				else{
					if(!isset($query['time'])) $query['time']=array('earliest'=>-218799493233,'latest'=>218799493233);
					$time=$query['time'];
					$earliest=new DateTime();
					$latest=new DateTime();
					$earliest->setTimestamp($query['time']['earliest']);
					$latest->setTimestamp($query['time']['latest']);
					$query['time']=array('earliest'=>$earliest,'latest'=>$latest);
				}		
				
				if(!isset($query['geo'])&&$output['type']!='geo') $query['geo']=NULL;
				elseif(!isset($query['geo'])) $query['geo']=array('east'=>-10,'north'=>90,'south'=>20,'west'=>-150);
				
				if(!isset($query['tags'])) $query['tags']=null; 
		
		
				/** EXECUTE QUERY 													 */
		
		
				if($output['resolution']<=1){
					
					$items=$this->getDoctrine()
								->getRepository('ZeegaIngestBundle:Item')
								->findItemsGeoTimeDetails($query);
					$results[]=array('items'=>$items,'count'=>sizeof($items));
				}
				elseif($output['type']=='geo'){
					
					$geo=$query['geo'];
					if($output['resolution']==0) $output['resolution']=1;
					$lngInc=($geo['north']-$geo['south'])/$output['resolution'];
					$latInc=($geo['east']-$geo['west'])/$output['resolution'];
					$_geo=array();
					$_results=array();
					
					for($i=0;$i<$output['resolution'];$i++){
						for($j=0;$j<$output['resolution'];$j++){
							$k=($output['resolution']-1-$j)*$output['resolution']+$i;
							$_geo['south']=$geo['south']+$j*$lngInc;
							$_geo['north']=$_geo['south']+$lngInc;
							$_geo['west']=$geo['west']+$i*$latInc;
							$_geo['east']=$_geo['west']+$latInc;
							$query['geo']=$_geo;
							$count=$this->getDoctrine()
									->getRepository('ZeegaIngestBundle:Item')
									->findItemsGeoTime($query);
							if($count>0){
								$mapBin=array('bin'=>$k,'total'=>$count,'geo'=>$_geo,'items'=>array());
								array_push($_results,$mapBin);
							}
						}
					}
					$results[]=$_results;
				  }
				  else if($output['type']=='time'){
						
						if($output['resolution']==0) $output['resolution']=1;
						$increment=((int)$time['latest']-(int)$time['earliest'])/(int)$output['resolution'];
					
						$_time=array();
						$_results=array();
				
						
						
						for($i=0;$i<$output['resolution'];$i++){
								$earliest->setTimestamp($time['earliest']+$i*$increment);
								$latest->setTimestamp($time['earliest']+($i+1)*$increment);
								
								$_time['earliest']=$earliest;
								$_time['latest']=$latest;
								$query['time']=$_time;
								
								$count=$this->getDoctrine()
										->getRepository('ZeegaIngestBundle:Item')
										->findItemsGeoTime($query);
								if($count>0){
									$geoBin=array('earliest'=>$time['earliest']+$i*$increment,'latest'=>$time['earliest']+($i+1)*$increment,'bin'=>$i,'total'=>$count,'geo'=>$query['geo'],'items'=>array());
									$_results[]=$geoBin;
								}
							
						}
						$results[]=$_results;
				 }
				 else if($output['type']=='collection'){
				 	$collections=array();
					$max=0;
					$items=$this->getDoctrine()
											->getRepository('ZeegaIngestBundle:Item')
											->findItemsGeoTimeDetailsObject($query);
											
					foreach($items as $item){
					
						$tags=$item->getParentCollections();
						foreach($tags as $tag){
							if($tag->getContentType()=='Collection'){
								if(!isset($collections[$tag->getId()])){
									$collections[$tag->getId()]=array('id'=>$tag->getId(),'title'=>$tag->getTitle(),'total'=>1);
								}
								else {
									$collections[$tag->getId()]['total']=1+$collections[$tag->getId()]['total'];
									if($max<$collections[$tag->getId()]['total'])$max=$collections[$tag->getId()]['total'];
								}
							}						
						}
					
					}
					
					if(!isset($collections))$results[]=array();
					else{
						$sort_total=array();
						foreach($collections as $c=>$key) { $sort_total[] = $key['total']; }
						array_multisort($sort_total, SORT_DESC, $collections);
						$collections=array_filter($collections,function($collection){if($collection['total']>5) return true; else return false;});
						$results[]=array('max'=>$max, 'collections'=>$collections);
					}
				  
				 }
			}
			if(sizeof($queries)==1) return new Response(json_encode($results[0]));
			else return new Response(json_encode($results));
		}
		else return new Response("Error: Query is not correctly formatted");
	 
    
    }
    
  	//Legacy - to be removed
  	public function  itemsAction($offset=0,$limit=500)
     {
   		
       	return new Response(json_encode($this->getDoctrine()
        		->getRepository('ZeegaIngestBundle:Item')
        		->findItemsWithLimit($offset,$limit)));
    }	

    
}








