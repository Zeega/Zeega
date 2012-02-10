<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\DataBundle\Entity\TagCorrelation
 */
class TagCorrelation
{
    /**
     * @var float $correlation_index
     */
    private $correlation_index;

    /**
     * @var Zeega\DataBundle\Entity\Tag
     */
    private $tag;

    /**
     * @var Zeega\DataBundle\Entity\Tag
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
     * @param Zeega\DataBundle\Entity\Tag $tag
     */
    public function setTag(\Zeega\DataBundle\Entity\Tag $tag)
    {
        $this->tag = $tag;
    }

    /**
     * Get tag
     *
     * @return Zeega\DataBundle\Entity\Tag 
     */
    public function getTag()
    {
        return $this->tag;
    }

    /**
     * Set tag_related
     *
     * @param Zeega\DataBundle\Entity\Tag $tagRelated
     */
    public function setTagRelated(\Zeega\DataBundle\Entity\Tag $tagRelated)
    {
        $this->tag_related = $tagRelated;
    }

    /**
     * Get tag_related
     *
     * @return Zeega\DataBundle\Entity\Tag 
     */
    public function getTagRelated()
    {
        return $this->tag_related;
    }
}