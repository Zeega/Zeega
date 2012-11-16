<?php
namespace Zeega\DataBundle\Service;

use Symfony\Component\HttpFoundation\Response;

class SolrService
{
    public function __construct($solr) 
    {
        $this->solr = $solr;
    }

    public function search($query) 
    {
        if(null === $query) {
            throw new \BadMethodCallException('The query parameter cannot be null.');
        }

        if(!is_array($query)) {
            throw new \BadMethodCallException('The query parameter has to be an Array.');
        }        

        
    }

    private function searchWithSolr($notInId = null)
    {   
        $request = $this->getRequest();

        $userId = $request->query->get('user');
        $collection_id  = $request->query->get('collection');
        $minDateTimestamp = $request->query->get('min_date');
        $maxDateTimestamp = $request->query->get('max_date');
    
        $sort = $request->query->get('sort');        
       
        
        $limit = $request->query->get('limit');                 //  result limit
        if(!isset($limit)) {
            $limit = 100;
        }

        if($limit > 500) {
            $limit = 500;
        }              
        
        $contentType = $request->query->get('content');         //  content-type filter
        if(isset($contentType) && $contentType != "project") {
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
            if (strpos($tags,',') !== false) {   // legacy
                $tags = str_replace(",", " OR ", $tags);
            }
        } else {
            if(preg_match('/tag\:(.*)/', $q, $matches)) // legacy
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
                $query->addSort('date_created', \Solarium_Query_Select::SORT_DESC);    
            } else if($sort == 'date-asc') {
                $query->addSort('date_created', \Solarium_Query_Select::SORT_ASC);       
            } else if($sort == 'id-desc') {
                $query->addSort('id', \Solarium_Query_Select::SORT_DESC);
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

        $notContentType = $request->query->get('exclude_content');
        if(isset($notContentType)) {
            if(is_array($notContentType)) {
                $mediaTypesToExclude = $notContentType;
                
                foreach($mediaTypesToExclude as $mediaType) {
                    if("project" !== $mediaType) {
                        $mediaType = ucfirst($mediaType);
                    }
                    $query->createFilterQuery("exclude_media_type_$mediaType")->setQuery("-media_type:$mediaType");
                }
            } else {
                $mediaType = $notContentType;
                if("project" !== $mediaType) {
                    $mediaType = ucfirst($mediaType);
                }
                $query->createFilterQuery("exclude_media_type_$mediaType")->setQuery("-media_type:$mediaType");
            }
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

        $r_counts = $request->query->get('r_counts');

        if(isset($r_counts) && $r_counts == 1 && (isset($returnCollections) || isset($returnItemsAndCollections))) {

            $results["dynamic_queries_counts"] = array();

            $dynamicQueriesCounts = array();
            
            foreach($results["items"] as $it) {
                $itemFields = $it->getFields();

                if($itemFields["media_type"] == 'Collection' && $itemFields["layer_type"] == 'Dynamic') {
                    $itemAttributes = $itemFields["attributes"];

                    if(null !== $itemAttributes && is_array($itemAttributes) && count($itemAttributes) == 1) {
                        $itemAttributes = unserialize($itemAttributes[0]);

                        $queryString = array();

                        if(isset($itemAttributes["tags"])) {
                            $queryString["tags"] = $itemAttributes["tags"];
                        }

                        $queryString = implode(",", $queryString);

                        $queryString = str_replace("=", ':(', $queryString);
                        $queryString = str_replace("{", '', $queryString);
                        $queryString = str_replace("}", ')', $queryString);
                        $queryString = str_replace("tags", 'tags_i', $queryString);
                        $queryString = str_replace(",", " OR", $queryString);
           
                        //var_dump($queryString);
                        
                        $countQuery = $client->createSelect();
                        $countQuery->setQuery($queryString);
                        $resultset = $client->select($countQuery);
                    
                        $results["dynamic_queries_counts"][$itemFields["id"]] = $resultset->getNumFound(); 
                    }
                    
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
}