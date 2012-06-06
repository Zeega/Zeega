<?php

namespace Zeega\ApiBundle\Controller;
use Zeega\DataBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Zeega\CoreBundle\Helpers\ResponseHelper;
use Zeega\CoreBundle\Helpers\Utils;

use DateTime;

class SearchController extends Controller
{
    public function searchAction()
    {
    	$request = $this->getRequest();
		
		$query = $request->query->get('q');
		$returnItems = $request->query->get('r_items');
		$returnCollections = $request->query->get('r_collections');
		$returnItemsWithCollections = $request->query->get('r_itemswithcollections');
        
		/**
		* Work in progres - both responses need to be optimized 
		* and should be similar but aren't yet.
		*/
        $solrEnabled = $this->container->getParameter('solr_enabled');
		
		if($solrEnabled)
		{
		    $newItemsFromDb = $this->searchWithDoctrine();
		    //return new Response(var_dump($newItemsFromDb));
		    $newItemsFromDbId = array();
		    
		    if(count($newItemsFromDb) > 0)
		    {
		        foreach($newItemsFromDb as $newItem)
    		    {
    		        array_push($newItemsFromDbId,$newItem[0]->getId());
    		    }
    		    $newItemsFromDbId = implode(",", $newItemsFromDbId);
		    }
			
			$solrItems = $this->searchWithSolr($newItemsFromDbId);
			
            if(array_key_exists("items",$newItemsFromDb)) 
            {
                $dbItems = $newItemsFromDb["items"];
            }
            else if(array_key_exists("collections",$newItemsFromDb))
            {
                $dbItems = $newItemsFromDb["collections"];
            }
            else if(array_key_exists("items_and_collections",$newItemsFromDb))
            {
                $dbItems = $newItemsFromDb["items_and_collections"];
            }
		    //return new Response(var_dump($dbItems));
            
		    $itemsView = $this->renderView('ZeegaApiBundle:Search:solr.json.twig', array('new_items'=> $dbItems,'results' => $solrItems["items"], 'tags' => $solrItems["tags"]));
		    return ResponseHelper::compressTwigAndGetJsonResponse($itemsView);
		}
		else
        {
			return $this->searchWithDoctrineAndGetResponse();
		}
    }
    
    private function searchWithSolr($notInId = null)
    {	
        $request = $this->getRequest();
        
	    // ----------- api global parameters
		$page  = $request->query->get('page');      //  string
		$limit = $request->query->get('limit');     //  string
	    $q = $request->query->get('q');
	    $userId = $request->query->get('user');                 //  int
		$siteId = $request->query->get('site');                 //  int
		$contentType = $request->query->get('content');         //  string
		$collection_id  = $request->query->get('collection');   //  string
		$minDateTimestamp = $request->query->get('min_date');            //  timestamp
		$maxDateTimestamp = $request->query->get('max_date');            //  timestamp
		$geoLocated = $request->query->get('geo_located'); 
		
	    if(!isset($page))               $page = 0;
		if(!isset($limit))              $limit = 100;
		if($limit > 100)                $limit = 100;
		if(isset($contentType))         $contentType = ucfirst($contentType);
		if(!isset($geoLocated))         
		{
			$geoLocated = 0;
		}
		else
		{
			$geoLocated = intval($geoLocated);
		}
		
		if(preg_match('/tag\:(.*)/', $q, $matches))
		{
		 	$q = str_replace("tag:".$matches[1], "", $q);
		 	$tags = "tag_name:" . str_replace(","," tag_name:",$matches[1]);
		}
		
	    // ----------- build the search query
        $client = $this->get("solarium.client");
		
		// set limits and page
        $query = $client->createSelect();
        $query->setRows($limit);
        $query->setStart($limit * $page);
        
        // check if there is a query string
        if(isset($q) and $q != '')                          $query->setQuery($q);
        if(isset($contentType) and $contentType != 'All')   $query->createFilterQuery('media_type')->setQuery("media_type: $contentType");
        if(isset($tags))                                    $query->createFilterQuery('tags')->setQuery($tags);
        if($geoLocated > 0)									$query->createFilterQuery('geo')->setQuery("media_geo_longitude:[-180 TO 180] AND media_geo_latitude:[-90 TO 90]");
        if(isset($notInId))									$query->createFilterQuery('not_id')->setQuery("-id: $notInId");
        
        if(isset($minDateTimestamp) || isset($maxDateTimestamp))
        {
            if(isset($minDateTimestamp) && isset($maxDateTimestamp))
            {
                $minDate = new DateTime();
                $minDate->setTimestamp($minDateTimestamp);
                $minDate = $minDate->format('Y-m-d\TH:i:s\Z');
                $maxDate = new DateTime();
                $maxDate->setTimestamp($maxDateTimestamp);
                $maxDate = $maxDate->format('Y-m-d\TH:i:s\Z');
                
                $query->createFilterQuery('media_date_created')->setQuery("media_date_created: [$minDate TO $maxDate]");
            }
        }
        
        if(isset($collection_id)) $query->createFilterQuery('parent_id')->setQuery("parent_item: $collection_id");
           
	    //  filter results for the logged user
		if(isset($userId) && $userId == -1) 
		{
			$user = $this->get('security.context')->getToken()->getUser();
			$userId = $user->getId();
		}
	
        if(isset($userId)) $query->createFilterQuery('user_id')->setQuery("user_id: $userId");
		
        $groupComponent = $query->getGrouping();
        $groupComponent->addQuery('-media_type:Collection');
        $groupComponent->addQuery('media_type:Collection');
        $groupComponent->addQuery('media_type:*');
        // maximum number of items per group
        $groupComponent->setLimit($limit);
        
        $facetComponent = $query->getFacetSet();
        $facetComponent->createFacetField('tags')->setField('tags')->setLimit(5)->setMinCount(1);

        // run the query
        $resultset = $client->select($query);

        $groups = $resultset->getGrouping();
        $facets = $resultset->getFacetSet();
        
        $results["items"] = $groups->getGroup('media_type:*');
        $results["collections"] = $groups->getGroup('media_type:Collection');
        //$results["items_and_collections"] = $groups->getGroup('media_type:*');

        $tags = $facets->getFacet('tags');
        $tagsArray = array(); 
  
        foreach ($tags as $tag_name => $tag_count)
        {
        	if($tag_count > 0)
        	{
        		$tagsArray[$tag_name] = $tag_count;
        	}
        }
        
        return array("items"=>$results,"tags"=>$tagsArray);
        // render the results
		//$itemsView = $this->renderView('ZeegaApiBundle:Search:solr.json.twig', array('results' => $results, 'tags' => $tagsArray));
        //return ResponseHelper::compressTwigAndGetJsonResponse($itemsView);
    }
    
    private function searchWithDoctrineAndGetResponse()
    {
        return ResponseHelper::getJsonResponse($this->searchWithDoctrine());
    }
    
	/**
     * Action triggered by a search query through the API. 
     * Should be handled with care - it's by no means optimized to handle large databases and
	 * the database queries generated by Doctrine are not optimal.
	 *
     */
    private function searchWithDoctrine($returnIdsOnly = false, $arrayResults = false)
    {
        $user = $this->get('security.context')->getToken()->getUser();
        if($user == "anon.")
        {
            $em = $this->getDoctrine()->getEntityManager();
            $user = $em->getRepository('ZeegaDataBundle:User')->find(1);
        }
        
	    $request = $this->getRequest();

		$query = array();

		//  api global parameters
		$query["page"]  = $request->query->get('page');      //  string
		$query["limit"] = $request->query->get('limit');     //  string
        		
		//  search specific parameters
		$query["userId"]        = $request->query->get('user');      //  int
		$query["siteId"]  = $request->query->get('site'); //  int
		$query["queryString"]   = $request->query->get('q');         //  string
		$query["contentType"]   = $request->query->get('content');   //  string
		$query["collection_id"]  = $request->query->get('collection');//  string
		$query["tags"]          = $request->query->get('tags');      //  string
		$query["tagsName"]   = $request->query->get('tags_name');      //  string
		$query["dateIntervals"] = $request->query->get('dtintervals');     //  string
		
		// Match tag type searches
		$queryString = $query["queryString"];
		
		if(preg_match('/tag\:(.*)/', $query["queryString"] , $matches))
		{
		 	$query["queryString"] = str_replace("tag:".$matches[1], "", $query["queryString"]);
			$query["tagsName"] = $matches[1];
		}
		
		// convert AND queries to array
		$query["queryString"] = explode(" AND ", $query["queryString"]);
		
		//  read geo params from query
		$query["geo"] = array();
		$query["geo"]["north"] = $request->query->get('geo_n');
		$query["geo"]["south"] = $request->query->get('geo_s');
		$query["geo"]["east"] = $request->query->get('geo_e');
		$query["geo"]["west"] = $request->query->get('geo_w');
		
        $earliestDate = $request->query->get('dtstart');
        $latestDate = $request->query->get('dtend');
        
		//  read date params from query
        if(isset($earliestDate))
        {
            $query["earliestDate"] = new DateTime();
            $query["earliestDate"]->setTimestamp($earliestDate);
        }
        
        if(isset($latestDate))
        {
            $query["latestDate"] = new DateTime();
            $query["latestDate"]->setTimestamp($latestDate);;
        }
    	
		//  check what needs to be returned
		$query["returnMap"]     = $request->query->get('r_map');    				//  bool
		$query["returnTime"]    = $request->query->get('r_time');   				//  bool
		$query["returnItems"]   = $request->query->get('r_items');   				//  bool
		$query["returnCollections"]   = $request->query->get('r_collections');   	//  bool
		$query["returnCollectionsWithItems"] = $request->query->get('r_itemswithcollections'); //  bool
		$query["returnCounts"] = $request->query->get('r_counts'); //  bool

		//  set defaults for missing parameters  
		if(!isset($query['returnCollections']))     		$query['returnCollections'] = 0;		
		if(!isset($query['returnItems']))           		$query['returnItems'] = 0;
		if(!isset($query['returnTime']))           			$query['returnTime'] = 0;
		if(!isset($query['returnMap']))             		$query['returnMap'] = 0;
		if(!isset($query['returnCollectionsWithItems'])) 	$query['returnCollectionsWithItems'] = 0;
		if(!isset($query['returnTags'])) 					$query['returnTags'] = 0;
		if(!isset($query['returnCounts'])) 					$query['returnCounts'] = 0;
		if(!isset($query['page']))                  		$query['page'] = 0;
		if($query['page'] > 0)                  		    $query['page'] = $query['page'] - 1;
		if(!isset($query['limit']))                 		$query['limit'] = 100;
		if($query['limit'] > 100) 	                		$query['limit'] = 100;
	    
	    if( !isset($query["geo"]["north"]) || !isset($query["geo"]["south"]) ||
	        !isset($query["geo"]["east"]) || !isset($query["geo"]["west"]))
	    {
		    $query["geo"] = null;
		}
        
		if(isset($query["contentType"]) && strtoupper($query["contentType"]) == "ALL") 
		{
			$query["contentType"] = null;
	    }
	
	   	if(isset($query["tagsName"]))
	   	{
			$query["tagsName"] = array_map('trim',explode(",",$query["tagsName"] ));
	   	}
	   
	    //  filter results for the logged user
		if(isset($query['userId']) && $query['userId'] == -1) $query['userId'] = $user->getId();
		
		// prepare an array for the results
        $results = array();
		
		$query["arrayResults"] = $arrayResults;
		
		// regular search - return items and/or collections
		if($query['returnCollections'] || $query['returnItems'] || $query['returnCollectionsWithItems'])
		{
			if($query['returnCollectionsWithItems'])
			{
			    if($returnIdsOnly)
                {
                    $queryResults = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->searchItemsId($query);
                }
                else
                {
                    $queryResults = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->searchItems($query);
                } 
    		    
				// return collections mixed with items
				 $results['items_and_collections'] = $queryResults;
				 
				 if($query['returnCounts'])
				 {
	                 $results['items_and_collections_count'] = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->getTotalItemsAndCollections($query);
	                 $results['returned_items_and_collections_count'] = sizeof($queryResults);
	             }
			}
			
			if($query['returnCollections'] || $query['returnItems'])
			{

	            // populate the results object
	            if($query['returnItems'] == 1)
	            {
	                $query["notContentType"] = 'Collection';
	                if($returnIdsOnly)
	                {
	                    $items = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->searchItemsId($query);
	                }
	                else
	                {
	                    $items = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->searchItems($query);
	                }
   			     
	                $results['items'] = $items;
					
   				    if($query['returnCounts'])
   				    {
	                    $results['items_count'] = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->getTotalItems($query);
	                    $results['returned_items_count'] = sizeof($items);
	                }
	            }

	            if($query['returnCollections'] == 1)
	            {
	                $query["notContentType"] = null;
	                $query["contentType"] = 'Collection';
	                
	                if($returnIdsOnly)
	                {
	                    $collections = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->searchItemsId($query);
	                }
	                else
	                {
	                    $collections = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->searchItems($query);
	                }
   			     
	                $results['collections'] = $collections;
					
					if($query['returnCounts'])
					{
	                    $results['collections_count'] = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->getTotalCollections($query);
	                    $results['returned_collections_count'] = sizeof($collections);
	                }
           	    }
			}
	    }
		
		if($query['returnTime'])
		{
		    $queryResults = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->searchItemsByTimeDistribution($query);
		    $results['time_distribution'] = $queryResults["results"];
		    $results['time_distribution_info'] = array("min_date" => $queryResults["min_date"], 
													   "max_date" => $queryResults["max_date"], "time_intervals" => sizeof($queryResults["results"]));
	    }
	
		if($query['returnTags'])
		{
		    $queryResults = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->getQueryTags($query);
		    $results['tags'] = $queryResults;
	    }

        // return the results
        return $results;
    }
    
    	/**
     * Action triggered by a search query through the API. 
     * Should be handled with care - it's by no means optimized to handle large databases and
	 * the database queries generated by Doctrine are not optimal.
	 *
     */
    private function searchItemsWithDoctrine()
    {
        $user = $this->get('security.context')->getToken()->getUser();
	    $request = $this->getRequest();
	    $userId = $request->query->get('user');      //  int
		$siteId = $request->query->get('site'); //  int

		$returnItems = $request->query->get('r_items');
		$returnCollections = $request->query->get('r_collections');
		
		if(isset($userId) && $userId == -1 && $this->container->get('security.context')->isGranted('IS_AUTHENTICATED_FULLY'))
		{
			$userId = $user->getId();
		}
		$results = array();
		
		if($returnCollections)
		{
			if(isset($userId) && $userId != -1)
		    	$collections = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findCollections($userId,$siteId,100,0);
		    else
				$collections = array();		    		

		    $results['collections'] = $collections;
		}
		
		if($returnItems)
		{
	    	$items = $this->getDoctrine()->getRepository('ZeegaDataBundle:Item')->findUserItems($userId,$siteId,100,0);
	    	$results['items'] = $items;
		}
		$response = ResponseHelper::getJsonResponse($results);
        
        // return the results
        return $response;
    }
}
