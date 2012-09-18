<?php

namespace Zeega\CoreBundle\Parser\Base;

/**
 * Generic abstract data parser
 *
 */
abstract class ParserAbstract
{
	/**
     * Normalizes the parser response
     *
     * @param String  $object  Item or collection
     * @param Boolean  $success  Result status
	 * @param String  $message  Parser message
	 * @return Array|response
     */
	protected function returnResponse($object, $success, $isSet, $message = "")
	{
        if(null !== $object && !is_array($object)) {
            $object = array($object);
        }

		return array("items" => $object, "details" => array("is_set" => $isSet, "message" => $message, "success" => $success));
	}
	
	/**
     * Returns the item associated with the $url and $itemId parameters. 
	 *
     * @param String  $url  The item url.
	 * @param Array  $parameters  Configuration parameters.
	 * @return Array|result
     */
	abstract public function load($url, $parameters = null);
	
}