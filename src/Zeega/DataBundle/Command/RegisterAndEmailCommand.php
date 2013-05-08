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
class RegisterAndEmailCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */       
    protected function configure()
    {
        $this->setName('zeega:register_users')
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

        $hostname = $this->getContainer()->getParameter('hostname');
        $hostDirectory = $this->getContainer()->getParameter('directory');
        
        if( null !== $csvPath ) {
            $row = 1;
            if (($handle = fopen($csvPath, "r")) !== FALSE) {
                while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
                    $row++;
                    if (count($data) >= 2) {
                        
                        $email = $data[0];
                        $displayName = $data[1];
                        
                        $em = $this->getContainer()->get('doctrine')->getEntityManager();
                        $user = $em->getRepository('ZeegaDataBundle:User')->findOneByEmail($email);

                        if( !isset($user) ) {
                            $user = new User();
                            $user->setDisplayName($displayName);
                            $user->setEmail($email);
                            $user->setUserName($email);
                            $user->setEnabled(true);
                            $user->setEnabled(true);
                            $user->setLocked(false);
                            $user->setPlainPassword(mt_rand());
                            
                            if (null === $user->getConfirmationToken()) {
                                $tokenGenerator = $this->getContainer()->get("fos_user.util.token_generator");
                                $user->setConfirmationToken($tokenGenerator->generateToken());
                            }

                            $user->setPasswordRequestedAt(new \DateTime('now'));
                            $em->persist($user);
                            $em->flush();
                        
                            $activationUrl = "http:" . $hostname . $hostDirectory ."resetting/reset/" . $user->getConfirmationToken();

                            $message = \Swift_Message::newInstance()
                                    ->setSubject('Welcome to the New Zeega!')
                                    ->setFrom(array('noreply@zeega.com'=>'Zeega'))
                                    ->setTo($user->getEmail())
                                    ->setBody($this->getContainer()->get('templating')->render('ZeegaUserBundle:Email:autoregistration.email.twig', 
                                        array('name' => $user->getDisplayName(), 'link' => $activationUrl)),'text/html')
                                ;
                            
                            $this->getContainer()->get('mailer')->send($message);
                        }
                    }
                }
                fclose($handle);
            }
        } 
    }
}
