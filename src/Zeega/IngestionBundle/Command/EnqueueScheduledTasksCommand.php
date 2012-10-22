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
             ->setHelp("Help");
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $em = $this->getContainer()->get('doctrine')->getEntityManager();
        
        $scheduledTasks = $em->getRepository('ZeegaDataBundle:Schedule')->findByStatus('ready');

        $ingestedBy = 'scheduled_task';
        $celeryTaskName = 'zeega.tasks.ingest_scheduled';
        $celeryRoutingKey = 'schedule';

        foreach($scheduledTasks as $scheduledTask) {
            $userId = $scheduledTask->getUser()->getId();
            $archive = $scheduledTask->getArchive();
            
            $latestUpdate = $scheduledTask->getDateUpdated();
            
            try {
                $latestItem = $em->getRepository('ZeegaDataBundle:Item')->findOneByUserIngestedArchive($userId, $ingestedBy, $archive);
                
                $message = array("latest_item" => $latestItem, "archive" => $archive);
                
                $queue = $this->getContainer()->get('zeega_queue');
                $taskId = $queue->enqueueCeleryMessage($message, $celeryTaskName, $celeryRoutingKey);

            } catch(Doctrine\ORM\NoResultException $e) {
                // no results; this is not really an error
            }
            //TO-DO
            //update status, error handling
        }
    }
}
