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
        
            $viewKeys = $redis->keys('views:*');
            $projectsToUpdateIds = array();
            $projectsToUpdateValues = array();

            foreach($viewKeys as $viewKey) {
                $projectId = str_replace("views:","",$viewKey);
                $viewKeyForCopy = str_replace("views:","views-copy:",$viewKey);
                $redis->rename($viewKey, $viewKeyForCopy);                
                $views = $redis->get($viewKeyForCopy);
                
                if (is_numeric($projectId)) {
                    $projectId = (int)$projectId;
                }

                array_push($projectsToUpdateIds, $projectId);
                $projectsToUpdateValues[$projectId] = $views;
            }
            
            if ( count($projectsToUpdateIds > 0) ) {
                $dm = $this->getContainer()->get('doctrine_mongodb')->getManager();
                $projects = $dm->createQueryBuilder('Zeega\DataBundle\Document\Project')
                    ->field('id')->in($projectsToUpdateIds)
                    ->getQuery()->execute();
                
                foreach($projects as $project) {
                    $views = $project->getViews();
                    $projectId = (string)$project->getId();
                    $project->setViews($views + $projectsToUpdateValues[$projectId]);
                    $dm->persist($project);
                    $redis->del($viewKeyForCopy);
                    unset($projectsToUpdateIds[$projectId]);

                    $output->writeln("Updated $projectId");
                }

                // temp method to update projects that use the old ids
                if( count($projectsToUpdateIds) > 0 ) {
                    $projects = $dm->createQueryBuilder('Zeega\DataBundle\Document\Project')
                        ->field('rdbmsIdPublished')->in($projectsToUpdateIds)
                        ->getQuery()->execute();
                    
                    foreach($projects as $project) {
                        $views = $project->getViews();
                        $projectId = (string)$project->getRdbmsIdPublished();
                        $project->setViews($views + $projectsToUpdateValues[$projectId]);
                        $dm->persist($project);
                        $redis->del($viewKeyForCopy);
                    
                        $output->writeln("Updated $projectId");
                    }                    
                }

                $dm->flush();
            }
        }
    }
}
