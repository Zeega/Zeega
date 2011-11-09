<?php


$id=$_GET['id'];


exec('/opt/webcapture/webpage_capture -t 50x50 -crop http://mlhplayground.org/gamma-james/node.html#'.$id.' /var/www/images/nodes',$output);


$url=explode(":/var/www/",$output[4]);
//echo "<img src='../".$url[1]."' />";
print_r($output);
?>