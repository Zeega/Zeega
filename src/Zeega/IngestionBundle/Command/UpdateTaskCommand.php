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
use Zeega\DataBundle\Entity\Item;

/**
 * Updates a scheduled task status
 *
 */
class UpdateTaskCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('zeega:task:update')
             ->setDescription('Updates a task')
             ->addOption('task', null, InputOption::VALUE_REQUIRED, 'Task id')
             ->addOption('status', null, InputOption::VALUE_REQUIRED, 'New status')
             ->setHelp("Help");
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $em = $this->getContainer()->get('doctrine')->getEntityManager();

        try {
            $taskId = $input->getOption('task');
            $newStatus = $input->getOption('status');
            
            if(null === $taskId || null === $newStatus) {
                $output->writeln('Please run this operation with the --task and --status options.');
            } else {
                
                $task = $em->getRepository('ZeegaDataBundle:Task')->findOneById($taskId);

                if(isset($task)) {
                    $task->setStatus($newStatus);
                    $em->persist($task);
                    $em->flush($task);
                }
            
                $output->writeln("Success");
            }
        } catch (Exception $e) {
            $message = $e->getMessage();
            $output->writeln($message);
            $task->setStatusMessage($message);
            $em->persist($task);
            $em->flush($task);
        }
        
    }
}
