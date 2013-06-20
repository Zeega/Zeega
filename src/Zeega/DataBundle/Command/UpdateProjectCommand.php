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
class UpdateProjectCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */       
    protected function configure()
    {
        $this->setName('zeega:project:update')
             ->setDescription('Updates')
             ->setHelp("Help");
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $dm = $this->getContainer()->get('doctrine_mongodb')->getManager();
        $projects = $dm->createQueryBuilder('Zeega\DataBundle\Document\Project')
            ->select('rdbms_id_published', 'id')
            ->getQuery()->execute();
        $count = 0;
        foreach($projects as $project) {
            $rdbmsId = $project->getRdbmsIdPublished();
            $id = $project->getId();

            if (isset($rdbmsId)) {
                $project->setPublicId((string)$rdbmsId);
            } else {
                $project->setPublicId((string)$id);
            }
            $dm->persist($project);
            $dm->flush();
            $count = $count + 1;
            print $count . "\n";
        }
    }
}
