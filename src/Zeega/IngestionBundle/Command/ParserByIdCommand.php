<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

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


/**
 * Retrieves media from a service for a given tag or query using a parser.
 * Writes a json file with the results to the disk.
 *
 */
class ParserByIdCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */
    protected function configure()
    {
        $this->setName('zeega:parsers:parse-by-id')
             ->setDescription('Runs a parser for a given tag or query and writes a JSON file with the result.')
             ->addOption('domain', null, InputOption::VALUE_OPTIONAL, 'Domain name of the parser. Needs to exist on src/Zeega/IngestionBundle/Resources/config/zeega/Parser.yml')
             ->addOption('parser_id', null, InputOption::VALUE_OPTIONAL, 'Id of the parser. Needs to exist on src/Zeega/IngestionBundle/Resources/config/zeega/Parser.yml')
             ->addOption('check_for_duplicates', null, InputOption::VALUE_OPTIONAL, 'Result file path')
             ->addOption('tags', null, InputOption::VALUE_OPTIONAL, 'Tags for the parser')
             ->addOption('user', null, InputOption::VALUE_REQUIRED, 'User id')
             ->addOption('result_path', null, InputOption::VALUE_REQUIRED, 'Absolute path for the result file')
             ->setHelp("Help");
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $userId = $input->getOption('user');
        $domain = $input->getOption('domain');
        $tags = $input->getOption('tags');
        $parserId = $input->getOption('parser_id');
        $resultPath = $input->getOption('result_path');
        $checkForDuplicates = $input->getOption('check_for_duplicates');
        
        if(null === $domain || null === $parserId || null === $userId || null === $resultPath || null === $tags) {
            $output->writeln('<info>Please run this operation with the --parser_id, --domain, --user, --tags and --result_path options.</info>');
        } else {
            $loadChildren = true;

            $parser = $this->getContainer()->get('zeega_parser');
            
            $parameters = array();
            $parameters["tags"] = $tags;                
            $parameters["check_for_duplicates"] = $checkForDuplicates;
            
            $parserResponse = $parser->loadById($domain, $parserId, true, $userId, $parameters);

            if(isset($parserResponse["items"])) {
                $filePath = "$resultPath.json";
                $template = $this->getContainer()->get('templating')->render("ZeegaApiBundle:Items:index.json.twig",array("items"=>$parserResponse["items"], "load_children" =>true));
                file_put_contents($filePath, $template);
                $output->write($filePath);  
            }
        }
    }
}
