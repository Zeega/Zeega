<?php

namespace Zeega\UserBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class ZeegaUserBundle extends Bundle
{
	public function getParent()
	{
		return 'FOSUserBundle';
	}
}
