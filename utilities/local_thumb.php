<?php


$id=$_GET['id'];
$hostname = $_SERVER['HTTP_HOST']

if(isset($_GET['instance'])){

exec('/opt/webcapture/webpage_capture -t 50x50 -crop ' . $hostname . '/web/gamma/node.html#'.$id.' /var/www/images/nodes',$output);

}
else{

exec('/opt/webcapture/webpage_capture -t 50x50 -crop ' . $hostname . '/web/gamma/node.html#'.$id.' /var/www/images/nodes',$output);
}

$url=explode(":/var/www/",$output[4]);
//echo "<img src='../".$url[1]."' />";
echo 'http://alpha1.zeega.org/'.$url[1];
//print_r($output);
?>