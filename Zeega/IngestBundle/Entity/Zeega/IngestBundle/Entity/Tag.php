<?php

namespace Zeega\IngestBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\IngestBundle\Entity\Tag
 */
class Tag
{
    /**
     * @var integer $item_id
     */
    private $item_id;

    /**
     * @var bigint $tag_id
     */
    private $tag_id;

    /**
     * @var date $tag_date_created
     */
    private $tag_date_created;

    /**
     * @var bigint $tag_user
     */
    private $tag_user;

    /**
     * @var text $tag_description
     */
    private $tag_description;

    /**
     * @var Zeega\UserBundle\Entity\User
     */
    private $user;

    /**
     * @var Zeega\IngestBundle\Entity\ItemTags
     */
    private $items;

    public function __construct()
    {
        $this->items = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Get item_id
     *
     * @return integer 
     */
    public function getItemId()
    {
        return $this->item_id;
    }

    /**
     * Get tag_id
     *
     * @return bigint 
     */
    public function getTagId()
    {
        return $this->tag_id;
    }

    /**
     * Set tag_date_created
     *
     * @param date $tagDateCreated
     */
    public function setTagDateCreated($tagDateCreated)
    {
        $this->tag_date_created = $tagDateCreated;
    }

    /**
     * Get tag_date_created
     *
     * @return date 
     */
    public function getTagDateCreated()
    {
        return $this->tag_date_created;
    }

    /**
     * Set tag_user
     *
     * @param bigint $tagUser
     */
    public function setTagUser($tagUser)
    {
        $this->tag_user = $tagUser;
    }

    /**
     * Get tag_user
     *
     * @return bigint 
     */
    public function getTagUser()
    {
        return $this->tag_user;
    }

    /**
     * Set tag_description
     *
     * @param text $tagDescription
     */
    public function setTagDescription($tagDescription)
    {
        $this->tag_description = $tagDescription;
    }

    /**
     * Get tag_description
     *
     * @return text 
     */
    public function getTagDescription()
    {
        return $this->tag_description;
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
     * Add items
     *
     * @param Zeega\IngestBundle\Entity\ItemTags $items
     */
    public function addItemTags(\Zeega\IngestBundle\Entity\ItemTags $items)
    {
        $this->items[] = $items;
    }

    /**
     * Get items
     *
     * @return Doctrine\Common\Collections\Collection 
     */
    public function getItems()
    {
        return $this->items;
    }
}