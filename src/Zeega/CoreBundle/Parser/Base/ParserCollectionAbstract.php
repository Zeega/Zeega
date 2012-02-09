<?php

namespace Zeega\IngestBundle\Parser\Base;

/**
 * Collections abstract data parser
 *
 */
abstract class ParserCollectionAbstract extends ParserAbstract
{
	/**
     * Returns the description of the collection associated with the $url and $collection parameters. 
	 *
     * @param String  $url  The collection url.
	 * @param String  $collectionId  The collection id extracted from the url.
	 * @return Array|result
     */
	abstract public function getInfo($url, $collectionId);

	/**
     * Returns the items of the collection associated with the $url and $collection parameters. 
	 *
     * @param String  $url  The collection url.
	 * @param String  $collectionId  The collection id extracted from the url.
     * @param Item  $collectionObj  The collection object to be populated with its items.
	 * @return Array|result
     */
	abstract public function getCollection($url, $collectionId, $collectionObj);
}
