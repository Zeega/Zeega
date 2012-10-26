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

class ParserByIdCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('zeega:parser:id')
             ->setDescription('Parses a URL in Zeega format')
             ->addOption('domain', null, InputOption::VALUE_OPTIONAL, 'Result file path')
             ->addOption('parser_id', null, InputOption::VALUE_OPTIONAL, 'Result file path')
             ->addOption('check_for_duplicates', null, InputOption::VALUE_OPTIONAL, 'Result file path')
             ->addOption('max_items_to_parse', null, InputOption::VALUE_OPTIONAL, 'Result file path')
             ->addOption('tags', null, InputOption::VALUE_OPTIONAL, 'Result file path')
             ->addOption('query', null, InputOption::VALUE_OPTIONAL, 'Result file path')
             ->addOption('user', null, InputOption::VALUE_REQUIRED, 'Url of the item or collection to be ingested')
             ->addOption('result_path', null, InputOption::VALUE_REQUIRED, 'Task id')
             ->setHelp("Help");
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $userId = $input->getOption('user');
        $domain = $input->getOption('domain');
        $tags = $input->getOption('tags');
        $query = $input->getOption('query');
        $parserId = $input->getOption('parser_id');
        $resultPath = $input->getOption('result_path');
        $checkForDuplicates = $input->getOption('check_for_duplicates');
        $maxItemsToParse = $input->getOption('max_items_to_parse');
        
        if(null === $domain || null === $parserId || null === $userId || null === $resultPath) {
            $output->writeln('Please run this operation with the --url or --parser_id and --domain, and the --user and --result_path options.');
        } else {
            $loadChildren = true;

                $parser = $this->getContainer()->get('zeega_parser');
                
                $parameters = array();
                $parameters["tags"] = $tags;                
                $parameters["query"] = $query;
                $parameters["check_for_duplicates"] = $checkForDuplicates;
                
                $parserResponse = $parser->loadById($domain, $parserId, true, $userId, $parameters);

                if(isset($parserResponse["items"])) {
                    $filePath = "$resultPath.json";
                    $temaplate = $this->getContainer()->get('templating')->render("ZeegaApiBundle:Items:index.json.twig",array("items"=>$parserResponse["items"], "load_children" =>true));
                    file_put_contents($filePath, $temaplate);
                    $output->write($filePath);    
                }
        }
    }
}
