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
class UpdateProjectViewsCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */       
    protected function configure()
    {
        $this->setName('zeega:items:update-views')
             ->setDescription('Updates item views counts with data from Redis')
             ->addOption('csv_path', null, InputOption::VALUE_OPTIONAL, 'Set counts from a csv file')
             ->setHelp("Help");
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $csvPath = $input->getOption('csv_path');

        $itemsToUpdate = array();
        $itemsToUpdateIds = array();

        if( null !== $csvPath ) {
            $row = 1;
            if (($handle = fopen($csvPath, "r")) !== FALSE) {
                while (($data = fgetcsv($handle, 0, "\t")) !== FALSE) {
                    $row++;
                    if (count($data) >= 2) {
                        
                        $id = $data[0];
                        $count = $data[1];
                        //$id = trim($id);
                        $id = str_replace("\n","",$id); 
                        $id = str_replace(' ','',$id);
                        $id = str_replace("\0", "", $id);
                        $id = intval($id);

                        $count = str_replace("\n","",$count); 
                        $count = str_replace(' ','',$count);
                        $count = str_replace("\0", "", $count);
                        $count = intval($count);

                        if ( isset($itemsToUpdate[$id]) ) {
                            $itemsToUpdate[$id] = $itemsToUpdate[$id] + $count;    
                        } else {
                            $itemsToUpdate[$id] = $count;
                        }
                    }
                }
                fclose($handle);
            }
        } else {
            $redis = $this->getContainer()->get('snc_redis.default');
        
            $redis->multi();
            $redis->smembers('update');
            $redis->del('update');
            $queryResult = $redis->exec();

            $itemsToUpdateIds = $queryResult[0];
            if ( isset($itemsToUpdateIds) && is_array($itemsToUpdateIds) && count($itemsToUpdateIds) > 0 ) {
                $redis->multi();
                $redis->mget($itemsToUpdateIds);
                $redis->del($itemsToUpdateIds);
                $queryResult = $redis->exec();

                $itemsToUpdate = array_combine($itemsToUpdateIds, $queryResult[0]);            
            } 
        }
        
        if (isset($itemsToUpdate) && is_array($itemsToUpdate) && count($itemsToUpdate) > 0) {            
            $em = $this->getContainer()->get('doctrine')->getEntityManager();
            $databaseItems = $em->getRepository("ZeegaDataBundle:Item")->findInId(array_keys($itemsToUpdate));
                        
            foreach ($databaseItems as $dbItem) {

                $id = $dbItem->getId();
                $currViews = $dbItem->getViews();
                if ( isset($itemsToUpdate[$id]) ) {
                    if ( null !== $csvPath ) {
                        $dbItem->setViews($itemsToUpdate[$id]);
                    } else {
                        $dbItem->setViews($currViews + $itemsToUpdate[$id]);
                    }
                    
                    $em->persist($dbItem);
                }
            }

            $em->flush();
        }
    }
}
