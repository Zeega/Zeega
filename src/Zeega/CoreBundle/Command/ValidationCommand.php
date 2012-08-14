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

class ValidationCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('zeega:project:validation')
            ->setDescription('Validates projects data')
            ->addOption('force', null, InputOption::VALUE_NONE, 'Set this parameter to execute this action')
            ->addOption('fix', null, InputOption::VALUE_NONE, 'Set this parameter fix the project data')
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
                
                $projects = $em->getRepository('ZeegaDataBundle:Project')->findAll();

                foreach($projects as $project)
                {
                    // check / delete dead layers
                    $id = $project->getId();
                    $frames = $em->getRepository('ZeegaDataBundle:Frame')->findBy(array("project_id" => $id));
                    foreach($frames as $frame)
                    {
                        $frameId = $frame->getId();
                        $frameLayers = $frame->getLayers();
                        $updateLayers = false;

                        if(is_array($frameLayers))
                        {
                            foreach($frameLayers as $key => $layerId)
                            {
                                if(isset($layerId) && !empty($layerId))
                                {
                                    $layer = $em->getRepository('ZeegaDataBundle:Layer')->findOneById($layerId);
                                
                                    if(!isset($layer))
                                    {
                                        echo "Problem in project $id - frame $frameId contains undefined layer $layerId \n";
                                        if ($input->getOption('fix')) 
                                        {
                                            $updateLayers = true;
                                            echo "Deleting layer $layerId from frame $frameId \n";
                                            unset($frameLayers[$key]);
                                        }
                                    }
                                    else
                                    {
                                        $layerAttributes = $layer->getAttr();
                                        if(isset($layerAttributes) && isset($layerAttributes["to_sequence"]))
                                        {
                                            $targetSequenceId = $layerAttributes["to_sequence"];
                                            $sequence = $em->getRepository('ZeegaDataBundle:Sequence')->findOneById($targetSequenceId);

                                            if(!isset($sequence))
                                            {
                                                echo "Problem in project $id - layer $layerId links to undefined sequence $targetSequenceId \n";
                                                if ($input->getOption('fix')) 
                                                {
                                                    echo "Deleting layer $layerId from frame $frameId \n";
                                                    $em->remove($layer);
                                                }
                                            }
                                        }
                                    }
                                }                        
                            }
                        }

                        if($updateLayers === true)
                        {
                            $frame->setLayers($frameLayers);
                            $em->persist($frame);
                        }
                    }
                }

                if ($input->getOption('fix')) 
                {
                    echo "Commiting changes to the database";
                    $em->flush();
                }
            } catch (\Exception $e) 
            {
                $output->writeln(sprintf('<error>%s</error>', $e->getMessage()));
            }
        } else {
            $output->writeln('');
            $output->writeln('<info>Zeega Project Validation Tool (a.k.a. the hammer)</info>');
            $output->writeln('');
            $output->writeln('This operation checks all existing projects for errors and when executed with the option --fix removes from frames layers that');
            $output->writeln('do not exist anymore. For efficiency the relation frames <-> layers is not normalized on the database so this might happen.');
            $output->writeln('');
            $output->writeln('This is a temporary fix to address this issue.');
            $output->writeln('');
            $output->writeln('<error>ATTENTION:</error>');
            $output->writeln('<error>This operation should not be executed in a production environment.      </error>');
            $output->writeln('<error>Running it with the --fix option makes irreversible changes to Projects!</error>');
            $output->writeln('');
            $output->writeln('Please run the operation with --force to execute');
            $output->writeln('');
            
        }       
    }
}
