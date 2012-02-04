<?php

namespace Zeega\UserBundle\Entity;

use FOS\UserBundle\Entity\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\UserBundle\Entity\User
 */
class User extends BaseUser

{
	   /**
     * Constructs a new instance of User
     */
    public function __construct()
    {
		parent::__construct();
        $this->created_at = new \DateTime();
    }

    /**
     * @var integer $id
     */
    protected $id;

    /**
     * @var string $display_name
     */
    protected $display_name;

    /**
     * @var text $bio
     */
    protected $bio;

    /**
     * @var string $thumb_url
     */
    protected $thumb_url;

    /**
     * @var datetime $created_at
     */
    protected $created_at;
	

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
     * Set display_name
     *
     * @param string $displayName
     */
    public function setDisplayName($displayName)
    {
        $this->display_name = $displayName;
    }

    /**
     * Get display_name
     *
     * @return string 
     */
    public function getDisplayName()
    {
        return $this->display_name;
    }

    /**
     * Set bio
     *
     * @param text $bio
     */
    public function setBio($bio)
    {
        $this->bio = $bio;
    }

    /**
     * Get bio
     *
     * @return text 
     */
    public function getBio()
    {
        return $this->bio;
    }

    /**
     * Set thumb_url
     *
     * @param string $thumbUrl
     */
    public function setThumbUrl($thumbUrl)
    {
        $this->thumb_url = $thumbUrl;
    }

    /**
     * Get thumb_url
     *
     * @return string 
     */
    public function getThumbUrl()
    {
        return $this->thumb_url;
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
     * @var Zeega\EditorBundle\Entity\Playground
     */
    private $playgrounds;


    /**
     * Add playgrounds
     *
     * @param Zeega\EditorBundle\Entity\Playground $playgrounds
     */
    public function addPlayground(\Zeega\EditorBundle\Entity\Playground $playgrounds)
    {
        $this->playgrounds[] = $playgrounds;
    }

    /**
     * Get playgrounds
     *
     * @return Doctrine\Common\Collections\Collection 
     */
    public function getPlaygrounds()
    {
        return $this->playgrounds;
    }
}