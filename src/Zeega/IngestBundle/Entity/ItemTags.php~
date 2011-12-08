<?php

namespace Zeega\IngestBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\IngestBundle\Entity\ItemTags
 */
class ItemTags
{
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