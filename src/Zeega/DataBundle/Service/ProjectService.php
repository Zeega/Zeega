<?php
namespace Zeega\DataBundle\Service;

use Zeega\DataBundle\Document\Item;
use Zeega\DataBundle\Document\Project;
use Zeega\DataBundle\Document\Sequence;
use Zeega\DataBundle\Document\Frame;
use Zeega\DataBundle\Document\Layer;

class ProjectService
{
    public function __construct($itemService) 
    {
        $this->thumbnailService = $itemService;
    }
    
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

        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->persist($project);
        $dm->clear();

        return $project;
    }

    public function createRemixProject( $pageNumber = 5, $parentProject, $user ) {
        // copy the project
        $newProject = clone $parentProject;
        $newProject->setUser($user);

        // clear the original project layers, frames, sequences
        $newProject->layers->clear();
        $newProject->frames->clear();
        $newProject->sequences->clear();
        
        // create a new sequence and frames
        $sequence = new Sequence();
        $sequence->setEnabled(true);
        
        while($pageNumber-- > 0) {
            $frame = new Frame();
            $frame->setId(new \MongoId());
            $frame->setEnabled(true);
            $frame->setLayers(array());

            $sequence->setFrames(array((string)$frame->getId()));
        }
        
        $newProject->addSequence($sequence);
        
        // persist the project
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->persist($newProject);
        $dm->clear();

        return $newProject;
    }
}
