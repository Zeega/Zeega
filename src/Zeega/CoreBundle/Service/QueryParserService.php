<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\CoreBundle\Service;

class QueryParserService
{
    public function parseRequest($request)
    {
        if(null === $request) {
            throw new \BadFunctionCallException('The request parameter cannot be null.');
        }

        $query = array();

        /*  q contains the search query formatted as follows:
         *      - components are separated by ,
         *      - each components can be a combination of AND and OR queries. To do an OR use | and to do an and do .
         *      - the negation operator is -
         *  Example query for images and videos tagged with planettakeout or pt that don't contain the tag pt_map:
         *      - "tags:planettakeout pt -pt_map,type:image OR video -project,published:0,enabled:1";
         */

        foreach($requestComponents as $requestKey => $requestValue) {
            if($requestKey === "q") {
                // get the query components
                $queryStringParameters = explode(",", $requestValue);

                foreach($queryStringParameters as $parameter) {
                    $parameter = explode(":",$parameter);
        
                    if(isset($parameter) && is_array($parameter)) {
                        $parameterName = $parameter[0];
                        $parameterValue = $parameter[1];
                        $parameterValue = self::parseParameterForSolr($parameterValue);

                        $query[$parameterName] = $parameterValue;
                    }
                }
            } else {
                $query[$requestKey] = $requestValue;
            }
        }

        $query = self::setQueryDefaults($query);

        return $query;
    }

    private function parseParameterForSolr($parameterValue)
    {
        if(null === $parameterValue) {
            throw new \BadFunctionCallException('The parameterValue parameter cannot be null.');
        }

        $parameterValue = preg_replace('!\s+!', ' ', $parameterValue);
        $parameterValue = self::escapeSolrQuery($parameterValue);

        return $parameterValue;
    }

    private function setQueryDefaults($query) 
    {
        if(!isset($query["limit"])) {
            $query["limit"] = 100;
        }

        if($query["limit"] > 500) {
            $query["limit"] = 500;
        }

        if(!isset($query["enabled"])) {
            $query["enabled"] = 1;
        }

        return $query;
    }

    private function escapeSolrQuery($query)
    {
        // ref http://e-mats.org/2010/01/escaping-characters-in-a-solr-query-solr-url/
        $match = array('\\', '&', '|', '!', '{', '}', '[', ']', '^', '~', '*', '?', ':', '"', ';');
        $replace = array('\\\\', '\\&', '\\|', '\\!', '\\{', '\\}', '\\[', '\\]', '\\^', '\\~', '\\*', '\\?', '\\:', '\\"', '\\;');
        return str_replace($match, $replace, $query);
    }
}