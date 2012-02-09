<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\DataBundle\Entity\Site
 */
class Site
{
	 
  	   /**
     * Constructs a new instance of Site
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
     * @var string $short
     */
    private $short;

    /**
     * @var boolean $published
     */
    private $published;

    /**
     * @var datetime $created_at
     */
    private $created_at;

    /**
     * @var Zeega\DataBundle\Entity\User
     */
    private $users;

    /**
     * @var Zeega\DataBundle\Entity\User
     */
    private $admins;
    
    
    /**
     * Set id
     *
     * @return integer 
     */
    public function setId($id)
    {
        $this->id = $id;
    }
    
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
     * Set short
     *
     * @param string $short
     */
    public function setShort($short)
    {
        $this->short = $short;
    }

    /**
     * Get short
     *
     * @return string 
     */
    public function getShort()
    {
        return $this->short;
    }

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
     * Add users
     *
     * @param Zeega\DataBundle\Entity\User $users
     */
    public function addUser(\Zeega\DataBundle\Entity\User $users)
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
     * Get admins
     *
     * @return Doctrine\Common\Collections\Collection 
     */
    public function getAdmins()
    {
        return $this->admins;
    }
}