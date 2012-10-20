<?php

namespace Zeega\IngestionBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Helper\FormatterHelper;
use Symfony\Component\Console\Helper\DialogHelper;
use Symfony\Component\Console\Formatter\OutputFormatter;
use Symfony\Component\Console\Formatter\OutputFormatterStyle;

use Zeega\CoreBundle\Helpers\ResponseHelper;

class ParserCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('zeega:parser')
             ->setDescription('Parses a URL in Zeega format')
             ->addOption('url', null, InputOption::VALUE_REQUIRED, 'Url of the item or collection to be ingested')
             ->addOption('user', null, InputOption::VALUE_REQUIRED, 'Url of the item or collection to be ingested')
             ->addOption('result_path', null, InputOption::VALUE_REQUIRED, 'Task id')
             ->setHelp("Help");
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $url = $input->getOption('url');
        $userId = $input->getOption('user');
        $resultPath = $input->getOption('result_path');
        
        if(null === $url || null === $userId || null === $resultPath)
        {
            $output->writeln('');
            $output->writeln('Please run this operation with the --url, --user and --result_path options.');
            $output->writeln('');
        }
        else
        {
            $loadChildren = true;

            $parser = $this->getContainer()->get('zeega_parser');
            $parserResponse = $parser->load($url, $loadChildren, $userId);

            if(isset($parserResponse["items"]))
            {
                
                //$items = ResponseHelper::serializeEntityToJson($parserResponse["items"]);
                $filePath = "$resultPath.json";
                $temaplate = $this->getContainer()->get('templating')->render("ZeegaApiBundle:Items:index.json.twig",array("items"=>$parserResponse["items"], "load_children" =>true));
                file_put_contents($filePath, $temaplate);
                $output->write($filePath);    
            }
        }
    }
}
