<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\DataBundle\Entity\Tag
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
     * @var datetime $date_created
     */
    private $date_created;

    /**
     * @var text $description
     */
    private $description;

    /**
     * @var Zeega\DataBundle\Entity\ItemTags
     */
    private $item;

    public function __construct()
    {
        $this->item = new \Doctrine\Common\Collections\ArrayCollection();
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
     * @param datetime $dateCreated
     */
    public function setDateCreated($dateCreated)
    {
        $this->date_created = $dateCreated;
    }

    /**
     * Get date_created
     *
     * @return datetime 
     */
    public function getDateCreated()
    {
        return $this->date_created;
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
     * @param Zeega\DataBundle\Entity\ItemTags $item
     */
    public function addItemTags(\Zeega\DataBundle\Entity\ItemTags $item)
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