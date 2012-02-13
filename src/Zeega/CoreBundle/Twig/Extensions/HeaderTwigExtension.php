<?php

namespace Zeega\CoreBundle\Twig\Extensions;

use Zeega\DataBundle\Entity\Site;
use Symfony\Bundle\DoctrineBundle\Registry;

class HeaderTwigExtension extends \Twig_Extension
{
	protected $doctrine;

	public function __construct(Registry $doctrine)
	{
        $this->doctrine = $doctrine;
    }

    public function getGlobals()
    {
        return array(
            'site' => new Site());
    }

	public function getName()
	{
		return 'zeega-header';
	}
}
