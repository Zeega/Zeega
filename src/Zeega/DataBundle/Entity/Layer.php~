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
     * @var string $item_uri
     */
    private $item_uri;

    /**
     * @var string $type
     */
    private $type;

    /**
     * @var string $text
     */
    private $text;

    /**
     * @var integer $zindex
     */
    private $zindex;

    /**
     * @var array $attr
     */
    private $attr;

    /**
     * @var Zeega\DataBundle\Entity\Item
     */
    private $item;


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
     * Set item_uri
     *
     * @param string $itemUri
     */
    public function setItemUri($itemUri)
    {
        $this->item_uri = $itemUri;
    }

    /**
     * Get item_uri
     *
     * @return string 
     */
    public function getItemUri()
    {
        return $this->item_uri;
    }

    /**
     * Set type
     *
     * @param string $type
     */
    public function setMediaType($type)
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
     * Set zindex
     *
     * @param integer $zindex
     */
    public function setZindex($zindex)
    {
        $this->zindex = $zindex;
    }

    /**
     * Get zindex
     *
     * @return integer 
     */
    public function getZindex()
    {
        return $this->zindex;
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
     * Set type
     *
     * @param string $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }
    /**
     * @var Zeega\DataBundle\Entity\User
     */
    private $sequences;

    public function __construct()
    {
        $this->sequences = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Add sequences
     *
     * @param Zeega\DataBundle\Entity\User $sequences
     */
    public function addUser(\Zeega\DataBundle\Entity\User $sequences)
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
     * Add sequences
     *
     * @param Zeega\DataBundle\Entity\Sequence $sequences
     */
    public function addSequence(\Zeega\DataBundle\Entity\Sequence $sequences)
    {
        $this->sequences[] = $sequences;
    }
    /**
     * @var array $attributes
     */
    private $attributes;


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
}