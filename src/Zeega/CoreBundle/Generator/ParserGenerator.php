<?php

namespace Zeega\CoreBundle\Generator;

use Symfony\Component\Filesystem\Filesystem;

class ParserGenerator extends Generator
{
    public function __construct(Filesystem $filesystem, $skeletonDir)
    {
        $this->filesystem = $filesystem;
        $this->skeletonDir = $skeletonDir;
    }
    
    public function generate($namespace, $class, $service, $dir)
    {
        $this->filesystem->mkdir($dir);
        
        //$basename = substr($name, 0, -6);
        $parameters = array(
            'parserClass' => $class,
            'namespace'    => $namespace,
        );

        $this->render($this->skeletonDir, 'DefaultParser.php', $dir.'/'.$class.'.php', $parameters);
        
        /*
        if ('xml' === $format || 'annotation' === $format) {
            $this->renderFile($this->skeletonDir, 'services.xml', $dir.'/Resources/config/services.xml', $parameters);
        } else {
            $this->renderFile($this->skeletonDir, 'services.'.$format, $dir.'/Resources/config/services.'.$format, $parameters);
        }

        if ('annotation' != $format) {
            $this->renderFile($this->skeletonDir, 'routing.'.$format, $dir.'/Resources/config/routing.'.$format, $parameters);
        }

        if ($structure) {
            $this->filesystem->mkdir($dir.'/Resources/doc');
            $this->filesystem->touch($dir.'/Resources/doc/index.rst');
            $this->filesystem->mkdir($dir.'/Resources/translations');
            $this->filesystem->copy($this->skeletonDir.'/messages.fr.xliff', $dir.'/Resources/translations/messages.fr.xliff');
            $this->filesystem->mkdir($dir.'/Resources/public/css');
            $this->filesystem->mkdir($dir.'/Resources/public/images');
            $this->filesystem->mkdir($dir.'/Resources/public/js');
        }
        */
    }
}
