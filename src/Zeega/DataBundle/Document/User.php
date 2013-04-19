<?php

namespace Zeega\DataBundle\Document;

use FOS\UserBundle\Document\User as BaseUser;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document
 */
class User extends BaseUser
{
    /**
     * @MongoDB\Id(strategy="auto")
     */
    protected $id;

    /**
     * @MongoDB\String
     */
    protected $displayName;

    /**
     * @MongoDB\String
     */
    protected $bio;

    /**
     * @MongoDB\String
     */
    protected $thumbUrl;

    /**
     * @MongoDB\Date
     */
    protected $createdAt;

    /**
     * @MongoDB\String
     */
    protected $location;

    /**
     * @MongoDB\Float
     */
    protected $locationLatitude;

    /**
     * @MongoDB\Float
     */
    protected $locationLongitude;

    /**
     * @MongoDB\String
     */
    protected $backgroundImageUrl;

    /**
     * @MongoDB\String
     */
    protected $dropboxDelta;

    /**
     * @MongoDB\String
     */
    protected $idea;

    /**
     * @MongoDB\String
     */
    protected $apiKey;

    /**
     * @MongoDB\String
     */
    protected $twitterId;

    /**
     * @MongoDB\String
     */
    protected $twitterUsername;

    /**
     * @MongoDB\String
     */
    protected $facebookId;

    /**
     * @MongoDB\Int
     */
    protected $oldId;

    public function __construct()
    {
        parent::__construct();
        // your own logic
    }

    /**
     * Get id
     *
     * @return id $id
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }
    
    /**
     * Get id
     *
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set displayName
     *
     * @param string $displayName
     * @return \User
     */
    public function setDisplayName($displayName)
    {
        $this->displayName = $displayName;
        return $this;
    }

    /**
     * Get displayName
     *
     * @return string $displayName
     */
    public function getDisplayName()
    {
        return $this->displayName;
    }

    /**
     * Set bio
     *
     * @param string $bio
     * @return \User
     */
    public function setBio($bio)
    {
        $this->bio = $bio;
        return $this;
    }

    /**
     * Get bio
     *
     * @return string $bio
     */
    public function getBio()
    {
        return $this->bio;
    }

    /**
     * Set thumbUrl
     *
     * @param string $thumbUrl
     * @return \User
     */
    public function setThumbUrl($thumbUrl)
    {
        $this->thumbUrl = $thumbUrl;
        return $this;
    }

    /**
     * Get thumbUrl
     *
     * @return string $thumbUrl
     */
    public function getThumbUrl()
    {
        return $this->thumbUrl;
    }

    /**
     * Set createdAt
     *
     * @param date $createdAt
     * @return \User
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * Get createdAt
     *
     * @return date $createdAt
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set location
     *
     * @param string $location
     * @return \User
     */
    public function setLocation($location)
    {
        $this->location = $location;
        return $this;
    }

    /**
     * Get location
     *
     * @return string $location
     */
    public function getLocation()
    {
        return $this->location;
    }

    /**
     * Set locationLatitude
     *
     * @param float $locationLatitude
     * @return \User
     */
    public function setLocationLatitude($locationLatitude)
    {
        $this->locationLatitude = $locationLatitude;
        return $this;
    }

    /**
     * Get locationLatitude
     *
     * @return float $locationLatitude
     */
    public function getLocationLatitude()
    {
        return $this->locationLatitude;
    }

    /**
     * Set locationLongitude
     *
     * @param float $locationLongitude
     * @return \User
     */
    public function setLocationLongitude($locationLongitude)
    {
        $this->locationLongitude = $locationLongitude;
        return $this;
    }

    /**
     * Get locationLongitude
     *
     * @return float $locationLongitude
     */
    public function getLocationLongitude()
    {
        return $this->locationLongitude;
    }

    /**
     * Set backgroundImageUrl
     *
     * @param string $backgroundImageUrl
     * @return \User
     */
    public function setBackgroundImageUrl($backgroundImageUrl)
    {
        $this->backgroundImageUrl = $backgroundImageUrl;
        return $this;
    }

    /**
     * Get backgroundImageUrl
     *
     * @return string $backgroundImageUrl
     */
    public function getBackgroundImageUrl()
    {
        return $this->backgroundImageUrl;
    }

    /**
     * Set dropboxDelta
     *
     * @param string $dropboxDelta
     * @return \User
     */
    public function setDropboxDelta($dropboxDelta)
    {
        $this->dropboxDelta = $dropboxDelta;
        return $this;
    }

    /**
     * Get dropboxDelta
     *
     * @return string $dropboxDelta
     */
    public function getDropboxDelta()
    {
        return $this->dropboxDelta;
    }

    /**
     * Set idea
     *
     * @param string $idea
     * @return \User
     */
    public function setIdea($idea)
    {
        $this->idea = $idea;
        return $this;
    }

    /**
     * Get idea
     *
     * @return string $idea
     */
    public function getIdea()
    {
        return $this->idea;
    }

    /**
     * Set apiKey
     *
     * @param string $apiKey
     * @return \User
     */
    public function setApiKey($apiKey)
    {
        $this->apiKey = $apiKey;
        return $this;
    }

    /**
     * Get apiKey
     *
     * @return string $apiKey
     */
    public function getApiKey()
    {
        return $this->apiKey;
    }

    /**
     * Set twitterId
     *
     * @param string $twitterId
     * @return \User
     */
    public function setTwitterId($twitterId)
    {
        $this->twitterId = $twitterId;
        return $this;
    }

    /**
     * Get twitterId
     *
     * @return string $twitterId
     */
    public function getTwitterId()
    {
        return $this->twitterId;
    }

    /**
     * Set twitterUsername
     *
     * @param string $twitterUsername
     * @return \User
     */
    public function setTwitterUsername($twitterUsername)
    {
        $this->twitterUsername = $twitterUsername;
        return $this;
    }

    /**
     * Get twitterUsername
     *
     * @return string $twitterUsername
     */
    public function getTwitterUsername()
    {
        return $this->twitterUsername;
    }

    /**
     * Set facebookId
     *
     * @param string $facebookId
     * @return \User
     */
    public function setFacebookId($facebookId)
    {
        $this->facebookId = $facebookId;
        return $this;
    }

    /**
     * Get facebookId
     *
     * @return string $facebookId
     */
    public function getFacebookId()
    {
        return $this->facebookId;
    }

    /**
     * Set oldId
     *
     * @param int $oldId
     * @return \User
     */
    public function setOldId($oldId)
    {
        $this->oldId = $oldId;
        return $this;
    }

    /**
     * Get oldId
     *
     * @return int $oldId
     */
    public function getOldId()
    {
        return $this->oldId;
    }

    // DELETE

    /**
     * Set salt
     *
     * @param string $oldId
     * @return \User
     */
    public function setSalt($salt)
    {
        $this->salt = $salt;
        return $this;
    }

    /**
     * Set salt
     *
     * @param string $oldId
     * @return \User
     */
    public function setPassword($password)
    {
        $this->password = $password;
        return $this;
    }
}
