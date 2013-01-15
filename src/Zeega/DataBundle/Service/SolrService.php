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
        
        $solrQuery->setStart($query["limit"] * $query["page"])->setRows($query["limit"]);

        if(isset($query["fields"])) {
            $solrQuery->setFields($query["fields"]);
        }

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

        $queryString = '';
        if(isset($query["enabled"])) {
            $queryString = self::appendQueryToQueryString($queryString, "enabled:".$query["enabled"]);
        }

        if(isset($query["id"])) {
            $queryString = self::appendQueryToQueryString($queryString, "id:".$query["id"]);
        }

        if(isset($query["published"])) {
            $queryString = self::appendQueryToQueryString($queryString, "published:".$query["published"]);
        } 

        if(isset($query["text"])) {
            $queryString = self::appendQueryToQueryString($queryString, "text_search:(".$query["text"].")");
        }        
        
        // tag query
        if(isset($query["tags"])) {
            $queryString = self::appendQueryToQueryString($queryString, "tags:(".$query["tags"].")");
        }

        // return only the items that belong to a collection
        if(isset($query["collection"])) {    
            $queryString = self::appendQueryToQueryString($queryString, "parent_item:".$query["collection"]);
        }

        $mediaDateCreatedQuery = self::createDateIntervalQuery("media_after", "media_before", "media_date_created", $query);
        $queryString = self::appendQueryToQueryString($queryString, $mediaDateCreatedQuery);

        $dateCreatedQuery = self::createDateIntervalQuery("after", "before", "date_created", $query);
        $queryString = self::appendQueryToQueryString($queryString, $dateCreatedQuery);
        
        if(isset($queryString) && $queryString != '') {
            $solrQuery->setQuery($queryString);
        }
        
        // media type
        if(isset($query["type"])) {
            $solrQuery->createFilterQuery('media_type')->setQuery("media_type:(".$query["type"].")");
        }

        if(isset($query["geo_located"]) && $query["geo_located"] == 1) {
            $solrQuery->createFilterQuery('geo')->setQuery("media_geo_longitude:[-180 TO 180] AND media_geo_latitude:[-90 TO 90]");
        }

        if(isset($query["user"])) {
            $solrQuery->createFilterQuery('user_id')->setQuery("user_id:".$query["user"]);
        }
        
        // return highly ranked tags for the query
        $facetComponent = $solrQuery->getFacetSet();               
        $facetComponent->createFacetField('tags')->setField('tags')->setLimit(5)->setMinCount(1);

        // run the query
        $resultset = $client->execute($solrQuery);

        $responseData = $resultset->getData();
                
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

    private function appendQueryToQueryString($queryString, $query) {
        
        if(!isset($queryString) || $queryString == '') {
            return $query;
        } else if(!isset($query) || $query == '') {
            return $queryString;
        } else {
            return "$queryString AND $query";
        }  
    }

    private function createDateIntervalQuery($minValueElemName, $maxValueElemName, $fieldName, $query) {
        $minDate = isset($query[$minValueElemName]) ? $query[$minValueElemName] : null;
        $maxDate = isset($query[$maxValueElemName]) ? $query[$maxValueElemName] : null;

        if (isset($minDate) ) {
            $minDateTime = new \DateTime();
            $minDateTime->setTimestamp($minDate);
            $minDate = $minDateTime;
            $minDate = $minDate->format('Y-m-d\TH:i:s\Z');
        }

        if (isset($maxDate) ) {
            $maxDateTime = new \DateTime();
            $maxDateTime->setTimestamp($maxDate);
            $maxDate = $maxDateTime;
            $maxDate = $maxDate->format('Y-m-d\TH:i:s\Z');
        }
 
        if ( isset($minDate) && isset($maxDate) ) {
            return "$fieldName:[$minDate TO $maxDate]";
        } else if (isset($minDate) ) {
            return "$fieldName:[$minDate TO *]";
        } else if (isset($maxDate) ) {
            return "$fieldName:[* TO $maxDate]";
        }

        return null;
    }
}
