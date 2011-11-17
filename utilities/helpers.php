<?php
function getHost() 
{
    return $_SERVER['HTTP_HOST'];
}

function getRequestURI() {
  //Since $_SERVER['REQUEST_URI'] is only available on Apache, we generate an equivalent using other environment variables.
  if (isset($_SERVER['REQUEST_URI'])) 
  {
      $uri = $_SERVER['REQUEST_URI'];
  }
  else 
  {
      if (isset($_SERVER['argv'])) 
      {
          $uri = $_SERVER['SCRIPT_NAME'] . '?' . $_SERVER['argv'][0];
      }
      elseif (isset($_SERVER['QUERY_STRING'])) 
      {
          $uri = $_SERVER['SCRIPT_NAME'] . '?' . $_SERVER['QUERY_STRING'];
      }
      else 
      {
          $uri = $_SERVER['SCRIPT_NAME'];
      }
  }
  // Prevent multiple slashes to avoid cross site requests via the FAPI.
  $uri = '/' . ltrim($uri, '/');
  return $uri;
}

function getWebDirectoryURI()
{
    $path = getHost();
    $uri = getRequestURI();
    $pos = strrpos($uri, "/web/");
    if ($pos === false) 
    {
        $pos = strrpos($uri, "/utilities/");
        if ($pos === false) 
        {
            return $path . $uri;
        }
        else 
        {
            return $path . substr($uri, 0, $pos) . '/web';
        }
    }
    else
    {
        return $path . substr($uri, 0, $pos + 4);
    }
}

?>