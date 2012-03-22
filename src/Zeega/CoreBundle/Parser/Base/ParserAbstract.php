<?php

namespace Zeega\CoreBundle\Parser\Base;

/**
 * Generic abstract data parser
 *
 */
abstract class ParserAbstract
{
	private $config;
	
	/**
     * Sets the parser configuration in a dictionary.
     *
     * @param String $key  The config key.
     * @param String $value The config value.
     */
	protected function setConfig($key, $value)
	{
		if(!isset($config))
		{
			$config = array();
		}
		$config[$key] = $value;
	}
	
	/**
     * Returns the configuration value associated with $key
     *
     * @param String  $key  The config key.
	 * @return String|config
     */
	protected function getConfig($key)
	{
		if(!isset($config) || !array_key_exists($key, $config))
		{
			throw new OutOfRangeException("Invalid configuration key");
		}
		else
		{
			return $config["key"];
		}
	}

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
		return array("success" => $success, "items" => $object, "is_set" => $isSet, "message" => $message);
	}
}