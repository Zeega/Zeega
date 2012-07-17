<?php

namespace Zeega\ExtensionsBundle\Parser;

use Zeega\ExtensionsBundle\Parser\AbsoluteUrl\ParserAbsoluteUrl;
use Zeega\DataBundle\Entity\Site;
use Zeega\DataBundle\Entity\User;
use Zeega\DataBundle\Entity\Tag;
use Zeega\DataBundle\Entity\Item;
use Symfony\Component\Yaml\Parser;
use \ReflectionMethod;

/**
 * Data parser service to add media to Zeega
 *
 */
class ParserService
{
	public function __construct($hostname, $directory, $securityContext, $doctrine)
    {
        $this->hostname = $hostname;
        $this->directory = $directory;
		$this->securityContext = $securityContext;
		$this->doctrine = $doctrine;
    }

    
    /**
     * Parses a url and creates a Zeega item if the url is valid and supported.
     *
     * @param String  $url  Url to be parsed
     * @param Boolean  $loadChildItems  If true the child item of the item will be loaded. Should be used for large collections if only the collection description is wanted.
	 * @return Array|response
     */
	public function load($url, $loadChildItems = false)
	{
	    $domainName = self::getDomainFromUrl($url);
	    $config = self::loadConfig($url);
	    
	    // check if this domain is supported
	    if(array_key_exists($domainName, $config["zeega.parsers"]))
	    {
	        // the domain is supported - load the parsers and check if there is a parser defined for $url
	        $availableParsers = $config["zeega.parsers"][$domainName];
	        
	        foreach ($availableParsers as $parserName => $parserConfig)
    		{
    			if (preg_match($parserConfig["regex"], $url, $matches)) 
    			{
    			    // we have a match - let's check if there are extra parameters defined in the config file
    			    if(isset($parserConfig["parameters"]) && count($parserConfig["parameters"]) > 0)
    			    {
    			        $parameters = $parserConfig["parameters"];
    			    }
    			    else
    			    {
    			        $parameters = array();
    			    }
    				
    				// add the regex matches to the parameters
    				$user = $this->securityContext->getToken()->getUser();
	        		$em=$this->doctrine->getEntityManager();
    				$userTable = $em->getRepository('ZeegaDataBundle:User')->findOneById($user->getId());

    				$parameters["regex_matches"] = $matches;
    				$parameters["load_child_items"] = $loadChildItems;
    				$parameters["user"] = $user;
    				$parameters["userTable"] = $userTable;
    				$parameters["entityManager"] = $em;

    				$parserClass = $parserConfig["parser_class"];

    				// use reflection to get the parser class
                    $parserMethod = new ReflectionMethod($parserClass, 'load'); // reflection is slow, but it's probably ok here
                    // call the load method
    				return $parserMethod->invokeArgs(new $parserClass, array($url,$parameters));
    		    }
    		}
	    }
		$parameters = array();
	    $parameters["hostname"] = $this->hostname;
		$parameters["directory"] = $this->directory;
	    $parser = new ParserAbsoluteUrl;
        return $parser->load($url,$parameters);
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
