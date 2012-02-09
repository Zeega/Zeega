<?php

namespace Zeega\IngestBundle\Parser\Base;

/**
 * Item abstract data parser
 *
 */
abstract class ParserItemAbstract extends ParserAbstract
{
	/**
     * Returns the item associated with the $url and $itemId parameters. 
	 *
     * @param String  $url  The item url.
	 * @param String  $itemId  The item id extracted from the url.
	 * @return Array|result
     */
	abstract public function getItem($url,$itemId);
}