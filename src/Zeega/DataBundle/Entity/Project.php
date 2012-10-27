<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\DataBundle\Entity\Project
 */
class Project
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
     * @var datetime $date_created
     */
    private $date_created;

    /**
     * @var array $attr
     */
     
    private $date_published;

    /**
     * @var array $attr
     */
     
    private $attr;

    /**
     * @var boolean $enabled
     */
    private $enabled;

    /**
     * @var boolean $published
     */
    private $published;

    /**
     * @var Zeega\DataBundle\Entity\Site
     */
    private $site;

    /**
     * @var Zeega\DataBundle\Entity\User
     */
    private $users;

    public function __construct()
    {
        $this->users = new \Doctrine\Common\Collections\ArrayCollection();
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

    /**
     * Set enabled
     *
     * @param boolean $enabled
     */
    public function setEnabled($enabled)
    {
        $this->enabled = $enabled;
    }

    /**
     * Get enabled
     *
     * @return boolean 
     */
    public function getEnabled()
    {
        return $this->enabled;
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
     * Set site
     *
     * @param Zeega\DataBundle\Entity\Site $site
     */
    public function setSite(\Zeega\DataBundle\Entity\Site $site)
    {
        $this->site = $site;
    }

    /**
     * Get site
     *
     * @return Zeega\DataBundle\Entity\Site 
     */
    public function getSite()
    {
        return $this->site;
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
     * @var array $tags
     */
    private $tags;


    /**
     * Set tags
     *
     * @param array $tags
     */
    public function setTags($tags)
    {
        $this->tags = $tags;
    }

    /**
     * Get tags
     *
     * @return array 
     */
    public function getTags()
    {
        return $this->tags;
    }
    /**
     * @var string $authors
     */
    private $authors;

    /**
     * @var string $cover_image
     */
    private $cover_image = "http://static.zeega.org/community/templates/default_project_cover.png";


    /**
     * Set authors
     *
     * @param string $authors
     */
    public function setAuthors($authors)
    {
        $this->authors = $authors;
    }

    /**
     * Get authors
     *
     * @return string 
     */
    public function getAuthors()
    {
        return $this->authors;
    }

    /**
     * Set cover_image
     *
     * @param string $coverImage
     */
    public function setCoverImage($coverImage)
    {
        $this->cover_image = $coverImage;
    }

    /**
     * Get cover_image
     *
     * @return string 
     */
    public function getCoverImage()
    {
        return $this->cover_image;
    }
    /**
     * @var string $estimated_time
     */
    private $estimated_time;


    /**
     * Set estimated_time
     *
     * @param string $estimatedTime
     */
    public function setEstimatedTime($estimatedTime)
    {
        $this->estimated_time = $estimatedTime;
    }

    /**
     * Get estimated_time
     *
     * @return string 
     */
    public function getEstimatedTime()
    {
        return $this->estimated_time;
    }
    /**
     * @var datetime $date_updated
     */
    private $date_updated;


    /**
     * Set date_updated
     *
     * @param datetime $dateUpdated
     */
    public function setDateUpdated($dateUpdated)
    {
        $this->date_updated = $dateUpdated;
    }

    /**
     * Get date_updated
     *
     * @return datetime 
     */
    public function getDateUpdated()
    {
        return $this->date_updated;
    }
    
    
        /**
     * Get date_published
     *
     * @return datetime 
     */
    public function getDatePublished()
    {
        return $this->date_published;
    }
    
    
        /**
     * Set date_published
     *
     * @param datetime $datePublished
     */
    public function setDatePublished($datePublished)
    {
        $this->date_published = $datePublished;
    }
    
    
    /**
     * @var string $item_id
     */
    private $item_id;


    /**
     * Set item_id
     *
     * @param string $itemId
     */
    public function setItemId($itemId)
    {
        $this->item_id = $itemId;
    }

    /**
     * Get item_id
     *
     * @return string 
     */
    public function getItemId()
    {
        return $this->item_id;
    }
    /**
     * @var string $description
     */
    private $description;

    /**
     * @var string $location
     */
    private $location;


    /**
     * Set description
     *
     * @param string $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * Get description
     *
     * @return string 
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set location
     *
     * @param string $location
     */
    public function setLocation($location)
    {
        $this->location = $location;
    }

    /**
     * Get location
     *
     * @return string 
     */
    public function getLocation()
    {
        return $this->location;
    }

    /**
     * Remove users
     *
     * @param Zeega\DataBundle\Entity\User $users
     */
    public function removeUser(\Zeega\DataBundle\Entity\User $users)
    {
        $this->users->removeElement($users);
    }
}