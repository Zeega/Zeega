<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\ApiBundle\Controller;

use Zeega\DataBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Zeega\CoreBundle\Helpers\ResponseHelper;
use Zeega\CoreBundle\Helpers\Utils;
use DateTime;

/**
* The SearchController handles database search requests made through the API.
* 
*
* @author James Burns <james@zeega.org>
* @author Luis Filipe Brandao <filipe@zeega.org>
*/
class SearchController extends Controller
{
    public function searchAction()
    {
		/**
		* Work in progres - both responses need to be optimized 
		* and should be similar but aren't yet.
		*/
		
		$user = $this->get('security.context')->getToken()->getUser();
		$isAdmin = $this->get('security.context')->isGranted('ROLE_ADMIN');
		$isAdmin = (isset($isAdmin) && (strtolower($isAdmin) === "true" || $isAdmin === true)) ? true : false;
    	
    	$request = $this->getRequest();
        $solrEnabled = $this->container->getParameter('solr_enabled');
		$collectionId = $request->query->get('collection');
        $returnCollections   = $request->query->get('r_collections');
        $returnItems = $request->query->get('r_items');   				//  bool
        $source = $request->query->get('data_source');                  //  bool
	
         if($solrEnabled) {
            if(null !== $source && $source === 'db') {
                $useSolr = false;
            } else {
                $useSolr = true;
            }     
        } else {    
            $useSolr = false;
        }

        if(true === $useSolr) {
            if(isset($collectionId) || ((isset($returnCollections) && $returnCollections == 1)))
            {
                // if we want to get the items of a Collection we need to do a hybrid search to get non indexed items from the database
                // send db query to doctrine

                $dbItems = $this->searchWithDoctrine();
                
                $items = array();
                $counts = array();
                
                // get the results from the DB
                if(array_key_exists("items",$dbItems)) 
                {
                    $items["items"] = $dbItems["items"];
                    $counts["count"] = $dbItems["items_count"];
                    $counts["returned_count"] = $dbItems["returned_items_count"];
                }
                if(array_key_exists("collections",$dbItems)) 
                {
                    $items["collections"] = $dbItems["collections"];
                    $counts["count"] = $dbItems["collections_count"];
                    $counts["returned_count"] = $dbItems["returned_collections_count"];
                }
                
                $itemsView = $this->renderView('ZeegaApiBundle:Search:index.json.twig', array('results'=> $items, 'counts' => $counts, 'user'=>$user, 'userIsAdmin'=>$isAdmin));
                return ResponseHelper::compressTwigAndGetJsonResponse($itemsView);
            }
            else
            {
                $dbItems = array();
                $solrItems = $this->searchWithSolr();
            }
                        
            $itemsView = $this->renderView('ZeegaApiBundle:Search:solr.json.twig', array('new_items'=> $dbItems,'results' => $solrItems["items"], 'tags' => $solrItems["tags"], 'user'=>$user, 'userIsAdmin'=>$isAdmin));
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

	    $userId = $request->query->get('user');
		$siteId = $request->query->get('site');
		$collection_id  = $request->query->get('collection');
		$minDateTimestamp = $request->query->get('min_date');
		$maxDateTimestamp = $request->query->get('max_date');
	
		$sort = $request->query->get('sort');        
	   
        $page  = $request->query->get('page');                  //  result page
	    if(!isset($page)) {
            $page = 0;
        }               
	    
        if($page > 0) {
            $page = $page - 1;
        }                   
		
        $limit = $request->query->get('limit');                 //  result limit
        if(!isset($limit) || $limit > 100) {
            $limit = 100;
        }              
		
        $contentType = $request->query->get('content');         //  content-type filter
        if(isset($contentType)) {
            $contentType = ucfirst($contentType);
        }

        $geoLocated = $request->query->get('geo_located');      //  geo-located filter
		if(!isset($geoLocated)) {
			$geoLocated = 0;
		} else {
			$geoLocated = intval($geoLocated);
		}
		
        $tags = $request->query->get('tags');                   //   query and tags
        $q = $request->query->get('q');                        
        
        if(null !== $tags) {
            $tags = str_replace(",", " OR ", $tags);
            // do nothing. 10 points for bad programming
        } else {
            if(preg_match('/tag\:(.*)/', $q, $matches))
            {
                $q = str_replace("tag:".$matches[1], "", $q);
                $tags = str_replace(",", " OR", $matches[1]);
            } 
        }
        
        $client = $this->get("solarium.client");                //   build the solr search query 
				
        $query = $client->createSelect();                       //   set the query limits and page
        $query->setRows($limit);
        $query->setStart($limit * $page);

        if(isset($sort)) {
            if($sort == 'date-desc') {
                $query->addSort('media_date_created', \Solarium_Query_Select::SORT_DESC);    
            } else if($sort == 'date-asc') {
                $query->addSort('media_date_created', \Solarium_Query_Select::SORT_ASC);       
            }
        }

        $queryString = '';        
        if(isset($q) and $q != '') {                           //   escape the text query and add it to the Solr query
        	$q = ResponseHelper::escapeSolrQuery($q);
            $queryString = "text:$q";
        }
        
		
		if($queryString != '') {                               //   add a Published filter to the query
            $queryString = $queryString . " AND ";
        }
        $queryString = $queryString . "enabled:true";

        if(isset($tags) and $tags != '') {                     //   escape the tags query
        	$tags = ResponseHelper::escapeSolrQuery($tags);
            
            if($queryString != '') {
                $queryString = $queryString . " AND ";
            }
            
            $queryString = $queryString . "tags_i:($tags)";    //  add the tags to the Solr query
        }
        
        if(isset($queryString) && $queryString != '')          //  if the query is defined, send it to Solr
        {
            $query->setQuery($queryString);
        }
        
        if(isset($contentType) and $contentType != 'All') {     // filter by content type
            $query->createFilterQuery('media_type')->setQuery("media_type:$contentType");
        }   
            
        if($geoLocated > 0) {                                   // return only geo-located items
            $query->createFilterQuery('geo')->setQuery("media_geo_longitude:[-180 TO 180] AND media_geo_latitude:[-90 TO 90]");
        }

        if(isset($notInId)) {                                   // exclude items by id
            $query->createFilterQuery('not_id')->setQuery("-id:($notInId)");
        }

        if(isset($collection_id)) {                             // return only the items that belong to a collection
            $query->createFilterQuery('parent_id')->setQuery("parent_item:$collection_id");
        }
                                                                                    
        if(isset($minDateTimestamp) && isset($maxDateTimestamp)) {  // filter by time
            $minDate = new DateTime();
            $minDate->setTimestamp($minDateTimestamp);
            $minDate = $minDate->format('Y-m-d\TH:i:s\Z');
            $maxDate = new DateTime();
            $maxDate->setTimestamp($maxDateTimestamp);
            $maxDate = $maxDate->format('Y-m-d\TH:i:s\Z');
            
            $query->createFilterQuery('media_date_created')->setQuery("media_date_created: [$minDate TO $maxDate]");
        }
           	    
		if(isset($userId) && $userId == -1) {                  //  filter results for the logged user
			$user = $this->get('security.context')->getToken()->getUser();
            if(null !== $user) {
                $userId = $user->getId();    
            }			
		}
	
        if(isset($userId)) {
        	$userId = ResponseHelper::escapeSolrQuery($userId);
        	$query->createFilterQuery('user_id')->setQuery("user_id: $userId");
        }
        		
        $groupComponent = $query->getGrouping();               //   set result groups
        $groupComponent->addQuery('-media_type:Collection');   //   items only
        $groupComponent->addQuery('media_type:Collection');    //   collection only
        $groupComponent->addQuery('media_type:*');             //   items and collections
                                    
        $groupComponent->setLimit($limit);                     //   maximum number of items per group
        $groupComponent->setOffset($page * $limit);
        
        $facetComponent = $query->getFacetSet();               //   return highly ranked tags for the query
        $facetComponent->createFacetField('tags')->setField('tags_i')->setLimit(5)->setMinCount(1);

        $resultset = $client->select($query);                  //   run the query

        $groups = $resultset->getGrouping();                   //   get result groups
        $facets = $resultset->getFacetSet();        
                
        $returnItems = $request->query->get('r_items');
        $returnCollections = $request->query->get('r_collections');
        $returnItemsAndCollections = $request->query->get('r_itemswithcollections');

        $results["items"] = array();

        if(isset($returnItems)) {                              
            $results["items"] = $groups->getGroup('-media_type:Collection');  
        } else if(isset($returnCollections)) {
            $results["items"] = $groups->getGroup('media_type:Collection');  
        } else if(isset($returnItemsAndCollections)) {
            $results["items"] = $groups->getGroup('media_type:*');  
        } 

        if(isset($returnCollections) || isset($returnItemsAndCollections)) {

            $results["dynamic_queries_counts"] = array();

            $dynamicQueriesCounts = array();
            
            foreach($results["items"] as $it) {
                $itemFields = $it->getFields();

                if($itemFields["media_type"] == 'Collection' && $itemFields["layer_type"] == 'Dynamic') {
                    $queryString = $itemFields["attributes"];
                    $queryString = implode(",", $queryString);

                    $queryString = str_replace("=", ':(', $queryString);
                    $queryString = str_replace("{", '', $queryString);
                    $queryString = str_replace("}", ')', $queryString);
                    $queryString = str_replace("tags", 'tags_i', $queryString);
                           
                    //var_dump($queryString);
                    
                    $countQuery = $client->createSelect();
                    $countQuery->setQuery($queryString);
                    $resultset = $client->select($countQuery);
                
                    $results["dynamic_queries_counts"][$itemFields["id"]] = $resultset->getNumFound(); 
                }
            }
        }

        $tags = $facets->getFacet('tags');                   //     get the tags results
        $tagsArray = array(); 
  
        foreach ($tags as $tag_name => $tag_count)
        {
        	if($tag_count > 0 && $tag_name != "N;" && $tag_name != 's:0:"";') // temp fix
        	{
        		$tagsArray[$tag_name] = $tag_count;
        	}
        }
        //return var_dump($results);
        return array("items"=>$results,"tags"=>$tagsArray);
    }
    
    private function searchWithDoctrineAndGetResponse()
    {
        return ResponseHelper::getJsonResponse($this->searchWithDoctrine(false,true));
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
        
        //
        $query["sort"] = $request->query->get('sort');
        
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
		if(!isset($query['returnCounts'])) 					$query['returnCounts'] = 1;
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
