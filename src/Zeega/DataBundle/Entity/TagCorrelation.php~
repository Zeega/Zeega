<?php

namespace Zeega\IngestBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\IngestBundle\Entity\TagCorrelation
 */
class TagCorrelation
{
    /**
     * @var float $correlation_index
     */
    private $correlation_index;

    /**
     * @var Zeega\IngestBundle\Entity\Tag
     */
    private $tag;

    /**
     * @var Zeega\IngestBundle\Entity\Tag
     */
    private $tag_related;


    /**
     * Set correlation_index
     *
     * @param float $correlationIndex
     */
    public function setCorrelationIndex($correlationIndex)
    {
        $this->correlation_index = $correlationIndex;
    }

    /**
     * Get correlation_index
     *
     * @return float 
     */
    public function getCorrelationIndex()
    {
        return $this->correlation_index;
    }

    /**
     * Set tag
     *
     * @param Zeega\IngestBundle\Entity\Tag $tag
     */
    public function setTag(\Zeega\IngestBundle\Entity\Tag $tag)
    {
        $this->tag = $tag;
    }

    /**
     * Get tag
     *
     * @return Zeega\IngestBundle\Entity\Tag 
     */
    public function getTag()
    {
        return $this->tag;
    }

    /**
     * Set tag_related
     *
     * @param Zeega\IngestBundle\Entity\Tag $tagRelated
     */
    public function setTagRelated(\Zeega\IngestBundle\Entity\Tag $tagRelated)
    {
        $this->tag_related = $tagRelated;
    }

    /**
     * Get tag_related
     *
     * @return Zeega\IngestBundle\Entity\Tag 
     */
    public function getTagRelated()
    {
        return $this->tag_related;
    }
}