<?php

namespace Zeega\DataBundle\EventListener;

use Doctrine\ODM\MongoDB\Event\LifecycleEventArgs;
use Zeega\DataBundle\Document\Project;

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
        }
    }

    public function preUpdate(LifecycleEventArgs $args)
    {
        $document = $args->getDocument();
        
        // perhaps you only want to act on some "Product" document
        if ($document instanceof Project) {
            $document->setDateUpdated(new \DateTime("now"));
            $dm = $args->getDocumentManager();
            $class = $dm->getClassMetadata("Zeega\DataBundle\Document\Project");
            $dm->getUnitOfWork()->recomputeSingleDocumentChangeSet($class, $document);
        }
    }
}
