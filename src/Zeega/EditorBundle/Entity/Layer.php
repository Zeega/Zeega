<?php

// src/Zeega/EditorBundle/Entity/Layer.php

namespace Zeega\EditorBundle\Entity;

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
     * @var Zeega\UserBundle\Entity\User
     */
    private $user;

    /**
     * @var Zeega\IngestBundle\Entity\Item
     */
    private $item;

    /**
     * @var Zeega\EditorBundle\Entity\Layer
     */
    private $below;

    /**
     * @var Zeega\EditorBundle\Entity\Layer
     */
    private $above;

    /**
     * @var Zeega\EditorBundle\Entity\Node
     */
    private $node;


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
     * @param Zeega\UserBundle\Entity\User $user
     */
    public function setUser(\Zeega\UserBundle\Entity\User $user)
    {
        $this->user = $user;
    }

    /**
     * Get user
     *
     * @return Zeega\UserBundle\Entity\User 
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set item
     *
     * @param Zeega\IngestBundle\Entity\Item $item
     */
    public function setItem(\Zeega\IngestBundle\Entity\Item $item)
    {
        $this->item = $item;
    }

    /**
     * Get item
     *
     * @return Zeega\IngestBundle\Entity\Item 
     */
    public function getItem()
    {
        return $this->item;
    }

    /**
     * Set below
     *
     * @param Zeega\EditorBundle\Entity\Layer $below
     */
    public function setBelow(\Zeega\EditorBundle\Entity\Layer $below)
    {
        $this->below = $below;
    }

    /**
     * Get below
     *
     * @return Zeega\EditorBundle\Entity\Layer 
     */
    public function getBelow()
    {
        return $this->below;
    }

    /**
     * Set above
     *
     * @param Zeega\EditorBundle\Entity\Layer $above
     */
    public function setAbove(\Zeega\EditorBundle\Entity\Layer $above)
    {
        $this->above = $above;
    }

    /**
     * Get above
     *
     * @return Zeega\EditorBundle\Entity\Layer 
     */
    public function getAbove()
    {
        return $this->above;
    }

    /**
     * Set node
     *
     * @param Zeega\EditorBundle\Entity\Node $node
     */
    public function setNode(\Zeega\EditorBundle\Entity\Node $node)
    {
        $this->node = $node;
    }

    /**
     * Get node
     *
     * @return Zeega\EditorBundle\Entity\Node 
     */
    public function getNode()
    {
        return $this->node;
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