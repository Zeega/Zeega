<?php

// src/Zeega/DataBundle/Entity/Layer.php

namespace Zeega\DataBundle\Entity;

class Layer
{
 
 
  
    /**
     * @var integer $id
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
     * @var Zeega\DataBundle\Entity\User
     */
    private $user;

    /**
     * @var Zeega\DataBundle\Entity\Item
     */
    private $item;

    /**
     * @var Zeega\DataBundle\Entity\Layer
     */
    private $below;

    /**
     * @var Zeega\DataBundle\Entity\Layer
     */
    private $above;

    /**
     * @var Zeega\DataBundle\Entity\Frame
     */
    private $frame;


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
     * Set user
     *
     * @param Zeega\DataBundle\Entity\User $user
     */
    public function setUser(\Zeega\DataBundle\Entity\User $user)
    {
        $this->user = $user;
    }

    /**
     * Get user
     *
     * @return Zeega\DataBundle\Entity\User 
     */
    public function getUser()
    {
        return $this->user;
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
     * Set below
     *
     * @param Zeega\DataBundle\Entity\Layer $below
     */
    public function setBelow(\Zeega\DataBundle\Entity\Layer $below)
    {
        $this->below = $below;
    }

    /**
     * Get below
     *
     * @return Zeega\DataBundle\Entity\Layer 
     */
    public function getBelow()
    {
        return $this->below;
    }

    /**
     * Set above
     *
     * @param Zeega\DataBundle\Entity\Layer $above
     */
    public function setAbove(\Zeega\DataBundle\Entity\Layer $above)
    {
        $this->above = $above;
    }

    /**
     * Get above
     *
     * @return Zeega\DataBundle\Entity\Layer 
     */
    public function getAbove()
    {
        return $this->above;
    }

    /**
     * Set frame
     *
     * @param Zeega\DataBundle\Entity\Frame $frame
     */
    public function setFrame(\Zeega\DataBundle\Entity\Frame $frame)
    {
        $this->frame = $frame;
    }

    /**
     * Get frame
     *
     * @return Zeega\DataBundle\Entity\Frame 
     */
    public function getFrame()
    {
        return $this->frame;
    }
    /**
     * @var array $attr
     */
    private $attr;


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
     * @var integer $zindex
     */
    private $zindex;


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
    
  
}