<?php

namespace Zeega\IngestBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\IngestBundle\Entity\Tag
 */
class Tag
{
    /**
     * @var bigint $id
     */
    private $id;

    /**
     * @var string $name
     */
    private $name;

    /**
     * @var date $date_created
     */
    private $date_created;

    /**
     * @var bigint $user
     */
    private $user;

    /**
     * @var text $description
     */
    private $description;

    /**
     * @var Zeega\IngestBundle\Entity\ItemTags
     */
    private $item;

    public function __construct()
    {
        $this->item = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Set id
     *
     * @param bigint $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

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
     * Set name
     *
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set date_created
     *
     * @param date $dateCreated
     */
    public function setDateCreated($dateCreated)
    {
        $this->date_created = $dateCreated;
    }

    /**
     * Get date_created
     *
     * @return date 
     */
    public function getDateCreated()
    {
        return $this->date_created;
    }

    /**
     * Set user
     *
     * @param bigint $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * Get user
     *
     * @return bigint 
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set description
     *
     * @param text $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * Get description
     *
     * @return text 
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Add item
     *
     * @param Zeega\IngestBundle\Entity\ItemTags $item
     */
    public function addItemTags(\Zeega\IngestBundle\Entity\ItemTags $item)
    {
        $this->item[] = $item;
    }

    /**
     * Get item
     *
     * @return Doctrine\Common\Collections\Collection 
     */
    public function getItem()
    {
        return $this->item;
    }
}