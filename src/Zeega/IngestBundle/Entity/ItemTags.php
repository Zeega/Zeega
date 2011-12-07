<?php

namespace Zeega\IngestBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use DateTime;
/**
 * Zeega\IngestBundle\Entity\ItemTags
 */
class ItemTags
{
    /**
     * @var bigint $item_id
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
     * @var Zeega\UserBundle\Entity\User
     */
    private $user;

    /**
     * @var Zeega\IngestBundle\Entity\Item
     */
    private $item;

    /**
     * @var Zeega\IngestBundle\Entity\Tag
     */
    private $tag;
	    public function __construct()
    {
 
        $this->tag_date_created = new DateTime(NULL);
    }


    /**
     * Set item_id
     *
     * @param bigint $itemId
     */
    public function setItemId($itemId)
    {
        $this->item_id = $itemId;
    }

    /**
     * Get item_id
     *
     * @return bigint 
     */
    public function getItemId()
    {
        return $this->item_id;
    }

    /**
     * Set tag_id
     *
     * @param bigint $tagId
     */
    public function setTagId($tagId)
    {
        $this->tag_id = $tagId;
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
     * Set tag
     *
     * @param Zeega\IngestBundle\Entity\Tag $tag
     */
    public function setTag(\Zeega\IngestBundle\Entity\Tag $tag)
    {
        $this->tag = $tag;
    }

    /**
     * Get tag
     *
     * @return Zeega\IngestBundle\Entity\Tag 
     */
    public function getTag()
    {
        return $this->tag;
    }
}