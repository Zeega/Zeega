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
use Zeega\DataBundle\Entity\User;

/**
 * Updates a task status
 *
 */
class UpdateUsernamesCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */       
    protected function configure()
    {
        $this->setName('zeega:user:update_usernames')
             ->setDescription('Updates item views counts with data from Redis')
             ->setHelp("Help");
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $dm = $this->getContainer()->get('doctrine_mongodb')->getManager();
        $users = $dm->getRepository('ZeegaDataBundle:User')->findAll();
        $count = 10000;
        foreach($users as $user) {
            $displayName = $user->getDisplayName();
            $username = $user->getDisplayName();
            $rdbmsId = $user->getRdbmsId();
            $duplicate = false;

            if (strpos($username, '@') !== FALSE) { 
                $username = substr($username, 0, strpos($username, '@'));
            }
            
            $username = $this->toASCII($username);
            $username = strtolower($username);
            $username = preg_replace("/[^A-Za-z0-9]/", '', $username);
            

            if ( isset($username) && !empty($username) ) {
                $dbUser = $dm->getRepository('ZeegaDataBundle:User')->findOneByUsername($username);
                if (isset($dbUser) && $dbUser->getId() != $user->getId()) {
                    $duplicate = true;
                }
            }
            
            if ( !isset($username) || empty($username) || $duplicate || strlen($username) < 4) {
                if (isset($rdbmsId)) {
                    $username = "user$rdbmsId";
                } else {
                    $username = "user$count";
                    $count = $count + 1;
                }
            }
            $user->setUsername($username);
            $dm->persist($user);
            $dm->flush(); 
            $dm->clear(); 
            $output->writeln("$displayName - $username");
        }
    }

    private function toASCII( $str )
    {
        return strtr(utf8_decode($str), 
            utf8_decode(
            'ŠŒŽšœžŸ¥µÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ'),
            'SOZsozYYuAAAAAAACEEEEIIIIDNOOOOOOUUUUYsaaaaaaaceeeeiiiionoooooouuuuyy');
    }
}
