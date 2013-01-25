<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Sequence
 *
 * @ORM\Table(
 *      name="sequence",
 *      indexes={
 *          @ORM\Index(name="sequence_enabled", columns={"enabled"}),
 *          @ORM\Index(name="sequence_project_id_index", columns={"project_id"})
 *      }
 * )
 * @ORM\Entity(repositoryClass= "Zeega\DataBundle\Repository\SequenceRepository")
 */
class Sequence
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255, nullable=false)
     */
    private $title;

    /**
     * @var array
     *
     * @ORM\Column(name="attr", type="array", nullable=true)
     */
    private $attr;

    /**
     * @var boolean
     *
     * @ORM\Column(name="enabled", type="boolean", nullable=true)
     */
    private $enabled;

    /**
     * @var array
     *
     * @ORM\Column(name="persistent_layers", type="array", nullable=true)
     */
    private $persistentLayers;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=140, nullable=true)
     */
    private $description;

    /**
     * @var integer
     *
     * @ORM\Column(name="advance_to", type="integer", nullable=true)
     */
    private $advanceTo;

    /**
     * @var \Project
     *
     * @ORM\ManyToOne(targetEntity="Project")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="project_id", referencedColumnName="id", onDelete="CASCADE", nullable=false)
     * })
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
     * Set title
     *
     * @param string $title
     * @return Sequence
     */
    public function setTitle($title)
    {
        $this->title = $title;
    
        return $this;
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
     * @return Sequence
     */
    public function setAttr($attr)
    {
        $this->attr = $attr;
    
        return $this;
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
     * Set enabled
     *
     * @param boolean $enabled
     * @return Sequence
     */
    public function setEnabled($enabled)
    {
        $this->enabled = $enabled;
    
        return $this;
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
     * Set persistentLayers
     *
     * @param array $persistentLayers
     * @return Sequence
     */
    public function setPersistentLayers($persistentLayers)
    {
        $this->persistentLayers = $persistentLayers;
    
        return $this;
    }

    /**
     * Get persistentLayers
     *
     * @return array 
     */
    public function getPersistentLayers()
    {
        return $this->persistentLayers;
    }

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
     * Set advanceTo
     *
     * @param integer $advanceTo
     * @return Sequence
     */
    public function setAdvanceTo($advanceTo)
    {
        $this->advanceTo = $advanceTo;
    
        return $this;
    }

    /**
     * Get advanceTo
     *
     * @return integer 
     */
    public function getAdvanceTo()
    {
        return $this->advanceTo;
    }

    /**
     * Set project
     *
     * @param \Zeega\DataBundle\Entity\Project $project
     * @return Sequence
     */
    public function setProject(\Zeega\DataBundle\Entity\Project $project)
    {
        $this->project = $project;
    
        return $this;
    }

    /**
     * Get project
     *
     * @return \Zeega\DataBundle\Entity\Project 
     */
    public function getProject()
    {
        return $this->project;
    }
}