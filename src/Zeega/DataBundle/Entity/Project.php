<?php

// src/Zeega/DataBundle/Entity/Project.php

namespace Zeega\DataBundle\Entity;

class Project
{
 
 
  	   /**
     * Constructs a new instance of Project
     */
    public function __construct()
    {
        $this->created_at = new \DateTime();
    }
 
    /**
     * @var integer $id
     */
    private $id;

    /**
     * @var string $title
     */
    private $title;


    /**
     * @var datetime $created_at
     */
    private $created_at;


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
     * Set created_at
     *
     * @param datetime $createdAt
     */
    public function setCreatedAt($createdAt)
    {
        $this->created_at = $createdAt;
    }

    /**
     * Get created_at
     *
     * @return datetime 
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }







    /**
     * Set playground
     *
     * @param Zeega\DataBundle\Entity\Playground $playground
     */
    public function setPlayground(\Zeega\DataBundle\Entity\Playground $playground)
    {
        $this->playground = $playground;
    }

    /**
     * Get playground
     *
     * @return Zeega\DataBundle\Entity\Playground 
     */
    public function getPlayground()
    {
        return $this->playground;
    }
    /**
     * @var boolean $published
     */
    private $published;


    /**
     * Set published
     *
     * @param boolean $published
     */
    public function setPublished($published)
    {
        $this->published = $published;
    }

    /**
     * Get published
     *
     * @return boolean 
     */
    public function getPublished()
    {
        return $this->published;
    }
    /**
     * @var Zeega\DataBundle\Entity\User
     */
    private $users;


    /**
     * Add users
     *
     * @param Zeega\DataBundle\Entity\User $users
     */
    public function addUsers(\Zeega\DataBundle\Entity\User $users)
    {
        $this->users[] = $users;
    }

    /**
     * Get users
     *
     * @return Doctrine\Common\Collections\Collection 
     */
    public function getUsers()
    {
        return $this->users;
    }
    /**
     * @var Zeega\DataBundle\Entity\Playground
     */
    private $playground;



    /**
     * Add users
     *
     * @param Zeega\DataBundle\Entity\User $users
     */
    public function addUser(\Zeega\DataBundle\Entity\User $users)
    {
        $this->users[] = $users;
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