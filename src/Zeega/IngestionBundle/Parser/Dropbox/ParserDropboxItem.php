<?php

namespace Zeega\IngestionBundle\Parser\Dropbox;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;

class ParserDropboxItem extends ParserAbstract
{
    public function load($mediaUrl, $parameters = null)
    {
        return $this->returnResponse(null, false, false, "Dropbox is currently not supported.");
    }
}
