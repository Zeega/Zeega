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

	private $dropboxUserName = "";
	//private $ItemCount =  0;
	
	function __construct() 
	{
		$this->itemParser = new ParserDropboxItem();
	}

	public function prepThumbFolder($dropbox)
	{
    	$folderMetaData = $dropbox->metaData("/");
    	$folderItems = $folderMetaData["body"]->contents;
    	$found = 0;
		foreach ($folderItems as $folderItem){
			$filename = $folderItem->path;
			if($filename == "/__thumbnails__"){
				$found = 1;
			}
		}
		if($found == 1){
			$delete_response = $dropbox->delete("/__thumbnails__");
		}
		$dropbox->create("/__thumbnails__");
	}


	public function loadFolder($path, $dropbox, $collection, $dropboxUser, $itemCount)
    {
    	$folderMetaData = $dropbox->metaData($path);
    	$folderItems = $folderMetaData["body"]->contents;
		foreach ($folderItems as $folderItem){
			if($folderItem->is_dir){ // if this path is a directory
				if($folderItem->path == "__thumbnails__"){ // and it's not the thumbnails directory
					continue;
				}
				$this->loadFolder($folderItem->path, $dropbox, $collection, $dropboxUser, $itemCount); // recurse function
				continue;
			}else{
				$filename = $folderItem->path;
				$mediaData = $dropbox->shares($filename);
				$mediaUrl = $mediaData["body"]->url;
				$item = $this->itemParser->load($mediaUrl, array("dropbox" => $dropbox, "filename" => $filename, "fileData" => $folderItem, "username" => $dropboxUser));
				$collection->addItem($item["items"]);
				$itemCount++;
				$collection->setChildItemsCount($itemCount);
			}
		}
		return $itemCount;
    }

	public function load($url, $parameters = null)
    {
		require_once('../vendor/dropbox/bootstrap.php');
		$accountInfo = $dropbox->accountInfo();
		$dropboxUser = $accountInfo["body"]->display_name;
		$collection = new Item();
		$collection->setTitle("Dropbox");
		$collection->setDescription("test collection for Dropbox");
		$collection->setMediaType('Collection');
	    $collection->setLayerType('Dropbox');
		$collection->setAttributionUri($url);
		$collection->setMediaCreatorUsername($dropboxUser);
        $collection->setMediaCreatorRealname($dropboxUser);
		$collection->setMediaDateCreated(new \DateTime());
		$collection->setUri($url);

		$itemCount = 0;

		$this->prepThumbFolder($dropbox);
		$this->loadFolder('/', $dropbox, $collection, $dropboxUser, $itemCount);
		return parent::returnResponse($collection, true, true);
	}
}
