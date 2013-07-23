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
use Zeega\DataBundle\Entity\UserGraph;

/**
 * Updates a task status
 *
 */
class CopyUsersToGraphCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */       
    protected function configure()
    {
        $this->setName('zeega:users:copy')
             ->setDescription('Updates')
             ->setHelp("Help");
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $dm = $this->getContainer()->get('doctrine_mongodb')->getManager();
        $users = $dm->getRepository('ZeegaDataBundle:User')->findByUsername("luisbrandao");
        $gem = $this->getContainer()->get('neo4j.manager');
        $count = 0;
        foreach($users as $user) {
            $displayName = $user->getDisplayName();
            $username = $user->getUsername();
            $rdbmsId = $user->getRdbmsId();
            $id = $user->getId();

            $userGraph = new UserGraph();
            $userGraph->setDisplayName($displayName);
            $userGraph->setUsername($username);
            $userGraph->setMongoId($id);
            $gem->persist($userGraph);
            $output->writeln($username);
            $count++;
            //if($count % 20 == 0) {
                $output->writeln("Flush start");
                $gem->flush();
                $output->writeln("Flush is over");
                return;
            //}
        }
    }
}
