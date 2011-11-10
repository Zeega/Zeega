<?

	exec('/opt/webcapture/webpage_capture -t 50x50 -crop '. $_SERVER['HTTP_HOST'] . '/web/gamma/node.html#'.$_GET['n'].' /var/www/images/nodes',$output);

	$url = explode(":/var/www/web/",$output[4]);
	//echo "<img src='../".$url[1]."' />";

	//echo 'images/thumb.png';
	echo $url[1];
?>