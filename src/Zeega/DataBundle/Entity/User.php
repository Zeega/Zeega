<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Entity\User as BaseUser;

/**
 * Zeega\DataBundle\Entity\User
 */
 
 class User extends BaseUser
 {
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
     * @var string $user_type
     */
    protected $user_type;

    /**
     * @var string $location
     */
    protected $location;

    /**
     * @var float $location_latitude
     */
    protected $location_latitude;

    /**
     * @var float $location_longitude
     */
    protected $location_longitude;

    /**
     * @var string $background_image_url
     */
    protected $background_image_url;

    /**
     * @var string $dropbox_delta
     */
    protected $dropbox_delta;

    /**
     * @var Zeega\DataBundle\Entity\Site
     */
    protected $sites;

    public function __construct()
    {
        parent::__construct();
        $this->sites = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set user_type
     *
     * @param string $userType
     */
    public function setUserType($userType)
    {
        $this->user_type = $userType;
    }

    /**
     * Get user_type
     *
     * @return string 
     */
    public function getUserType()
    {
        return $this->user_type;
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
     * Set location_latitude
     *
     * @param float $locationLatitude
     */
    public function setLocationLatitude($locationLatitude)
    {
        $this->location_latitude = $locationLatitude;
    }

    /**
     * Get location_latitude
     *
     * @return float 
     */
    public function getLocationLatitude()
    {
        return $this->location_latitude;
    }

    /**
     * Set location_longitude
     *
     * @param float $locationLongitude
     */
    public function setLocationLongitude($locationLongitude)
    {
        $this->location_longitude = $locationLongitude;
    }

    /**
     * Get location_longitude
     *
     * @return float 
     */
    public function getLocationLongitude()
    {
        return $this->location_longitude;
    }

    /**
     * Set background_image_url
     *
     * @param string $backgroundImageUrl
     */
    public function setBackgroundImageUrl($backgroundImageUrl)
    {
        $this->background_image_url = $backgroundImageUrl;
    }

    /**
     * Get background_image_url
     *
     * @return string 
     */
    public function getBackgroundImageUrl()
    {
        return $this->background_image_url;
    }

    /**
     * Set dropbox_delta
     *
     * @param string $dropboxDelta
     */
    public function setDropboxDelta($dropboxDelta)
    {
        $this->dropbox_delta = $dropboxDelta;
    }

    /**
     * Get dropbox_delta
     *
     * @return string 
     */
    public function getDropboxDelta()
    {
        return $this->dropbox_delta;
    }

    /**
     * Add sites
     *
     * @param Zeega\DataBundle\Entity\Site $sites
     */
    public function addSite(\Zeega\DataBundle\Entity\Site $sites)
    {
        $this->sites[] = $sites;
    }

    /**
     * Get sites
     *
     * @return Doctrine\Common\Collections\Collection 
     */
    public function getSites()
    {
        return $this->sites;
    }
    /**
     * @var text $idea
     */
    private $idea;


    /**
     * Set idea
     *
     * @param text $idea
     */
    public function setIdea($idea)
    {
        $this->idea = $idea;
    }

    /**
     * Get idea
     *
     * @return text 
     */
    public function getIdea()
    {
        return $this->idea;
    }

    /**
     * Remove sites
     *
     * @param Zeega\DataBundle\Entity\Site $sites
     */
    public function removeSite(\Zeega\DataBundle\Entity\Site $sites)
    {
        $this->sites->removeElement($sites);
    }
}