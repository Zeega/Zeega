<?





exec('/opt/webcapture/webpage_capture -t 50x50 -crop http://alpha.zeega.org/Symfony/web/node.html#'.$_GET['n'].' /var/www/Symfony/web/images/nodes',$output);


$url=explode(":/var/www/Symfony/web/",$output[4]);
//echo "<img src='../".$url[1]."' />";

//echo 'images/thumb.png';
echo $url[1];
?>