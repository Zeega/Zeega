<?php
namespace Zeega\DataBundle\Service;

use Zeega\DataBundle\Document\Item;
use Zeega\DataBundle\Document\Project;
use Zeega\DataBundle\Document\Sequence;
use Zeega\DataBundle\Document\Frame;
use Zeega\DataBundle\Document\Layer;

class ProjectService
{
    public function __construct($doctrine) {
        $this->doctrine = $doctrine;
    }
    // not in use yet    
    public function createEmptyProject( $title, $version ) {
        $frame = new Frame();
        $frame->setId(new \MongoId());
        $frame->setEnabled(true);
        $frame->setLayers(array());
        
        $sequence = new Sequence();
        $sequence->setEnabled(true);
        $sequence->setFrames(array((string)$frame->getId()));
        
        $project= new Project();
        $project->setDateCreated(new \DateTime("now"));
        $project->setEnabled(true);
        $project->setPublished(false);
        $project->setAuthors($user->getDisplayName());
        $project->setUser($user);
        $project->setMobile(true);
        $project->setVersion($version);
        $project->addSequence($sequence);
        $project->addFrame($frame);
        
        if( isset($title) ) {
            $project->setTitle($title);
        }

        if( isset($version) ) {
            $project->setVersion($version);
        }

        $dm = $this->doctrine->getManager();
        $dm->persist($project);
        $dm->clear();

        return $project;
    }

    public function createRemixProject( $pagesNumber = 5, $parentProject, $user ) {
        // copy the project
        $newProject = clone $parentProject;
        $newProject->setUser($user);

        // clear the original project layers, frames, sequences
        $newProject->setLayers(new \Doctrine\Common\Collections\ArrayCollection());
        $newProject->setFrames(new \Doctrine\Common\Collections\ArrayCollection());
        $newProject->setSequences(new \Doctrine\Common\Collections\ArrayCollection());
        
        // create a new sequence and frames
        $sequence = new Sequence();
        $sequence->setEnabled(true);
        
        $frames = array();
        while($pagesNumber > 0) {
            $frame = new Frame();
            $frame->setId(new \MongoId());
            $frame->setEnabled(true);
            $frame->setLayers(array());

            $newProject->addFrame($frame);
            $frames[] = (string)$frame->getId();
            --$pagesNumber;
        }
        
        $sequence->setFrames($frames);

        // get the soundtrack from the original project
        $parentProjectSequences = $parentProject->getSequences();
        if ( isset($parentProjectSequences) && $parentProjectSequences->count() > 0 ) {
            $soundtrackSequence = $parentProjectSequences[0];
            $soundtrackSequenceAttributes = $soundtrackSequence->getAttr();

            if( isset($soundtrackSequenceAttributes) && isset($soundtrackSequenceAttributes["soundtrack"]) ) {
                $soundtrackLayerId = $soundtrackSequenceAttributes["soundtrack"];
                $sequence->setAttr(array("soundtrack" => $soundtrackLayerId));

                $soundtrackLayer = $parentProject->getLayers()->filter(
                    function($layr) use ($soundtrackLayerId){
                        return $layr->getId() == $soundtrackLayerId;
                    }
                )->first();
                
                $newProject->addLayer($soundtrackLayer);
            }
        }

        $newProject->setParentProject($parentProject);
        $rootProject = $parentProject->getRootProject();
        
        if ( isset($rootProject) ) {            
            $newProject->setRootProject($parentProject->getRootProject());
        } else {
            $newProject->setRootProject($parentProject);
        }

        $newProject->addSequence($sequence);
        
        // persist the project
        $dm = $this->doctrine->getManager();
        $dm->persist($newProject);
        $dm->flush();
        $dm->clear();

        return $newProject;
    }
}
