<?php

// src/Zeega/EditorBundle/Entity/Route.php

namespace Zeega\EditorBundle\Entity;

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
     * @var Zeega\UserBundle\Entity\User
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
     * @var Zeega\EditorBundle\Entity\Project
     */
    private $project;


    /**
     * Set project
     *
     * @param Zeega\EditorBundle\Entity\Project $project
     */
    public function setProject(\Zeega\EditorBundle\Entity\Project $project)
    {
        $this->project = $project;
    }

    /**
     * Get project
     *
     * @return Zeega\EditorBundle\Entity\Project 
     */
    public function getProject()
    {
        return $this->project;
    }
    /**
     * @var Zeega\EditorBundle\Entity\Layer
     */
    private $layers;

    public function __construct()
    {
        $this->layers = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Add layers
     *
     * @param Zeega\EditorBundle\Entity\Layer $layers
     */
    public function addLayer(\Zeega\EditorBundle\Entity\Layer $layers)
    {
        $this->layers[] = $layers;
    }
}