<?php

	require_once 'php/config.php';
	set_include_path("gdata/library");
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
	$post_data = file_get_contents("php://input");
  	$post_data = json_decode($post_data,true);	
	
	$defaults=array(

				'email' =>'none provided',
				'date'=>date('j F Y h:i:s A'),
	);    
	$bug=array_merge($defaults,$post_data);
	$insertedListEntry = $spreadsheetService->insertRow($bug, $spreadsheetKey, $worksheetId);
	echo json_encode($bug);


?>