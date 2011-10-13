<?php

// src/Zeega/EditorBundle/Entity/Node.php

namespace Zeega\EditorBundle\Entity;

class Node
{
 
 
 		   /**
     * Constructs a new instance of Project
     */
    public function __construct()
    {
        $this->created_at = new \DateTime();
    
        $this->thumb_url = "http://mlhplayground.org/gamma-james/images/thumb.png";
    }

    /**
     * @var integer $id
     */
    private $id;

    /**
     * @var integer $route_index
     */
    private $route_index;

    /**
     * @var array $attr
     */
    private $attr;

    /**
     * @var string $thumb_url
     */
    private $thumb_url;

    /**
     * @var Zeega\UserBundle\Entity\User
     */
    private $user;

    /**
     * @var Zeega\EditorBundle\Entity\Route
     */
    private $route;

    /**
     * @var Zeega\EditorBundle\Entity\Node
     */
    private $link_up;

    /**
     * @var Zeega\EditorBundle\Entity\Node
     */
    private $link_down;

    /**
     * @var Zeega\EditorBundle\Entity\Node
     */
    private $link_left;

    /**
     * @var Zeega\EditorBundle\Entity\Node
     */
    private $link_right;

    /**
     * @var Zeega\EditorBundle\Entity\Layer
     */
    private $layers;

  
    
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
     * Set route_index
     *
     * @param integer $routeIndex
     */
    public function setRouteIndex($routeIndex)
    {
        $this->route_index = $routeIndex;
    }

    /**
     * Get route_index
     *
     * @return integer 
     */
    public function getRouteIndex()
    {
        return $this->route_index;
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
     * Set thumb_url
     *
     * @param string $thumbUrl
     */
    public function setThumbUrl($thumbUrl)
    {
        $this->thumb_url = $thumbUrl;
    }

    /**
     * Get thumb_url
     *
     * @return string 
     */
    public function getThumbUrl()
    {
        return $this->thumb_url;
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
     * Set route
     *
     * @param Zeega\EditorBundle\Entity\Route $route
     */
    public function setRoute(\Zeega\EditorBundle\Entity\Route $route)
    {
        $this->route = $route;
    }

    /**
     * Get route
     *
     * @return Zeega\EditorBundle\Entity\Route 
     */
    public function getRoute()
    {
        return $this->route;
    }

    /**
     * Set link_up
     *
     * @param Zeega\EditorBundle\Entity\Node $linkUp
     */
    public function setLinkUp(\Zeega\EditorBundle\Entity\Node $linkUp)
    {
        $this->link_up = $linkUp;
    }

    /**
     * Get link_up
     *
     * @return Zeega\EditorBundle\Entity\Node 
     */
    public function getLinkUp()
    {
        return $this->link_up;
    }

    /**
     * Set link_down
     *
     * @param Zeega\EditorBundle\Entity\Node $linkDown
     */
    public function setLinkDown(\Zeega\EditorBundle\Entity\Node $linkDown)
    {
        $this->link_down = $linkDown;
    }

    /**
     * Get link_down
     *
     * @return Zeega\EditorBundle\Entity\Node 
     */
    public function getLinkDown()
    {
        return $this->link_down;
    }

    /**
     * Set link_left
     *
     * @param Zeega\EditorBundle\Entity\Node $linkLeft
     */
    public function setLinkLeft(\Zeega\EditorBundle\Entity\Node $linkLeft)
    {
        $this->link_left = $linkLeft;
    }

    /**
     * Get link_left
     *
     * @return Zeega\EditorBundle\Entity\Node 
     */
    public function getLinkLeft()
    {
        return $this->link_left;
    }

    /**
     * Set link_right
     *
     * @param Zeega\EditorBundle\Entity\Node $linkRight
     */
    public function setLinkRight(\Zeega\EditorBundle\Entity\Node $linkRight)
    {
        $this->link_right = $linkRight;
    }

    /**
     * Get link_right
     *
     * @return Zeega\EditorBundle\Entity\Node 
     */
    public function getLinkRight()
    {
        return $this->link_right;
    }

    /**
     * Add layers
     *
     * @param Zeega\EditorBundle\Entity\Layer $layers
     */
    public function addLayers(\Zeega\EditorBundle\Entity\Layer $layers)
    {
        $this->layers[] = $layers;
    }

    /**
     * Get layers
     *
     * @return Doctrine\Common\Collections\Collection 
     */
    public function getLayers()
    {
        return $this->layers;
    }

    /**
     * Set layers
     *
     * @param array $layers
     */
    public function setLayers($layers)
    {
        $this->layers = $layers;
    }
}