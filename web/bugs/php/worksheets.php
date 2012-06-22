<?php

		require_once 'config.php';
		set_include_path("../gdata/library");
		/**
		 * Zend Framework
		 *
		 * LICENSE
		 *
		 * This source file is subject to the new BSD license that is bundled
		 * with this package in the file LICENSE.txt.
		 * It is also available through the world-wide-web at this URL:
		 * http://framework.zend.com/license/new-bsd
		 * If you did not receive a copy of the license and are unable to
		 * obtain it through the world-wide-web, please send an email
		 * to license@zend.com so we can send you a copy immediately.
		 *
		 * @category   Zend
		 * @package    Zend_Gdata
		 * @subpackage Demos
		 * @copyright  Copyright (c) 2005-2011 Zend Technologies USA Inc. (http://www.zend.com)
		 * @license    http://framework.zend.com/license/new-bsd     New BSD License
		 */
		
		
		require_once 'Zend/Loader.php';
		
		Zend_Loader::loadClass('Zend_Gdata');
		Zend_Loader::loadClass('Zend_Gdata_ClientLogin');
		Zend_Loader::loadClass('Zend_Gdata_Spreadsheets');
		Zend_Loader::loadClass('Zend_Gdata_App_AuthException');
		Zend_Loader::loadClass('Zend_Http_Client');


		try{
			$client = Zend_Gdata_ClientLogin::getHttpClient($email, $password, Zend_Gdata_Spreadsheets::AUTH_SERVICE_NAME);
		}catch (Zend_Gdata_App_AuthException $ae) {
			exit("Error Connecting");
		}



		$spreadsheetService = new Zend_Gdata_Spreadsheets($client);
        $query = new Zend_Gdata_Spreadsheets_DocumentQuery();
		//$query->setSpreadsheetKey($spreadsheetKey);
		//$feed = $spreadsheetService->getWorksheetFeed($query);
		$feed = $spreadsheetService->getSpreadsheetFeed($query);
		
		
		foreach($feed->entries as $entry){
			
			echo $entry->id->text;
			echo "<br>";
			echo $entry->title->text;
		}
		
		
		/*
		
		foreach($feed->entries as $entry){
			$wkshtId = explode('/', $entry->id->text);
			echo $wkshtId[8];
			echo $entry->title->text;
		}
		
			
			
			if(htmlspecialchars ($_GET['period'])=='current'){
				$wkshtIndex=1;
			}
			else{
				$i=0;
				foreach($feed->entries as $entry){
					if($entry->title->text==htmlspecialchars ($_GET['period'])) $wkshtIndex=$i;
					else $i++;
				}
			}
			
			
			
	
			$wkshtId = explode('/', $feed->entries[$wkshtIndex]->id->text);
			$currentId= $wkshtId[8];
			$currentTitle= $feed->entries[$wkshtIndex]->title->text;
			
			
			if(isset($feed->entries[$wkshtIndex+1])){
					$wkshtId = explode('/', $feed->entries[$wkshtIndex+1]->id->text);
					$previousId=$wkshtId[8];
					$previousTitle=$feed->entries[$wkshtIndex+1]->title->text;
			}
			
			if($wkshtIndex!=1&&isset($feed->entries[$wkshtIndex-1])){
					$wkshtId = explode('/', $feed->entries[$wkshtIndex-1]->id->text);
					$nextId=$wkshtId[8];
					$nextId=$feed->entries[$wkshtIndex-1]->title->text;
			}
		
		*/
?>