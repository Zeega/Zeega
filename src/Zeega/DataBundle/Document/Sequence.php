<?php

namespace Zeega\DataBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\EmbeddedDocument
 */
class Sequence
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
     * @MongoDB\Hash
     */
    protected $attr;

    /**
     * @MongoDB\Boolean
     */
    protected $enabled = true;

    /**
     * @MongoDB\Field(name="persistent_layers")
     * @MongoDB\Hash
     */
    protected $persistentLayers;

    /**
     * @MongoDB\String
     */
    protected $description;

    /**
     * @MongoDB\String
     */
    protected $soundtrack;

    /**
     * @MongoDB\Field(name="advance_to")
     * @MongoDB\Int
     */
    protected $advanceTo;

    /**
     * @MongoDB\Collection(strategy="pushAll")
     */
    protected $frames;

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
     * Get id
     *
     * @return id $id
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }
    
    /**
     * Set title
     *
     * @param string $title
     * @return \Sequence
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
     * Set attr
     *
     * @param hash $attr
     * @return \Sequence
     */
    public function setAttr($attr)
    {
        $this->attr = $attr;
        return $this;
    }

    /**
     * Get attr
     *
     * @return hash $attr
     */
    public function getAttr()
    {
        return $this->attr;
    }

    /**
     * Set enabled
     *
     * @param boolean $enabled
     * @return \Sequence
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
     * Set persistentLayers
     *
     * @param hash $persistentLayers
     * @return \Sequence
     */
    public function setPersistentLayers($persistentLayers)
    {
        $this->persistentLayers = $persistentLayers;
        return $this;
    }

    /**
     * Get persistentLayers
     *
     * @return hash $persistentLayers
     */
    public function getPersistentLayers()
    {
        return $this->persistentLayers;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return \Sequence
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
     * Set advanceTo
     *
     * @param int $advanceTo
     * @return \Sequence
     */
    public function setAdvanceTo($advanceTo)
    {
        $this->advanceTo = $advanceTo;
        return $this;
    }

    /**
     * Get advanceTo
     *
     * @return int $advanceTo
     */
    public function getAdvanceTo()
    {
        return $this->advanceTo;
    }

    /**
     * Set frames
     *
     * @param collection $frames
     * @return \Sequence
     */
    public function setFrames($frames)
    {
        $this->frames = $frames;
        return $this;
    }

    /**
     * Get frames
     *
     * @return collection $frames
     */
    public function getFrames()
    {
        return $this->frames;
    }

    /**
     * Set soundtrack
     *
     * @param string $soundtrack
     * @return self
     */
    public function setSoundtrack($soundtrack)
    {
        $this->soundtrack = $soundtrack;
        return $this;
    }

    /**
     * Get soundtrack
     *
     * @return string $soundtrack
     */
    public function getSoundtrack()
    {
        return $this->soundtrack;
    }
}
