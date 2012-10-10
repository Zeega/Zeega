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
            new Symfony\Bundle\AsseticBundle\AsseticBundle(),
            new Doctrine\Bundle\DoctrineBundle\DoctrineBundle(),
            new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),
            new JMS\AopBundle\JMSAopBundle(),
            new JMS\DiExtraBundle\JMSDiExtraBundle($this),
            new JMS\SecurityExtraBundle\JMSSecurityExtraBundle(),

            new FOS\UserBundle\FOSUserBundle(),                        
            new Sonata\BlockBundle\SonataBlockBundle(),
            new Sonata\jQueryBundle\SonatajQueryBundle(),
            new Sonata\AdminBundle\SonataAdminBundle(),
            new Sonata\DoctrineORMAdminBundle\SonataDoctrineORMAdminBundle(),
            new Knp\Bundle\MenuBundle\KnpMenuBundle(),      
            new Doctrine\Bundle\MigrationsBundle\DoctrineMigrationsBundle(),
            new JMS\SerializerBundle\JMSSerializerBundle($this),
            new FOS\RestBundle\FOSRestBundle(),
            new Nelmio\SolariumBundle\NelmioSolariumBundle(),
            new Sonata\CacheBundle\SonataCacheBundle(),
            new OldSound\RabbitMqBundle\OldSoundRabbitMqBundle(),
    
            new Zeega\ApiBundle\ZeegaApiBundle(),
            new Zeega\AdminBundle\ZeegaAdminBundle(),
            new Zeega\CoreBundle\ZeegaCoreBundle(),
            new Zeega\DataBundle\ZeegaDataBundle(),
            new Zeega\ExtensionsBundle\ZeegaExtensionsBundle(),
            new Zeega\DiscoveryBundle\ZeegaDiscoveryBundle(),
            new Zeega\EditorBundle\ZeegaEditorBundle(),
            new Zeega\CommunityBundle\ZeegaCommunityBundle(),
            new Zeega\BookmarkletBundle\ZeegaBookmarkletBundle(),
            new Zeega\UserBundle\ZeegaUserBundle(),            
        );

        if (in_array($this->getEnvironment(), array('dev', 'test'))) {
            $bundles[] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
            $bundles[] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
            $bundles[] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle();
        }

        return $bundles;
    }

    public function registerContainerConfiguration(LoaderInterface $loader)
    {
        $loader->load(__DIR__.'/config/config_'.$this->getEnvironment().'.yml');
    }
}
