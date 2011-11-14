<?php
require('helpers.php');

$id=$_GET['id'];
$web_folder_uri = getWebDirectoryURI();

exec('/opt/webcapture/webpage_capture -t 50x50 -crop ' . $web_folder_uri . '/gamma/node.html#'.$id.' /var/www/images/nodes',$output);

$url=explode(":/var/www/",$output[4]);
echo $images_uri . $url[1];

?>