<?php
namespace Zeega\DataBundle\Service;

use Symfony\Component\HttpFoundation\Response;

class SolrService
{
    public function __construct($solr) 
    {
        $this->solr = $solr;
    }

    public function solr($query) 
    {
    }
}