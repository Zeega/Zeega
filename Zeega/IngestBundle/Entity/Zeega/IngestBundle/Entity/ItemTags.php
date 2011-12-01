<?php

namespace Zeega\IngestBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\IngestBundle\Entity\ItemTags
 */
class ItemTags
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
     * @var Zeega\IngestBundle\Entity\Item
     */
    private $item;

    /**
     * @var Zeega\IngestBundle\Entity\Tag
     */
    private $tag;


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