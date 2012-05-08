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
     * @var array $attr
     */
    private $attr;

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
     * Set attr
     *
     * @param array $attr
     */
    public function setAttr($attr)
    {
        $this->attr = $attr;
    }

    /**
     * Get attr
     *
     * @return array 
     */
    public function getAttr()
    {
        return $this->attr;
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
    /**
     * @var Zeega\DataBundle\Entity\Frame
     */
    private $frames;


    /**
     * Add frames
     *
     * @param Zeega\DataBundle\Entity\Frame $frames
     */
    public function addFrame(\Zeega\DataBundle\Entity\Frame $frames)
    {
        $this->frames[] = $frames;
    }

    /**
     * Get frames
     *
     * @return Doctrine\Common\Collections\Collection 
     */
    public function getFrames()
    {
        return $this->frames;
    }
    /**
     * @var Zeega\DataBundle\Entity\Project
     */
    private $project;


    /**
     * Set project
     *
     * @param Zeega\DataBundle\Entity\Project $project
     */
    public function setProject(\Zeega\DataBundle\Entity\Project $project)
    {
        $this->project = $project;
    }

    /**
     * Get project
     *
     * @return Zeega\DataBundle\Entity\Project 
     */
    public function getProject()
    {
        return $this->project;
    }
}