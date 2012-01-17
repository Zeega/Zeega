<?php

namespace Zeega\IngestBundle\Parser;

/**
 * Dumps assets to the filesystem.
 *
 * @author Kris Wallsmith <kris@symfony.com>
 */
abstract class ParserAbstract
{
	private $config;
	
	/**
     * Sets the parser configuration in a dictionary.
     *
     * @param String  $key  The config key.
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
			throw new OutOfRangeException("Invalid configuration key")
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
	abstract protected function isUrlSupported($url);
	
	/**
     * Parses a single item from the $url and adds the associated media to the database.
     *
     * @param String  $url  The url to be checked.
	 * @return boolean|success
     */
	abstract protected function parseSingle($url);
	
	/**
     * Parses the set of media from the $url and adds the associated media to the database.
     *
     * @param String  $url  The url to be parsed.
	 * @return boolean|success
     */	
	abstract protected function parseSet($url);
}
