<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\DataBundle\Command;

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
 * Updates a task status
 *
 */
class UpdateDynamicItemsCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */       
    protected function configure()
    {
        $this->setName('zeega:items:update')
             ->setDescription('Updates dynamic collections counts')
             ->addOption('meta_collection_id', null, InputOption::VALUE_REQUIRED, 'Meta collection id')
             ->addOption('host', null, InputOption::VALUE_REQUIRED, 'Zeega host (example http://alpha.zeega.org')
             ->setHelp("Help");
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $em = $this->getContainer()->get('doctrine')->getEntityManager();

        try {
            $metaId = $input->getOption('meta_collection_id');
            $host = $input->getOption('host');

            if(null === $metaId || null === $host) {
                $output->writeln('Please run this operation with the --meta_collection_id and --host options.');
            } else {
                $url = "$host/api/items/$metaId/items";

                $metaCollection = json_decode(file_get_contents($url),true);

                if(!isset($metaCollection) || !isset($metaCollection["items"]) || !is_array($metaCollection["items"])) {
                    $output->writeln('The meta collection is empty');
                }

                foreach($metaCollection["items"] as $item) {                    
                    $itemUrl = "$host/api/items/".$item["id"]."/items";
                    $collection = json_decode(file_get_contents($itemUrl),true);
                    $output->writeln("Getting item " . $item["id"]);
                    $dbItem = $em->getRepository('ZeegaDataBundle:Item')->findOneById($item["id"]);
                    $dbItem->setChildItemsCount((int)$collection["items_count"]);
                    echo($dbItem->getChildItemsCount());
                    $em->persist($dbItem);
                    $output->writeln("Updated " . $item["id"] . " with " . $collection["items_count"]);
                    $em->flush();
                }
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
