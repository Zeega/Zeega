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

class IngestCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('zeega:ingest')
            ->setDescription('Bulk data importer')
            ->addOption('url', null, InputOption::VALUE_REQUIRED, 'Url of the item or collection to be ingested')
            ->setHelp(<<<EOT
The <info>generate:bundle</info> command helps you generates new bundles.

By default, the command interacts with the developer to tweak the generation.
Any passed option will be used as a default value for the interaction
(<comment>--namespace</comment> is the only one needed if you follow the
conventions):

<info>php app/console generate:bundle --namespace=Acme/BlogBundle</info>

Note that you can use <comment>/</comment> instead of <comment>\\</comment> for the namespace delimiter to avoid any
problem.

If you want to disable any user interaction, use <comment>--no-interaction</comment> but don't forget to pass all needed options:

<info>php app/console generate:bundle --namespace=Acme/BlogBundle --dir=src [--bundle-name=...] --no-interaction</info>

Note that the bundle namespace must end with "Bundle".
EOT
                )
            
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $generator = new ParserGenerator($this->getContainer()->get('filesystem'), __DIR__.'/../Resources/templates/generator');
        $dialog = $this->getHelperSet()->get('dialog');
        
        $style = new OutputFormatterStyle();
        $style->setBackground('blue');
        $output->getFormatter()->setStyle('header', $style);
        
        $style = new OutputFormatterStyle();
        $style->setForeground('yellow');
        $output->getFormatter()->setStyle('ask', $style);
        
        $output->writeln(array(
            '',
            'The bundle can be generated anywhere. The suggested default directory uses',
            'the standard conventions.',
            '',
        ));
        $dir = $dialog->ask($output, "<ask>Default directory [$dir]: </ask>", $dir);

        $output->writeln(array(
            '',
            "Writting the parser file at <ask>$dir/$class.php</ask>",
            '',
        ));
        
        //$generator = $this->getGenerator();
        $generator->generate($namespace, $class, $service, $dir);
        
    }
}
