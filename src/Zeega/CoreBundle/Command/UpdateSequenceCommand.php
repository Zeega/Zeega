<?php

// src/Acme/DemoBundle/Command/GreetCommand.php
namespace Zeega\CoreBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Helper\FormatterHelper;
use Symfony\Component\Console\Helper\DialogHelper;
use Symfony\Component\Console\Formatter\OutputFormatter;
use Symfony\Component\Console\Formatter\OutputFormatterStyle;

class UpdateSequenceCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('zeega:sequences:update-attributes')
            ->setDescription('Validates projects data')
            ->addOption('force', null, InputOption::VALUE_NONE, 'Set this parameter to execute this action')
            ->setHelp("Help");
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        ini_set('memory_limit', '-1');

        $dialog = $this->getHelperSet()->get('dialog');
        
        $style = new OutputFormatterStyle();
        $style->setBackground('red');
        $output->getFormatter()->setStyle('header', $style);
        $output->getFormatter()->setStyle('dialog', $style);

        $style = new OutputFormatterStyle();
        $style->setForeground('yellow');
        $output->getFormatter()->setStyle('ask', $style);
        
        
        if ($input->getOption('force')) 
        {
            try 
            {
                $em = $this->getContainer()->get('doctrine')->getEntityManager();
                
                $sequences = $em->getRepository('ZeegaDataBundle:Sequence')->findAll();

                foreach($sequences as $sequence)
                {
                    $attributes = $sequence->getAttr();
                    if(isset($attributes) && is_array($attributes))
                    {
                        if(array_key_exists("persistLayers", $attributes))
                        {
                            $attrPersistentLayers = $attributes["persistLayers"];
                            $currPersistentLayers = $sequence->getPersistentLayers();

                            if(isset($attrPersistentLayers) && !isset($currPersistentLayers))
                            {
                                if(is_array($attrPersistentLayers) && count($attrPersistentLayers) > 0)
                                {
                                    $sequence->setPersistentLayers($attrPersistentLayers);
                                }
                            }
                            unset($attributes["persistLayers"]);
                            $sequence->setAttr($attributes);
                            $em->persist($sequence);
                        }
                    }
                }

                $em->flush();
            } 
            catch (\Exception $e) 
            {
                $output->writeln(sprintf('<error>%s</error>', $e->getMessage()));
            }
        } else {
            $output->writeln('');
            $output->writeln('Please run the operation with --force to execute');
            $output->writeln('');            
        }       
    }
}
