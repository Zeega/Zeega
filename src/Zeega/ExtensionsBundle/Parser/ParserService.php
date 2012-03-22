<?php

namespace Zeega\ExtensionsBundle\Parser;

use Zeega\CoreBundle\Parser\Base\ParserCollectionAbstract;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;
use Symfony\Component\Yaml\Parser;
use \ReflectionMethod;

class ParserService
{
	public function load($url)
	{
	    $domainName = self::getDomainFromUrl($url);
	    $config = self::loadConfig($url);
	    
	    if(array_key_exists($domainName, $config["zeega.parsers"]))
	    {
	        $availableParsers = $config["zeega.parsers"][$domainName];
	        
	        foreach ($availableParsers as $parserName => $parserConfig)
    		{
    			if (preg_match($parserConfig["regex"], $url, $matches)) 
    			{
    				if(count($matches) > 1)
    				{
    					$itemId = $matches[1];
    				}
    				else
    				{
    					$itemId = null;
    				}
    				$parserClass = $parserConfig["parser_class"];
    				$isSet = $parserConfig["is_set"];

    				if($isSet)
    				{
    					$parserMethod = new ReflectionMethod($parserClass, 'getInfo'); // reflection is slow, but it's probably ok here
    				}
    				else
    				{
    					$parserMethod = new ReflectionMethod($parserClass, 'getItem');
    				}
    				
    				return $parserMethod->invokeArgs(new $parserClass, array($url,$itemId));
    		    }
    		}
	    }
	}
	
	// ------------------- private methods
	
	private function getDomainFromUrl($url)
	{
	    // get host name - won't work for IP addresses
	    $host = parse_url($url, PHP_URL_HOST);
	    
	    // remove subdomains if existing
	    $hostComponents = explode(".", $host);
	    
	    if(count($hostComponents) > 2)
	    {
	        $hostComponents = array_slice($hostComponents,count($hostComponents)-2,count($hostComponents));
	    }
	    
	    // return the domain name
	    return implode(".",$hostComponents);
	}
	
	private function loadConfig()
	{
	    $yaml = new Parser();
        $path = __DIR__.'/../Resources/config/zeega/Parser.yml';
        return $yaml->parse(file_get_contents($path));
	}
}
