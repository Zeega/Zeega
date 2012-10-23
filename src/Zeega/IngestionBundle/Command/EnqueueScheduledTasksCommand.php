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

class EnqueueScheduledTasksCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('zeega:tasks:enqueue')
             ->setDescription('Enqueues for processing all ready tasks')
             ->addOption('full_duplicate_scan', null, InputOption::VALUE_REQUIRED, 'Boolean. Detect duplicates on all the existing data.')
             ->setHelp("Help");
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $duplicateScan = $input->getOption('full_duplicate_scan');

        if(null == $duplicateScan) {
            $output->writeln('Please run this operation with the --full_duplicate_scan option.');
            return;
        }

        if('true' != $duplicateScan && 'false' != $duplicateScan) {
            $output->writeln('The --full_duplicate_scan value has to be true or false.');
            return;   
        }

        $em = $this->getContainer()->get('doctrine')->getEntityManager();
        
        $scheduledTasks = $em->getRepository('ZeegaDataBundle:Schedule')->findByStatus('ready');

        $ingestedBy = 'scheduled_task';
        $celeryTaskName = 'zeega.tasks.ingest_scheduled';
        $celeryRoutingKey = 'schedule';

        foreach($scheduledTasks as $scheduledTask) {
            try {
                $parserId = self::resolveParser($scheduledTask);                                        // find the parser for the scheduled task
                
                $message["domain"] = $parserId["domain"];                                               // create amqp message for rabbitmq + celery                
                $message["parser_id"] = $parserId["parser_id"];
                $message["full_duplicate_scan"] = (bool)$duplicateScan;
                $message["task_configuration"] = array();                                               // hack to avoid serialization
                $message["task_configuration"]["tags"] = $scheduledTask->getTags();
                $message["task_configuration"]["query"] = $scheduledTask->getQuery();
                $message["task_configuration"]["archive"] = $scheduledTask->getArchive();
                $message["task_configuration"]["date_updated"] = $scheduledTask->getDateUpdated();
                
                $queue = $this->getContainer()->get('zeega_queue');
                $taskId = $queue->enqueueCeleryMessage($message, $celeryTaskName, $celeryRoutingKey);   // send the message to the queue

                $scheduledTask->setStatus('queued');                                                    // update the scheduled task status on Zeega
                $scheduledTask->setDateUpdated(new \DateTime("now")); 
                $em->persist($scheduledTask);
                $em->flush();

            } catch(Doctrine\ORM\NoResultException $e) {
                // no results; this is not really an error
            }
        }
    }

    private function resolveParser($scheduledTask) {
        if(null === $scheduledTask) {
            throw new \BadMethodCallException('The scheduledTask parameter cannot be null');
        }

        $tags = $scheduledTask->getTags();
        $archive = $scheduledTask->getArchive();

        if($archive == 'Flickr') {
            if(null !== $tags) {
                return array('domain' => 'flickr.com', 'parser_id' => 'tags_parser', 'tags' => $tags);
            }
        }
        throw new \Exception("Cannot resolve a parser for $tags and $archive");
    }
}
