<?php

namespace Zeega\DataBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document
 */
class Project
{
    /**
     * @MongoDB\Id(strategy="auto")
     */
    protected $id;

    /**
     * @MongoDB\String
     */
    protected $title;

    /**
     * @MongoDB\Boolean
     */
    protected $published;

    /**
     * @MongoDB\Boolean
     */
    protected $mobile;

    /**
     * @MongoDB\Date
     */
    protected $dateCreated;

    /**
     * @MongoDB\Boolean
     */
    protected $enabled = true;

    /**
     * @MongoDB\Hash
     */
    protected $tags;

    /**
     * @MongoDB\String
     */
    protected $authors;

    /**
     * @MongoDB\String
     */
    protected $coverImage;

    /**
     * @MongoDB\String
     */
    protected $estimatedTime;

    /**
     * @MongoDB\Date
     */
    protected $dateUpdated;

    /**
     * @MongoDB\String
     */
    protected $itemId;

    /**
     * @MongoDB\String
     */
    protected $description;

    /**
     * @MongoDB\String
     */
    protected $location;

    /**
     * @MongoDB\Date
     */
    protected $datePublished;

    /**
     * @MongoDB\ReferenceMany(targetDocument="User", simple=true)
     */    
    protected $users;   

    /**
     * @MongoDB\EmbedMany(targetDocument="Sequence")
     */
    protected $sequences;

    /**
     * @MongoDB\EmbedMany(targetDocument="Frame")
     */
    protected $frames;

    /**
     * @MongoDB\EmbedMany(targetDocument="Layer")
     */
    protected $layers;
    public function __construct()
    {
        $this->users = new \Doctrine\Common\Collections\ArrayCollection();
        $this->sequences = new \Doctrine\Common\Collections\ArrayCollection();
        $this->frames = new \Doctrine\Common\Collections\ArrayCollection();
        $this->layers = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Get id
     *
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return \Project
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * Get title
     *
     * @return string $title
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set published
     *
     * @param boolean $published
     * @return \Project
     */
    public function setPublished($published)
    {
        $this->published = $published;
        return $this;
    }

    /**
     * Get published
     *
     * @return boolean $published
     */
    public function getPublished()
    {
        return $this->published;
    }

    /**
     * Set mobile
     *
     * @param boolean $mobile
     * @return \Project
     */
    public function setMobile($mobile)
    {
        $this->mobile = $mobile;
        return $this;
    }

    /**
     * Get mobile
     *
     * @return boolean $mobile
     */
    public function getMobile()
    {
        return $this->mobile;
    }

    /**
     * Set dateCreated
     *
     * @param date $dateCreated
     * @return \Project
     */
    public function setDateCreated($dateCreated)
    {
        $this->dateCreated = $dateCreated;
        return $this;
    }

    /**
     * Get dateCreated
     *
     * @return date $dateCreated
     */
    public function getDateCreated()
    {
        return $this->dateCreated;
    }

    /**
     * Set enabled
     *
     * @param boolean $enabled
     * @return \Project
     */
    public function setEnabled($enabled)
    {
        $this->enabled = $enabled;
        return $this;
    }

    /**
     * Get enabled
     *
     * @return boolean $enabled
     */
    public function getEnabled()
    {
        return $this->enabled;
    }

    /**
     * Set tags
     *
     * @param hash $tags
     * @return \Project
     */
    public function setTags($tags)
    {
        $this->tags = $tags;
        return $this;
    }

    /**
     * Get tags
     *
     * @return hash $tags
     */
    public function getTags()
    {
        return $this->tags;
    }

    /**
     * Set authors
     *
     * @param string $authors
     * @return \Project
     */
    public function setAuthors($authors)
    {
        $this->authors = $authors;
        return $this;
    }

    /**
     * Get authors
     *
     * @return string $authors
     */
    public function getAuthors()
    {
        return $this->authors;
    }

    /**
     * Set coverImage
     *
     * @param string $coverImage
     * @return \Project
     */
    public function setCoverImage($coverImage)
    {
        $this->coverImage = $coverImage;
        return $this;
    }

    /**
     * Get coverImage
     *
     * @return string $coverImage
     */
    public function getCoverImage()
    {
        return $this->coverImage;
    }

    /**
     * Set estimatedTime
     *
     * @param string $estimatedTime
     * @return \Project
     */
    public function setEstimatedTime($estimatedTime)
    {
        $this->estimatedTime = $estimatedTime;
        return $this;
    }

    /**
     * Get estimatedTime
     *
     * @return string $estimatedTime
     */
    public function getEstimatedTime()
    {
        return $this->estimatedTime;
    }

    /**
     * Set dateUpdated
     *
     * @param date $dateUpdated
     * @return \Project
     */
    public function setDateUpdated($dateUpdated)
    {
        $this->dateUpdated = $dateUpdated;
        return $this;
    }

    /**
     * Get dateUpdated
     *
     * @return date $dateUpdated
     */
    public function getDateUpdated()
    {
        return $this->dateUpdated;
    }

    /**
     * Set itemId
     *
     * @param string $itemId
     * @return \Project
     */
    public function setItemId($itemId)
    {
        $this->itemId = $itemId;
        return $this;
    }

    /**
     * Get itemId
     *
     * @return string $itemId
     */
    public function getItemId()
    {
        return $this->itemId;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return \Project
     */
    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }

    /**
     * Get description
     *
     * @return string $description
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set location
     *
     * @param string $location
     * @return \Project
     */
    public function setLocation($location)
    {
        $this->location = $location;
        return $this;
    }

    /**
     * Get location
     *
     * @return string $location
     */
    public function getLocation()
    {
        return $this->location;
    }

    /**
     * Set datePublished
     *
     * @param date $datePublished
     * @return \Project
     */
    public function setDatePublished($datePublished)
    {
        $this->datePublished = $datePublished;
        return $this;
    }

    /**
     * Get datePublished
     *
     * @return date $datePublished
     */
    public function getDatePublished()
    {
        return $this->datePublished;
    }

    /**
     * Add users
     *
     * @param Zeega\DataBundle\Document\User $users
     */
    public function addUsers(\Zeega\DataBundle\Document\User $users)
    {
        $this->users[] = $users;
    }

    /**
     * Get users
     *
     * @return Doctrine\Common\Collections\Collection $users
     */
    public function getUsers()
    {
        return $this->users;
    }

    /**
     * Add sequences
     *
     * @param Zeega\DataBundle\Document\Sequence $sequences
     */
    public function addSequences(\Zeega\DataBundle\Document\Sequence $sequences)
    {
        $this->sequences[] = $sequences;
    }

    /**
     * Get sequences
     *
     * @return Doctrine\Common\Collections\Collection $sequences
     */
    public function getSequences()
    {
        return $this->sequences;
    }

    /**
     * Add frames
     *
     * @param Zeega\DataBundle\Document\Frame $frames
     */
    public function addFrames(\Zeega\DataBundle\Document\Frame $frames)
    {
        $this->frames[] = $frames;
    }

    /**
     * Get frames
     *
     * @return Doctrine\Common\Collections\Collection $frames
     */
    public function getFrames()
    {
        return $this->frames;
    }

    /**
     * Add layers
     *
     * @param Zeega\DataBundle\Document\Layer $layers
     */
    public function addLayers(\Zeega\DataBundle\Document\Layer $layers)
    {
        $this->layers[] = $layers;
    }

    /**
     * Get layers
     *
     * @return Doctrine\Common\Collections\Collection $layers
     */
    public function getLayers()
    {
        return $this->layers;
    }
}
