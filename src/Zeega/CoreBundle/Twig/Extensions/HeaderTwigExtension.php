<?php

namespace CoreBundle\Twig\Extensions;

use Zeega\DataBundle\Entity\Site;

class Header extends \Twig_Extension
{
    public function getGlobals()
    {
        return array(
            'site' => new Site();
    }
}
