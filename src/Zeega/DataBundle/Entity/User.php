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
    private $display_name;

    /**
     * @var string $bio
     */
    private $bio;

    /**
     * @var string $thumb_url
     */
    private $thumb_url = "http://static.zeega.org/community/templates/default_profile.jpeg";

    /**
     * @var \DateTime $created_at
     */
    private $created_at;

    /**
     * @var string $user_type
     */
    private $user_type;

    /**
     * @var string $location
     */
    private $location;

    /**
     * @var float $location_latitude
     */
    private $location_latitude;

    /**
     * @var float $location_longitude
     */
    private $location_longitude;

    /**
     * @var string $background_image_url
     */
    private $background_image_url;

    /**
     * @var string $dropbox_delta
     */
    private $dropbox_delta;

    /**
     * @var string $idea
     */
    private $idea;


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
     * @return User
     */
    public function setDisplayName($displayName)
    {
        $this->display_name = $displayName;
    
        return $this;
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
     * @param string $bio
     * @return User
     */
    public function setBio($bio)
    {
        $this->bio = $bio;
    
        return $this;
    }

    /**
     * Get bio
     *
     * @return string 
     */
    public function getBio()
    {
        return $this->bio;
    }

    /**
     * Set thumb_url
     *
     * @param string $thumbUrl
     * @return User
     */
    public function setThumbUrl($thumbUrl)
    {
        $this->thumb_url = $thumbUrl;
    
        return $this;
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
     * @param \DateTime $createdAt
     * @return User
     */
    public function setCreatedAt($createdAt)
    {
        $this->created_at = $createdAt;
    
        return $this;
    }

    /**
     * Get created_at
     *
     * @return \DateTime 
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * Set user_type
     *
     * @param string $userType
     * @return User
     */
    public function setUserType($userType)
    {
        $this->user_type = $userType;
    
        return $this;
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
     * @return User
     */
    public function setLocation($location)
    {
        $this->location = $location;
    
        return $this;
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
     * @return User
     */
    public function setLocationLatitude($locationLatitude)
    {
        $this->location_latitude = $locationLatitude;
    
        return $this;
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
     * @return User
     */
    public function setLocationLongitude($locationLongitude)
    {
        $this->location_longitude = $locationLongitude;
    
        return $this;
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
     * @return User
     */
    public function setBackgroundImageUrl($backgroundImageUrl)
    {
        $this->background_image_url = $backgroundImageUrl;
    
        return $this;
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
     * @return User
     */
    public function setDropboxDelta($dropboxDelta)
    {
        $this->dropbox_delta = $dropboxDelta;
    
        return $this;
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
     * Set idea
     *
     * @param string $idea
     * @return User
     */
    public function setIdea($idea)
    {
        $this->idea = $idea;
    
        return $this;
    }

    /**
     * Get idea
     *
     * @return string 
     */
    public function getIdea()
    {
        return $this->idea;
    }
    /**
     * @var string $api_key
     */
    private $api_key;


    /**
     * Set api_key
     *
     * @param string $apiKey
     * @return User
     */
    public function setApiKey($apiKey)
    {
        $this->api_key = $apiKey;
    
        return $this;
    }

    /**
     * Get api_key
     *
     * @return string 
     */
    public function getApiKey()
    {
        return $this->api_key;
    }
    /**
     * @var string $twitterID
     */
    private $twitterID;

    /**
     * @var string $twitterUsername
     */
    private $twitterUsername;


    /**
     * Set display_name
     *
     * @param string $display_name
     * @return User
     */
    public function setDisplay_name($display_name)
    {
        $this->display_name = $display_name;
    
        return $this;
    }

    /**
     * Get display_name
     *
     * @return string 
     */
    public function getDisplay_name()
    {
        return $this->display_name;
    }

    /**
     * Set thumb_url
     *
     * @param string $thumb_url
     * @return User
     */
    public function setThumb_url($thumb_url)
    {
        $this->thumb_url = $thumb_url;
    
        return $this;
    }

    /**
     * Get thumb_url
     *
     * @return string 
     */
    public function getThumb_url()
    {
        return $this->thumb_url;
    }

    /**
     * Set created_at
     *
     * @param \DateTime $created_at
     * @return User
     */
    public function setCreated_at($created_at)
    {
        $this->created_at = $created_at;
    
        return $this;
    }

    /**
     * Get created_at
     *
     * @return \DateTime 
     */
    public function getCreated_at()
    {
        return $this->created_at;
    }

    /**
     * Set user_type
     *
     * @param string $user_type
     * @return User
     */
    public function setUser_type($user_type)
    {
        $this->user_type = $user_type;
    
        return $this;
    }

    /**
     * Get user_type
     *
     * @return string 
     */
    public function getUser_type()
    {
        return $this->user_type;
    }

    /**
     * Set location_latitude
     *
     * @param float $location_latitude
     * @return User
     */
    public function setLocation_latitude($location_latitude)
    {
        $this->location_latitude = $location_latitude;
    
        return $this;
    }

    /**
     * Get location_latitude
     *
     * @return float 
     */
    public function getLocation_latitude()
    {
        return $this->location_latitude;
    }

    /**
     * Set location_longitude
     *
     * @param float $location_longitude
     * @return User
     */
    public function setLocation_longitude($location_longitude)
    {
        $this->location_longitude = $location_longitude;
    
        return $this;
    }

    /**
     * Get location_longitude
     *
     * @return float 
     */
    public function getLocation_longitude()
    {
        return $this->location_longitude;
    }

    /**
     * Set background_image_url
     *
     * @param string $background_image_url
     * @return User
     */
    public function setBackground_image_url($background_image_url)
    {
        $this->background_image_url = $background_image_url;
    
        return $this;
    }

    /**
     * Get background_image_url
     *
     * @return string 
     */
    public function getBackground_image_url()
    {
        return $this->background_image_url;
    }

    /**
     * Set dropbox_delta
     *
     * @param string $dropbox_delta
     * @return User
     */
    public function setDropbox_delta($dropbox_delta)
    {
        $this->dropbox_delta = $dropbox_delta;
    
        return $this;
    }

    /**
     * Get dropbox_delta
     *
     * @return string 
     */
    public function getDropbox_delta()
    {
        return $this->dropbox_delta;
    }

    /**
     * Set api_key
     *
     * @param string $api_key
     * @return User
     */
    public function setApi_key($api_key)
    {
        $this->api_key = $api_key;
    
        return $this;
    }

    /**
     * Get api_key
     *
     * @return string 
     */
    public function getApi_key()
    {
        return $this->api_key;
    }

    /**
     * Set twitterID
     *
     * @param string $twitterID
     * @return User
     */
    public function setTwitterID($twitterID)
    {
        $this->twitterID = $twitterID;
    
        return $this;
    }

    /**
     * Get twitterID
     *
     * @return string 
     */
    public function getTwitterID()
    {
        return $this->twitterID;
    }

    /**
     * Set twitterUsername
     *
     * @param string $twitterUsername
     * @return User
     */
    public function setTwitterUsername($twitterUsername)
    {
        $this->twitterUsername = $twitterUsername;
    
        return $this;
    }

    /**
     * Get twitterUsername
     *
     * @return string 
     */
    public function getTwitterUsername()
    {
        return $this->twitterUsername;
    }
}