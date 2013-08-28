<?php

namespace Zeega\DataBundle\EventListener;

use Doctrine\ODM\MongoDB\Event\LifecycleEventArgs;
use Zeega\DataBundle\Document\Project;
use Zeega\DataBundle\Document\User;

class DateUpdateListener
{
    public function __construct($idService) 
    {
        $this->idService = $idService;
    }

    public function prePersist(LifecycleEventArgs $args)
    {
        $document = $args->getDocument();
        // perhaps you only want to act on some "Product" document
        if ($document instanceof Project) {
            $document->setDateUpdated(new \DateTime("now"));
            $document->setDateCreated(new \DateTime("now"));
            $document->setPublicId($this->idService->generateId());
        } else if ($document instanceof User) {
            $document->setCreatedAt(new \DateTime("now"));
        }
    }

    public function preUpdate(LifecycleEventArgs $args)
    {
        $document = $args->getDocument();
        /*
        // perhaps you only want to act on some "Product" document
        if ($document instanceof Project) {
            $dm = $args->getDocumentManager();
            $document->setDateUpdated(new \DateTime("now"));
            $class = $dm->getClassMetadata("Zeega\DataBundle\Document\Project");

            if ( $args->hasChangedField("tags") ) {
                $update = true;
                $oldTags = $args->getOldValue('tags');

                foreach( $oldTags as $tag ) {
                    $name = $tag->getName();
                    $id = $tag->getId();
                    if ($name == 'homepage' && $id !== null) {
                        $update = false;
                        break;    
                    }
                }

                if ($update === true ) {
                    $document->setDateTagsUpdated(new \DateTime("now"));
                }
            }

            $dm->getUnitOfWork()->recomputeSingleDocumentChangeSet($class, $document);
        }
        */
    }
}
