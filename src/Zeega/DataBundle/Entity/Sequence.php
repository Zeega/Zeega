<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\DataBundle\Entity\Sequence
 */
class Sequence
{
    /**
     * @var integer $id
     */
    private $id;

    /**
     * @var integer $project_id
     */
    private $project_id;

    /**
     * @var string $frames
     */
    private $frames;

    /**
     * @var string $title
     */
    private $title;

    /**
     * @var array $attr
     */
    private $attr;

    /**
     * @var Zeega\DataBundle\Entity\Project
     */
    private $project;


    /**
     * Get id
     *
     * @return integer 
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
     * Set frames
     *
     * @param string $frames
     */
    public function setFrames($frames)
    {
        $this->frames = $frames;
    }

    /**
     * Get frames
     *
     * @return string 
     */
    public function getFrames()
    {
        return $this->frames;
    }

    /**
     * Set title
     *
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * Get title
     *
     * @return string 
     */
    public function getTitle()
    {
        return $this->title;
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
     * @var array $persistent_layers
     */
    private $persistent_layers;


    /**
     * Set persistent_layers
     *
     * @param array $persistentLayers
     */
    public function setPersistentLayers($persistentLayers)
    {
        $this->persistent_layers = $persistentLayers;
    }

    /**
     * Get persistent_layers
     *
     * @return array 
     */
    public function getPersistentLayers()
    {
        return $this->persistent_layers;
    }
    /**
     * @var string $description
     */
    private $description;

    /**
     * @var integer $advance_to
     */
    private $advance_to;

    /**
     * @var Zeega\DataBundle\Entity\Sequence
     */
    private $advance;


    /**
     * Set description
     *
     * @param string $description
     * @return Sequence
     */
    public function setDescription($description)
    {
        $this->description = $description;
    
        return $this;
    }

    /**
     * Get description
     *
     * @return string 
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set advance_to
     *
     * @param integer $advanceTo
     * @return Sequence
     */
    public function setAdvanceTo($advanceTo)
    {
        $this->advance_to = $advanceTo;
    
        return $this;
    }

    /**
     * Get advance_to
     *
     * @return integer 
     */
    public function getAdvanceTo()
    {
        return $this->advance_to;
    }

    /**
     * Set advance
     *
     * @param Zeega\DataBundle\Entity\Sequence $advance
     * @return Sequence
     */
    public function setAdvance(\Zeega\DataBundle\Entity\Sequence $advance = null)
    {
        $this->advance = $advance;
    
        return $this;
    }

    /**
     * Get advance
     *
     * @return Zeega\DataBundle\Entity\Sequence 
     */
    public function getAdvance()
    {
        return $this->advance;
    }
}