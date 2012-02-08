<?php

namespace Zeega\IngestBundle\Parser;

/**
 * Abstract data parser
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
	
	protected function returnResponse($object, $success, $message = "")
	{
		return array("success" => $success, "items" => $object, "message" => $message);
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
}

abstract class ParserItemAbstract extends ParserAbstract
{
	
}

abstract class ParserCollectionAbstract extends ParserAbstract
{
}
