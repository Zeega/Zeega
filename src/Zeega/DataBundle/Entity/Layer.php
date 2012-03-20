<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\DataBundle\Entity\Layer
 */
class Layer
{
    /**
     * @var bigint $id
     */
    private $id;

    /**
     * @var string $type
     */
    private $type;

    /**
     * @var string $text
     */
    private $text;

    /**
     * @var array $attributes
     */
    private $attributes;

    /**
     * @var Zeega\DataBundle\Entity\Item
     */
    private $item;

    /**
     * @var Zeega\DataBundle\Entity\Sequence
     */
    private $sequences;

    public function __construct()
    {
        $this->sequences = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Get id
     *
     * @return bigint 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set type
     *
     * @param string $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * Get type
     *
     * @return string 
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set text
     *
     * @param string $text
     */
    public function setText($text)
    {
        $this->text = $text;
    }

    /**
     * Get text
     *
     * @return string 
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * Set attributes
     *
     * @param array $attributes
     */
    public function setAttributes($attributes)
    {
        $this->attributes = $attributes;
    }

    /**
     * Get attributes
     *
     * @return array 
     */
    public function getAttributes()
    {
        return $this->attributes;
    }

    /**
     * Set item
     *
     * @param Zeega\DataBundle\Entity\Item $item
     */
    public function setItem(\Zeega\DataBundle\Entity\Item $item)
    {
        $this->item = $item;
    }

    /**
     * Get item
     *
     * @return Zeega\DataBundle\Entity\Item 
     */
    public function getItem()
    {
        return $this->item;
    }

    /**
     * Add sequences
     *
     * @param Zeega\DataBundle\Entity\Sequence $sequences
     */
    public function addSequence(\Zeega\DataBundle\Entity\Sequence $sequences)
    {
        $this->sequences[] = $sequences;
    }

    /**
     * Get sequences
     *
     * @return Doctrine\Common\Collections\Collection 
     */
    public function getSequences()
    {
        return $this->sequences;
    }
}