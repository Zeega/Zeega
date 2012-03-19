<?php

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;

class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = array(
            new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
            new Symfony\Bundle\SecurityBundle\SecurityBundle(),
            new Symfony\Bundle\TwigBundle\TwigBundle(),
            new Symfony\Bundle\MonologBundle\MonologBundle(),
            new Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle(),
            new Symfony\Bundle\DoctrineBundle\DoctrineBundle(),
            new Symfony\Bundle\AsseticBundle\AsseticBundle(),
            new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),
            new JMS\SecurityExtraBundle\JMSSecurityExtraBundle(),
            new JMS\SerializerBundle\JMSSerializerBundle($this),
            new Zeega\UserBundle\ZeegaUserBundle(),
            new FOS\RestBundle\FOSRestBundle(),
            new Zeega\ApiBundle\ZeegaApiBundle(),
			new FOS\UserBundle\FOSUserBundle(),
			new Sonata\AdminBundle\SonataAdminBundle(),
		    new Sonata\jQueryBundle\SonatajQueryBundle(),
		    new Knp\Bundle\MenuBundle\KnpMenuBundle(),
		    new Sonata\DoctrineORMAdminBundle\SonataDoctrineORMAdminBundle(),
            new Zeega\AdminBundle\ZeegaAdminBundle(),
            new Zeega\CoreBundle\ZeegaCoreBundle(),
            new Zeega\DataBundle\ZeegaDataBundle(),
			new Symfony\Bundle\DoctrineMigrationsBundle\DoctrineMigrationsBundle(),
            new Zeega\ExtensionsBundle\ZeegaExtensionsBundle(),
            new Nelmio\SolariumBundle\NelmioSolariumBundle()
        );


        if (in_array($this->getEnvironment(), array('dev', 'test'))) {
      

            $bundles[] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
            $bundles[] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
            $bundles[] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle();
            $bundles[] = new Elao\WebProfilerExtraBundle\WebProfilerExtraBundle();
            $bundles[] = new Profiler\LiveBundle\ProfilerLiveBundle();

        }

        return $bundles;
    }

    public function registerContainerConfiguration(LoaderInterface $loader)
    {
        $loader->load(__DIR__.'/config/config_'.$this->getEnvironment().'.yml');
    }
}
