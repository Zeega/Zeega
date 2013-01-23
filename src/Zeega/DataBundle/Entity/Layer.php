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
     * @var integer $project_id
     */
    private $project_id;

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
     * @var Zeega\DataBundle\Entity\Project
     */
    private $project;


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
     * Set project_id
     *
     * @param integer $projectId
     */
    public function setProjectId($projectId)
    {
        $this->project_id = $projectId;
    }

    /**
     * Get project_id
     *
     * @return integer 
     */
    public function getProjectId()
    {
        return $this->project_id;
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
    /**
     * @var Zeega\DataBundle\Entity\Frame
     */
    private $frames;

    public function __construct()
    {
        $this->frames = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
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

	public function __toString()
	{
	    return strval($this->id);
	}
    /**
     * @var boolean $enabled
     */
    private $enabled = true;


    /**
     * Set enabled
     *
     * @param boolean $enabled
     */
    public function setEnabled($enabled)
    {
        $this->enabled = $enabled;
    }

    /**
     * Get enabled
     *
     * @return boolean 
     */
    public function getEnabled()
    {
        return $this->enabled;
    }

    /**
     * Set project_id
     *
     * @param integer $project_id
     * @return Layer
     */
    public function setProject_id($project_id)
    {
        $this->project_id = $project_id;
    
        return $this;
    }

    /**
     * Get project_id
     *
     * @return integer 
     */
    public function getProject_id()
    {
        return $this->project_id;
    }
}