<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Frame
 *
 * @ORM\Table(
 *      name="frame",
 *      indexes={
 *          @ORM\Index(name="frame_enabled", columns={"enabled"}),
 *          @ORM\Index(name="frame_project_id_index", columns={"project_id"})
 *      }
 * )
 * @ORM\Entity(repositoryClass= "Zeega\DataBundle\Repository\FrameRepository")
 */
class Frame
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
     * @var integer
     *
     * @ORM\Column(name="sequence_index", type="integer", nullable=true)
     */
    private $sequenceIndex;

    /**
     * @var array
     *
     * @ORM\Column(name="layers", type="array", nullable=true)
     */
    private $layers;

    /**
     * @var array
     *
     * @ORM\Column(name="attr", type="array", nullable=true)
     */
    private $attr;

    /**
     * @var string
     *
     * @ORM\Column(name="thumbnail_url", type="string", length=101, nullable=true)
     */
    private $thumbnailUrl;

    /**
     * @var boolean
     *
     * @ORM\Column(name="enabled", type="boolean", nullable=true)
     */
    private $enabled;

    /**
     * @var boolean
     *
     * @ORM\Column(name="controllable", type="boolean", nullable=true)
     */
    private $controllable;

    /**
     * @var \Sequence
     *
     * @ORM\ManyToOne(targetEntity="Sequence")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="sequence_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     * })
     */
    private $sequence;

    /**
     * @var \Project
     *
     * @ORM\ManyToOne(targetEntity="Project")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="project_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
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
     * Set sequenceIndex
     *
     * @param integer $sequenceIndex
     * @return Frame
     */
    public function setSequenceIndex($sequenceIndex)
    {
        $this->sequenceIndex = $sequenceIndex;
    
        return $this;
    }

    /**
     * Get sequenceIndex
     *
     * @return integer 
     */
    public function getSequenceIndex()
    {
        return $this->sequenceIndex;
    }

    /**
     * Set layers
     *
     * @param array $layers
     * @return Frame
     */
    public function setLayers($layers)
    {
        $this->layers = $layers;
    
        return $this;
    }

    /**
     * Get layers
     *
     * @return array 
     */
    public function getLayers()
    {
        return $this->layers;
    }

    /**
     * Set attr
     *
     * @param array $attr
     * @return Frame
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
     * Set thumbnailUrl
     *
     * @param string $thumbnailUrl
     * @return Frame
     */
    public function setThumbnailUrl($thumbnailUrl)
    {
        $this->thumbnailUrl = $thumbnailUrl;
    
        return $this;
    }

    /**
     * Get thumbnailUrl
     *
     * @return string 
     */
    public function getThumbnailUrl()
    {
        return $this->thumbnailUrl;
    }

    /**
     * Set enabled
     *
     * @param boolean $enabled
     * @return Frame
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
     * Set controllable
     *
     * @param boolean $controllable
     * @return Frame
     */
    public function setControllable($controllable)
    {
        $this->controllable = $controllable;
    
        return $this;
    }

    /**
     * Get controllable
     *
     * @return boolean 
     */
    public function getControllable()
    {
        return $this->controllable;
    }

    /**
     * Set sequence
     *
     * @param \Zeega\DataBundle\Entity\Sequence $sequence
     * @return Frame
     */
    public function setSequence(\Zeega\DataBundle\Entity\Sequence $sequence)
    {
        $this->sequence = $sequence;
    
        return $this;
    }

    /**
     * Get sequence
     *
     * @return \Zeega\DataBundle\Entity\Sequence 
     */
    public function getSequence()
    {
        return $this->sequence;
    }

    /**
     * Set project
     *
     * @param \Zeega\DataBundle\Entity\Project $project
     * @return Frame
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