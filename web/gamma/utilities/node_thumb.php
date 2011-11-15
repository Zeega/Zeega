<?

exec('/opt/webcapture/webpage_capture -t 50x50 -crop http://alpha.zeega.org/joseph/web/node.html#'.$_GET['n'].' /var/www/joseph/web/images/nodes',$output);


$url=explode(":/var/www/joseph/web/",$output[4]);
//echo "<img src='../".$url[1]."' />";

//echo 'images/thumb.png';
echo $url[1];
?>