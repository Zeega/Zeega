<?php

namespace Zeega\IngestBundle\Parser;

/**
 * Abstract data parser
 *
 */
abstract class ParserAbstract
{
	private $config;
	
	protected function persistItem($item)
	{
		
	}
	
	/**
     * Sets the parser configuration in a dictionary.
     *
     * @param String $key  The config key.
     * @param String $value The config value.
     */
	public function setConfig($key, $value)
	{
		if(!isset($config))
		{
			$config = array();
		}
		$config[$key] = $value;
	}
	
	public function returnResponse($object, $success)
	{
		return array("success" => $success, "items" => $object);
	}
	
	/**
     * Returns the configuration value associated with $key
     *
     * @param String  $key  The config key.
	 * @return String|config
     */
	public function getConfig($key)
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
     * Returns true if the $url is supported by the parser.
     *
     * @param String  $url  The url to be parsed.
	 * @return boolean|supported
     */
	abstract public function isUrlSupported($url);
	
	/**
     * Parses a single item from the $url and adds the associated media to the database.
     *
     * @param String  $url  The url to be checked.
	 * @return boolean|success
     */
	abstract public function parseSingleItem($url);
	
	/**
     * Parses the set of media from the $url and adds the associated media to the database.
     *
     * @param String  $url  The url to be parsed.
	 * @return boolean|success
     */	
	abstract public function parseSet($url);
}
