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
use Zeega\DataBundle\Document\Item as MongoItem;
use Zeega\DataBundle\Entity\User;
use Zeega\DataBundle\Document\Project as MongoProject;
use Zeega\DataBundle\Document\Sequence as MongoSequence;
use Zeega\DataBundle\Document\Frame as MongoFrame;
use Zeega\DataBundle\Document\Layer as MongoLayer;
use Zeega\DataBundle\Document\User as MongoUser;

//set_error_handler(create_function('$e', 'echo "Uncaught error \n";'));
//set_exception_handler(create_function('$e', 'echo "Uncaught exception \n";'));
/**
 * Updates a task status
 *
 */
class MysqlToMongoCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */       
    protected function configure()
    {
        $this->setName('zeega:data:mongodb:import-items')
             ->setDescription('Moves items from mysql to mongo')
             ->addOption('items', null, InputOption::VALUE_NONE , 'Items')
             ->addOption('users', null, InputOption::VALUE_NONE , 'Items')
             ->addOption('projects', null, InputOption::VALUE_NONE , 'Items')
             ->addOption('create_project', null, InputOption::VALUE_NONE , 'Creates a project')
             ->setHelp("Help");
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $items = $input->getOption('items');
        $users = $input->getOption('users');
        $projects = $input->getOption('projects');
        $createProject = $input->getOption('create_project');
        
        if( $items ) {
            self::importItems($output);
        } else if ( $users ) {
            self::importUsers($output);
        } else if ( $createProject ) {
            self::createProject($output);
        } else if ( $projects ) {
            self::importProjects($output);
        }
    }

    private function importUsers(OutputInterface $output)
    {
        $output->writeln('<info>Importing users</info>');

        $em = $this->getContainer()->get('doctrine')->getEntityManager();
        $dm = $this->getContainer()->get('doctrine_mongodb')->getManager();
        $mysqlUsers = $em->getRepository('ZeegaDataBundle:User')->findAll();

        foreach($mysqlUsers as $user) {
            $mongoUser = $dm->getRepository('ZeegaDataBundle:User')->findOneByOldId($user->getId());
            
            if (!isset($mongoUser)) {
                break;
            }
            
            $mongoUser->setOldId($user->getId());
            $mongoUser->setUsername($user->getUsername());
            $mongoUser->setUsernameCanonical($user->getUsernameCanonical());
            $mongoUser->setEmail($user->getEmail());
            $mongoUser->setEmailCanonical($user->getEmailCanonical());
            $mongoUser->setEnabled($user->isEnabled());
            $mongoUser->setSalt($user->getSalt());
            $mongoUser->setPassword($user->getPassword());
            $lastLogin = $user->getLastLogin();
            if(isset($lastLogin)) {
                $mongoUser->setLastLogin($lastLogin);    
            }            
            $mongoUser->setLocked($user->isLocked());
            $mongoUser->setExpired($user->isExpired());
            $mongoUser->setConfirmationToken($user->getConfirmationToken());
            $mongoUser->setPasswordRequestedAt($user->getPasswordRequestedAt());
            $mongoUser->setRoles($user->getRoles());
            $mongoUser->setCredentialsExpired($user->getCredentialsExpired());
            $mongoUser->setDisplayName($user->getDisplayName());
            $mongoUser->setBio($user->getBio());
            $mongoUser->setThumbUrl($user->getThumbUrl());
            $mongoUser->setCreatedAt($user->getCreatedAt());
            $mongoUser->setLocation($user->getLocation());
            $mongoUser->setLocationLatitude($user->getLocationLatitude());
            $mongoUser->setLocationLongitude($user->getLocationLongitude());
            $mongoUser->setBackgroundImageUrl($user->getBackgroundImageUrl());
            $mongoUser->setDropboxDelta($user->getDropboxDelta());
            $mongoUser->setIdea($user->getIdea());
            $mongoUser->setApiKey($user->getApiKey());
            $mongoUser->setTwitterId($user->getTwitterId());
            $mongoUser->setTwitterUsername($user->getTwitterUsername());
            $mongoUser->setFacebookId($user->getFacebookId());
            $oldId = $user->getId();
            $newId = $mongoUser->getId();
            echo "Old id $oldId - new id $newId \n";
            $dm->persist($mongoUser);
            $dm->flush();
        }
        
    }

    private function importProjects(OutputInterface $output)
    {
        $dm = $this->getContainer()->get('doctrine_mongodb')->getManager();
        $users = $this->getContainer()->get('doctrine')->getRepository('ZeegaDataBundle:User')->findAll();
        
        foreach($users as $user) {

            $oldUserId = $user->getId();

            if($oldUserId < 128) {
                continue;
            }
                $output->writeln("New User id " . $user->getId());
                $mongoUser = new MongoUser();
                $mongoUser->setId(new \MongoId());
                $mongoUser->setOldId($user->getId());
                $mongoUser->setUsername($user->getUsername());
                $mongoUser->setUsernameCanonical($user->getUsernameCanonical());
                $mongoUser->setEmail($user->getEmail());
                $mongoUser->setEmailCanonical($user->getEmailCanonical());
                $mongoUser->setDisplayName($user->getDisplayName());
                $mongoUser->setBio($user->getBio());
                $mongoUser->setBackgroundImageUrl($user->getBackgroundImageUrl());
                $mongoUser->setTwitterId($user->getTwitterId());
                $mongoUser->setTwitterUsername($user->getTwitterUsername());
                $mongoUser->setFacebookId($user->getFacebookId());
                $dm->persist($mongoUser);
                $dm->flush();                

            
            $userProjects = $this->getContainer()->get('doctrine')->getRepository('ZeegaDataBundle:Project')->findProjectsByUserSmall($user->getId());

            foreach($userProjects as $userProject) {
                
                $id = $userProject["id"];

                $project = $this->getContainer()->get('doctrine')->getRepository('ZeegaDataBundle:Project')->findOneById($id);
                $sequences = $this->getContainer()->get('doctrine')->getRepository('ZeegaDataBundle:Sequence')->findBy(array("project" => $project, "enabled" => true));
                $frames = $this->getContainer()->get('doctrine')->getRepository('ZeegaDataBundle:Frame')->findBy(array("project" => $project, "enabled" => true));
                $layers = $this->getContainer()->get('doctrine')->getRepository('ZeegaDataBundle:Layer')->findBy(array("project" => $project, "enabled" => true));
                
                $output->writeln($project->getId());

                $sequencesFrames = array();
                
                $layersIdTranslation = array();

                $mongoProject = new MongoProject();
                $mongoProject->setId(new \MongoId());
                $mongoProject->setId(new \MongoId());
                $mongoProject->setTitle($project->getTitle());
                $mongoProject->setMobile($project->getMobile());
                $mongoProject->setDateCreated($project->getDateCreated());
                $mongoProject->setEnabled($project->getEnabled());
                $mongoProject->setTags($project->getTags());
                $mongoProject->setAuthors($project->getAuthors());
                $mongoProject->setCoverImage($project->getCoverImage());
                $mongoProject->setEstimatedTime($project->getEstimatedTime());
                $mongoProject->setDateUpdated($project->getDateUpdated());
                $mongoProject->setDescription($project->getDescription());
                $mongoProject->setLocation($project->getLocation());
                $mongoProject->setDatePublished($project->getDatePublished());
                $mongoProject->setOldProjectId($project->getId());
                $mongoProject->setUser($mongoUser);


                $projectItemId = $project->getItemId();

                if (isset($projectItemId)) {
                    $mongoProject->setOldProjectPublishedId($projectItemId);
                }

                // TO-DO - SET USER

                foreach($sequences as $seq) {
                    
                    $mongoSequence = new MongoSequence();
                    $mongoSequence->setId(new \MongoId());
                    $mongoSequence->setTitle($seq->getTitle());
                    $mongoSequence->setAttr($seq->getAttr());
                    $mongoSequence->setPersistentLayers($seq->getPersistentLayers());
                    $mongoSequence->setEnabled($seq->getEnabled());
                    $mongoSequence->setDescription($seq->getDescription());
                    $mongoSequence->setAdvanceTo($seq->getAdvanceTo());
                    
                    $seqId = $seq->getId();
                    $currSequenceFramesIds = $this->getContainer()->get('doctrine')->getRepository('ZeegaDataBundle:Frame')->findIdBySequenceId($seqId);

                    foreach($currSequenceFramesIds as $oldFrameId) {
                        $oldFrame = $this->getContainer()->get('doctrine')->getRepository('ZeegaDataBundle:Frame')->findOneById($oldFrameId);
                        
                        $mongoFrame = new MongoFrame();
                        $mongoFrame->setId(new \MongoId());
                        $mongoFrame->setAttr($oldFrame->getAttr());
                        $mongoFrame->setThumbnailUrl($oldFrame->getThumbnailUrl());
                        $mongoFrame->setControllable($oldFrame->getControllable());
                        $mongoFrameLayersIds = array();

                        $oldFrameLayersIds = $oldFrame->getLayers();
                        
                        if (isset($oldFrameLayersIds)) {
                            foreach($oldFrameLayersIds as $oldLayerId) {
                                if (isset($oldLayerId) ) {
                                    $oldLayer = $this->getContainer()->get('doctrine')->getRepository('ZeegaDataBundle:Layer')->findOneById($oldLayerId);
                                    if (!isset($layersIdTranslation[$oldLayerId]) && isset($oldLayer)) {                            
                                        $mongoLayer = new MongoLayer();
                                        $mongoLayer->setId(new \MongoId());
                                        $layerAttr = $oldLayer->getAttr();
                                        $layerAttrJson = json_encode($layerAttr);
                                        //echo $layerAttrJson;
                                        if ($layerAttrJson == FALSE) {
                                            $output->writeln("Project $id has broken layers");
                                            continue;
                                        }

                                        $mongoLayer->setAttr($layerAttr);    
                                        $mongoLayer->setType($oldLayer->getType());
                                        $mongoLayer->setText($oldLayer->getText());
                                        $mongoLayer->setEnabled(true);
                                        $mongoProject->addLayer($mongoLayer);
                                        $layersIdTranslation[$oldLayerId] = $mongoLayer->getId();
                                    }

                                    if (isset($layersIdTranslation[$oldLayerId])) {
                                        array_push($mongoFrameLayersIds, (string)$layersIdTranslation[$oldLayerId]);     
                                    }
                                    
                                }
                                $mongoFrame->setLayers($mongoFrameLayersIds);
                            }    
                        }
                        
                        $mongoProject->addFrame($mongoFrame);
                    }
                    $mongoProject->addSequence($mongoSequence);
                }
                
                $dm->persist($mongoProject);
                $dm->flush();
            }
        }
    
    }
}
