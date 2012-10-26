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
 * Retrieves media from a service for a given URL.
 * Writes a json file with the results to the disk.
 *
 */
class ParserCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */    
    protected function configure()
    {
        $this->setName('zeega:parsers:parse-url')
             ->setDescription('Runs a parser for a given URL and writes a JSON file with the result.')
             ->addOption('url', null, InputOption::VALUE_REQUIRED, 'Url of the item or collection to be ingested')
             ->addOption('user', null, InputOption::VALUE_REQUIRED, 'User id')
             ->addOption('result_path', null, InputOption::VALUE_REQUIRED, 'Absolute path for the result file')
             ->setHelp("Help");
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $url = $input->getOption('url');
        $userId = $input->getOption('user');
        $resultPath = $input->getOption('result_path');
        
        if(null === $url || null === $userId || null === $resultPath) {
            $output->writeln('<info>Please run this operation with the --url, --user and --result_path options.</info>');
        }
        else {
            $loadChildren = true;

            $parser = $this->getContainer()->get('zeega_parser');
            $parserResponse = $parser->load($url, $loadChildren, $userId);

            if(isset($parserResponse["items"])) {
                $filePath = "$resultPath.json";
                $temaplate = $this->getContainer()->get('templating')->render("ZeegaApiBundle:Items:index.json.twig",array("items"=>$parserResponse["items"], "load_children" =>true));
                file_put_contents($filePath, $temaplate);
                $output->write($filePath);    
            }
        }
    }
}
