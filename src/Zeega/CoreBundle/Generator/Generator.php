<?php

namespace Zeega\CoreBundle\Generator;

class Generator
{
    protected function render($templatesDir, $template, $target, $parameters)
    {
        $twig = new \Twig_Environment(new \Twig_Loader_Filesystem($templatesDir), array(
            'debug'            => true,
            'cache'            => false,
            'strict_variables' => true,
            'autoescape'       => false,
        ));

        file_put_contents($target, $twig->render($template, $parameters));
    }
}
