<?php
namespace Zeega\DataBundle\Service;

use Symfony\Component\HttpFoundation\Response;

class SolrService
{
    public function __construct($solr) 
    {
        $this->solr = $solr;
    }

    public function search($query, $fields = null) 
    {
        if(null === $query) {
            throw new \BadMethodCallException('The query parameter cannot be null.');
        }

        if(!is_array($query)) {
            throw new \BadMethodCallException('The query parameter has to be an Array.');
        }

        if(!isset($query["limit"])) {
            throw new \BadMethodCallException('The query parameter must include a value for the limit.');
        }

        if(!isset($query["page"])) {
            throw new \BadMethodCallException('The query parameter must include a value for the page.');
        }                
        
        $client = $this->solr;

        $solrQuery = $client->createSelect();
        
        $solrQuery->setRows($query["limit"] * $query["page"]);
        $solrQuery->setStart($query["page"]);

        // sort
        if(isset($query["sort"])) {
            if($query["sort"] == 'date-desc') {
                $solrQuery->addSort('date_created', \Solarium_Query_Select::SORT_DESC);    
            } else if($query["sort"] == 'date-asc') {
                $solrQuery->addSort('date_created', \Solarium_Query_Select::SORT_ASC);       
            } else if($query["sort"] == 'id-desc') {
                $solrQuery->addSort('id', \Solarium_Query_Select::SORT_DESC);
            }
        }

        // text query
        $queryString = '';
        if(isset($query["text"])) {
            $queryString = "text:(".$query["text"].")";
        }        
        
        // tag query
        if(isset($query["tags"])) {
            if($queryString != '') {
                $queryString = $queryString . " AND ";
            }            
            $queryString = $queryString . "tags_i:(".$query["tags"].")";
        }
        
        //echo '<pre>'; print_r($queryString); echo '</pre>';
        if(isset($queryString) && $queryString != '') {
            $solrQuery->setQuery($queryString);
        }
        
        // media type
        if(isset($query["type"])) {
            $solrQuery->createFilterQuery('media_type')->setQuery("media_type:(".$query["type"].")");
        }

        if(isset($query["geo"]) && $query["geo"] == 1) {
            $solrQuery->createFilterQuery('geo')->setQuery("media_geo_longitude:[-180 TO 180] AND media_geo_latitude:[-90 TO 90]");
        }

        // return only the items that belong to a collection
        if(isset($query["collection"])) {    
            $solrQuery->createFilterQuery('parent_id')->setQuery("parent_item:".$query["collection"]);
        }
                                                                                    
        if(isset($query["since"]) && isset($query["before"])) {
            $minDate = new DateTime();
            $minDate->setTimestamp($query["since"]);
            $minDate = $minDate->format('Y-m-d\TH:i:s\Z');
            $maxDate = new DateTime();
            $maxDate->setTimestamp($query["before"]);
            $maxDate = $maxDate->format('Y-m-d\TH:i:s\Z');
            
            $solrQuery->createFilterQuery('media_date_created')->setQuery("media_date_created: [$minDate TO $maxDate]");
        }
                
        if(isset($userId) && $userId == -1) { // filter results for the logged user
            $user = $this->get('security.context')->getToken()->getUser();
            if(null !== $user) {
                $userId = $user->getId();
            }   
        }

        if(isset($userId)) {
            $userId = ResponseHelper::escapeSolrQuery($userId);
            $solrQuery->createFilterQuery('user_id')->setQuery("user_id: $userId");
        }
        
        // return highly ranked tags for the query
        $facetComponent = $solrQuery->getFacetSet();               
        $facetComponent->createFacetField('tags')->setField('tags_i')->setLimit(5)->setMinCount(1);

        // run the query
        $resultset = $client->execute($solrQuery);

        $responseData = $resultset->getData();

        //echo '<pre>'; print_r($responseData["response"]["docs"]); echo '</pre>';

        //echo '<pre>'; echo $resultset->getNumFound(); echo '</pre>';
                
        // get the tags results
        $facets = $resultset->getFacetSet();
        $tags = $facets->getFacet('tags');                   
        $tagsArray = array(); 
  
        foreach ($tags as $tag_name => $tag_count) {
            if($tag_count > 0 && $tag_name != "N;" && $tag_name != 's:0:"";') {
                $tagsArray[$tag_name] = $tag_count;
            }
        }

        return array("items" => $responseData["response"]["docs"], "tags" => $tagsArray, "total_results" => $resultset->getNumFound());
    }
}