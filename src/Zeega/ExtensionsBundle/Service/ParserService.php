<?php

namespace Zeega\ExtensionsBundle\Service;

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
     * Parses a url and returns a Zeega item if the url is valid and supported.
     *
     * @param String  $url  Url to be parsed
     * @param Boolean  $loadChildItems  If true the child item of the item will be loaded. Should be used for large collections if only the collection description is wanted.
	 * @return Array|response
     */
	public function load($url, $loadChildItems = false, $userId = -1)
	{
	    $domainName = self::getDomainFromUrl($url);                                                           // get the domain name from the url
        $config = self::loadConfig($url);                                                                     // load the configfile from Resources/config/zeega/Parser.yml
	    	    
	    if(array_key_exists($domainName, $config["zeega.parsers"])) {                                         // check if this domain is supported and exists on the config file	        
	        $availableParsers = $config["zeega.parsers"][$domainName];                                        // the domain is supported - load the parsers and check if there is a parser defined this url
	        
	        foreach ($availableParsers as $parserName => $parserConfig) {                                     // loop over all domain parsers
    			if (preg_match($parserConfig["regex"], $url, $matches)) {                                     
                    $em = $this->doctrine->getEntityManager();                                                
                        			    
    			    if(isset($parserConfig["parameters"]) && count($parserConfig["parameters"]) > 0) {        // we have a match - let's check if there are extra parameters defined in the config file
    			        $parameters = $parserConfig["parameters"];
    			    } else {
    			        $parameters = array();
    			    }
    				
                    if($userId != -1) {                                                                       // load the user if a user id was provided
                        $user = $em->getRepository('ZeegaDataBundle:User')->findOneById($userId);             
                    } else {
                        $user = $this->securityContext->getToken()->getUser();    
                    }
                                                                                                              // TO-DO: check for null user
    				$parameters["regex_matches"] = $matches;                                                  // add the regex matches from above to the parameters array
    				$parameters["load_child_items"] = $loadChildItems;                                        // load a single item vs load all them (initial display vs ingestion)
    				$parameters["user"] = $user;                                                              // add the user to the parameters to avoid injecting it in all the parsers
    				$parameters["entityManager"] = $em;                                                       // add the em to the parameters to avoid injecting it in all the parsers

    				$parserClass = $parserConfig["parser_class"];                                             // get the parser class name
                    $parserMethod = new ReflectionMethod($parserClass, 'load');                               // instantiate the parser class using reflection

    				return $parserMethod->invokeArgs(new $parserClass, array($url,$parameters));              // invoke the parser load method
    		    }
    		}
	    }

		$parameters = array();
	    $parameters["hostname"] = $this->hostname;
		$parameters["directory"] = $this->directory;
	    $parser = new ParserAbsoluteUrl;

        return $parser->load($url,$parameters);
	}
	
	private function getDomainFromUrl($url)
	{	                                                                                                           
	    $host = parse_url($url, PHP_URL_HOST);	    	                                                       // get host name - won't work for IP addresses    
	    $hostComponents = explode(".", $host);                                                                 // remove subdomains if existing
	    
	    if(count($hostComponents) > 2) {
	        $hostComponents = array_slice($hostComponents,count($hostComponents)-2,count($hostComponents));
	    }
	    	    
	    return implode(".",$hostComponents);                                                                   // return the domain name
	}
	
	private function loadConfig()
	{
	    $yaml = new Parser();
        $path = __DIR__.'/../Resources/config/zeega/Parser.yml';
        return $yaml->parse(file_get_contents($path));
	}
}
