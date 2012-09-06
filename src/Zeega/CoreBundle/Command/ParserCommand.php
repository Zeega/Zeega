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

use Zeega\CoreBundle\Generator\ParserGenerator;
use Zeega\CoreBundle\Generator\Generator;
use Zeega\CoreBundle\Helpers\ResponseHelper;

class ParserCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('zeega:parser')
             ->setDescription('Bulk data parser')
             ->addOption('url', null, InputOption::VALUE_REQUIRED, 'Url of the item or collection to be ingested')
             ->addOption('user', null, InputOption::VALUE_REQUIRED, 'Url of the item or collection to be ingested')
             ->addOption('task_id', null, InputOption::VALUE_REQUIRED, 'Task id')
             ->addOption('force', null, InputOption::VALUE_NONE, 'Set this parameter to execute this action')
             ->setHelp("Help");
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $url = $input->getOption('url');
        $userId = $input->getOption('user');
        $taskId = $input->getOption('task_id');
        
        if(null === $url || null === $userId)
        {
            $output->writeln('');
            $output->writeln('Please run the operation with the --url and --userId options to execute');
            $output->writeln('');
        }
        else
        {
            $loadChildren = true;

            $parser = $this->getContainer()->get('zeega_parser');
            $parserResponse = $parser->load($url, $loadChildren, $userId);
            if(isset($parserResponse["items"]))
            {
                $items = ResponseHelper::serializeEntityToJson($parserResponse["items"]);
                $filePath = "$taskId.json";
                file_put_contents($filePath, $items);
                $output->writeln($filePath);    
            }
        }
    }
}
