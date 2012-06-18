<?php

namespace Zeega\ExtensionsBundle\Parser\Dropbox;

use Zeega\CoreBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Entity\Item;
//use Dropbox;

use \DateTime;
//require_once('../vendor/dropbox/bootstrap.php');

class ParserDropboxSet extends ParserAbstract
{
	private static $license=array('','Attribution-NonCommercial-ShareAlike Creative Commons','Attribution-NonCommercial Creative 		
			Commons','Attribution-NonCommercial-NoDerivs Creative Commons','Attribution Creative Commons',
			'Attribution-ShareAlike Creative Commons','Attribution-NoDerivs Creative Commons','No known copyright restrictions');
	
	private $itemParser;
	
	function __construct() 
	{
		error_log("ParserDropboxSet construct", 0);
		$this->itemParser = new ParserDropboxItem();
	}
	
	public function load($url, $parameters = null)
    {
		
		error_log("ParserDropboxSet load 0", 0);

		require_once('../vendor/dropbox/bootstrap.php');
		//require_once('bootstrap.php');

		$accountInfo = $dropbox->accountInfo();
		$dropboxUser = $accountInfo["body"]->display_name;
		$metaData = $dropbox->metaData('/');
		$fileArray = $metaData["body"]->contents;

        //$loadCollectionItems = $parameters["load_child_items"];
        //$regexMatches = $parameters["regex_matches"];
	    
		$collection = new Item();
		$collection->setTitle("Dropbox");
		$collection->setDescription("test collection for Dropbox");
		$collection->setMediaType('Collection');
	    $collection->setLayerType('Dropbox');
		$collection->setAttributionUri($url);
        $collection->setChildItemsCount(count($fileArray));
		$collection->setMediaCreatorUsername($dropboxUser);
        $collection->setMediaCreatorRealname($dropboxUser);
		$collection->setMediaDateCreated(new \DateTime());
		
		$collection->setUri($url);
		
		foreach ($fileArray as $fileData){
			$filename = $fileData->path;
			$mediaData = $dropbox->shares($filename);
			$mediaUrl = $mediaData["body"]->url;

			$item = $this->itemParser->load($mediaUrl, array("dropbox" => $dropbox, "filename" => $filename, "fileData" => $fileData, "username" => $dropboxUser));
			$collection->addItem($item["items"]);
		}
		error_log("ParserDropboxSet end", 0);
		return parent::returnResponse($collection, true, true);
	}
}
