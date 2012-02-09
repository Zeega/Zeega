<?php

// src/Zeega/DataBundle/Entity/Route.php

namespace Zeega\DataBundle\Entity;

class Route
{
 
 
    
    /**
     * @var integer $id
     */
    private $id;

    /**
     * @var string $title
     */
    private $title;

    /**
     * @var Zeega\DataBundle\Entity\User
     */
    private $user;


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
     * @var Zeega\DataBundle\Entity\Project
     */
    private $project;


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
     * @var Zeega\DataBundle\Entity\Layer
     */
    private $layers;

    public function __construct()
    {
        $this->layers = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Add layers
     *
     * @param Zeega\DataBundle\Entity\Layer $layers
     */
    public function addLayers(\Zeega\DataBundle\Entity\Layer $layers)
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
     * Add layers
     *
     * @param Zeega\DataBundle\Entity\Layer $layers
     */
    public function addLayer(\Zeega\DataBundle\Entity\Layer $layers)
    {
        $this->layers[] = $layers;
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
}