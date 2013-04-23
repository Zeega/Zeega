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
             ->addOption('fix_users', null, InputOption::VALUE_NONE , 'Creates a project')
             ->addOption('min_user_id', null, InputOption::VALUE_OPTIONAL, 'Minimum user_id')
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
        $minUserId = $input->getOption('min_user_id');
        $fixUsers = $input->getOption('fix_users');

        if( $items ) {
            self::importItems($output);
        } else if ( $users ) {
            self::importUsers($output);
        } else if ( $createProject ) {
            self::createProject($output);
        } else if ( $projects ) {
            self::importProjects($output, $minUserId);
        } else if ( $fixUsers ) {
            self::fixProjectsUser($output);
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
            $dm->clear();
        }
        
    }

    private function importProjects(OutputInterface $output, $minUserId)
    {
        $dm = $this->getContainer()->get('doctrine_mongodb')->getManager();
        $users = $this->getContainer()->get('doctrine')->getRepository('ZeegaDataBundle:User')
            ->createQueryBuilder("u")
            ->select('u')
            ->where("u.id >= $minUserId")
            ->add('orderBy', 'u.id ASC')
            ->setMaxResults(2000)
            ->getQuery()
            ->getResult();

        foreach($users as $user) {

            $oldUserId = $user->getId();

            $output->writeln("New User id " . $user->getId());
            $mongoUser = new MongoUser();
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
            $dm->persist($mongoUser);
            $dm->flush();                
            
            //$output->writeln("Getting user projects");
            $userProjects = $this->getContainer()->get('doctrine')->getRepository('ZeegaDataBundle:Project')->findProjectsByUserSmall($user->getId());
            //$output->writeln("Got the projects");
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
                    $mongoSequence->setEnabled($seq->getEnabled());
                    $mongoSequence->setDescription($seq->getDescription());
                    $mongoSequence->setAdvanceTo($seq->getAdvanceTo());
                    
                    $seqId = $seq->getId();
                    $currSequenceFramesIds = $this->getContainer()->get('doctrine')->getRepository('ZeegaDataBundle:Frame')->findIdBySequenceId($seqId);
                    $sequenceFrames = array();
                    foreach($currSequenceFramesIds as $oldFrameId) {
                        $oldFrame = $this->getContainer()->get('doctrine')->getRepository('ZeegaDataBundle:Frame')->findOneById($oldFrameId);
                        
                        $mongoFrame = new MongoFrame();
                        $mongoFrame->setId(new \MongoId());
                        array_push($sequenceFrames, (string)$mongoFrame->getId());

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
                    $oldSequenceAttr = $seq->getAttr();

                    if(isset($oldSequenceAttr)) {
                        if(isset($oldSequenceAttr["soundtrack"])) {
                            $soundtrackLayerId = $oldSequenceAttr["soundtrack"];
                            if (isset($layersIdTranslation[$soundtrackLayerId])) {
                                $oldSequenceAttr["soundtrack"] = (string)$layersIdTranslation[$soundtrackLayerId];    
                            }                            
                        }

                        if(isset($oldSequenceAttr["persistent_layers"])) {
                            $oldPersistentLayersIds = $oldSequenceAttr["persistent_layers"];

                            if (is_array)
                            $newPersistentLayersIds = array();
                            foreach($oldPersistentLayersIds as $oldPersistentLayer) {
                                array_push($newPersistentLayersIds, (string)$layersIdTranslation[$oldPersistentLayer]);
                            }
                            $oldSequenceAttr["persistent_layers"] = $newPersistentLayersIds;
                        }
                        $mongoSequence->setAttr($oldSequenceAttr);
                    }

                    $oldPersistentLayersIds = $seq->getPersistentLayers();
                    if(isset($oldPersistentLayersIds)) {
                        $newPersistentLayersIds = array();
                        foreach($oldPersistentLayersIds as $oldPersistentLayer) {
                            if (!isset($layersIdTranslation[$oldPersistentLayer])) {                            
                                $oldLayer = $this->getContainer()->get('doctrine')->getRepository('ZeegaDataBundle:Layer')->findOneById($oldPersistentLayer);
                                if (isset($oldLayer)) {
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
                            }
                            if (isset($layersIdTranslation[$oldPersistentLayer])) {
                                array_push($newPersistentLayersIds, (string)$layersIdTranslation[$oldPersistentLayer]);    
                            }                            
                        }
                        $oldSequenceAttr["persistent_layers"] = $newPersistentLayersIds;
                        $mongoSequence->setPersistentLayers($newPersistentLayersIds);
                    }
                    
                    $mongoSequence->setFrames($sequenceFrames);
                    $mongoProject->addSequence($mongoSequence);
                }
                //$output->writeln("Saving the new project");
                $dm->persist($mongoProject);
                $dm->flush();
                $dm->clear();
                //$output->writeln("New project saved");
            }
        }
    
    }

    private function fixProjectsUser(OutputInterface $output) {
        /*$dm = $this->getContainer()->get('doctrine_mongodb')->getManager();
        $minId = 1;
        $maxId = 100;
        $increment = 100;

        while (1) {
            $mongoUsers = $dm->createQueryBuilder('ZeegaDataBundle:User')
                ->field('oldId')->gt($minId)
                ->field('oldId')->lt($maxId)
                ->getQuery()
                ->execute();

            if (!isset($mongoUsers)) {
                break;
            }   

            foreach($mongoUsers as $mongoUser) {
                $id = $mongoUser->getId();
                $oldId = $mongoUser->getOldId();
                $userItems = $dm->createQueryBuilder('ZeegaDataBundle:Item')
                    ->field('userId')->equals($oldId)
                    ->getQuery()
                    ->execute();

                foreach($userItems as $userItem) {
                    $userItem->setUser($mongoUser);
                    $dm->persist($userItem);
                }
                $dm->flush();

                echo "$id - $oldId \n";
            }
            $dm->clear();
            $minId = $minId + $increment;
            $maxId = $maxId + $increment; 
        }*/
        $dm = $this->getContainer()->get('doctrine_mongodb')->getManager();
        $mongoUsers = $dm->getRepository('ZeegaDataBundle:User')->findAll();

        foreach($mongoUsers as $mongoUser) {
            $id = $mongoUser->getId();
            $oldId = $mongoUser->getOldId();
            $userItems = $dm->createQueryBuilder('ZeegaDataBundle:Item')
                ->field('userId')->equals($oldId)
                ->getQuery()
                ->execute();

            foreach($userItems as $userItem) {
                $userItem->setUser($mongoUser);
                $dm->persist($userItem);
            }
            $dm->flush();
            echo "$id - $oldId \n";
            $dm->clear();
        }      
    }
}
