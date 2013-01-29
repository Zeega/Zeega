<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Entity\User as BaseUser;

/**
 * @ORM\Table(name="zuser")
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 */
class User extends BaseUser
{
     /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected $id;

    /**
     * @var string
     *
     * @ORM\Column(name="display_name", type="string", length=255, nullable=true)
     */
    private $displayName;

    /**
     * @var string
     *
     * @ORM\Column(name="bio", type="text", nullable=true)
     */
    private $bio;

    /**
     * @var string
     *
     * @ORM\Column(name="thumb_url", type="string", length=255, nullable=true)
     */
    private $thumbUrl;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=true)
     */
    private $createdAt;

    /**
     * @var string
     *
     * @ORM\Column(name="location", type="string", length=140, nullable=true)
     */
    private $location;

    /**
     * @var float
     *
     * @ORM\Column(name="location_latitude", type="float", nullable=true)
     */
    private $locationLatitude;

    /**
     * @var float
     *
     * @ORM\Column(name="location_longitude", type="float", nullable=true)
     */
    private $locationLongitude;

    /**
     * @var string
     *
     * @ORM\Column(name="background_image_url", type="string", length=255, nullable=true)
     */
    private $backgroundImageUrl;

    /**
     * @var string
     *
     * @ORM\Column(name="dropbox_delta", type="string", length=255, nullable=true)
     */
    private $dropboxDelta;

    /**
     * @var string
     *
     * @ORM\Column(name="idea", type="text", nullable=true)
     */
    private $idea;

    /**
     * @var string
     *
     * @ORM\Column(name="api_key", type="string", length=25, nullable=true)
     */
    private $apiKey;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Project", mappedBy="user")
     */
    private $project;

    /**
     * @var string
     *
     * @ORM\Column(name="twitter_id", type="string", nullable=true)
     */
    private $twitterId;

    /**
     * @var string
     *
     * @ORM\Column(name="twitter_username", type="string", nullable=true)
     */

    private $twitterUsername;
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->project = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /** 
     * @ORM\PrePersist
     */
    public function onPrePersist()
    {
        $this->setCreatedAt(new \DateTime("now"));

        if( !isset($this->thumbUrl) ) {
            $this->setThumbUrl("http://static.zeega.org/community/templates/default_profile.jpeg");
        }
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
     * Set displayName
     *
     * @param string $displayName
     * @return User
     */
    public function setDisplayName($displayName)
    {
        $this->displayName = $displayName;
    
        return $this;
    }

    /**
     * Get displayName
     *
     * @return string 
     */
    public function getDisplayName()
    {
        return $this->displayName;
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
     * Set thumbUrl
     *
     * @param string $thumbUrl
     * @return User
     */
    public function setThumbUrl($thumbUrl)
    {
        $this->thumbUrl = $thumbUrl;
    
        return $this;
    }

    /**
     * Get thumbUrl
     *
     * @return string 
     */
    public function getThumbUrl()
    {
        return $this->thumbUrl;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return User
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
    
        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime 
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
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
     * Set locationLatitude
     *
     * @param float $locationLatitude
     * @return User
     */
    public function setLocationLatitude($locationLatitude)
    {
        $this->locationLatitude = $locationLatitude;
    
        return $this;
    }

    /**
     * Get locationLatitude
     *
     * @return float 
     */
    public function getLocationLatitude()
    {
        return $this->locationLatitude;
    }

    /**
     * Set locationLongitude
     *
     * @param float $locationLongitude
     * @return User
     */
    public function setLocationLongitude($locationLongitude)
    {
        $this->locationLongitude = $locationLongitude;
    
        return $this;
    }

    /**
     * Get locationLongitude
     *
     * @return float 
     */
    public function getLocationLongitude()
    {
        return $this->locationLongitude;
    }

    /**
     * Set backgroundImageUrl
     *
     * @param string $backgroundImageUrl
     * @return User
     */
    public function setBackgroundImageUrl($backgroundImageUrl)
    {
        $this->backgroundImageUrl = $backgroundImageUrl;
    
        return $this;
    }

    /**
     * Get backgroundImageUrl
     *
     * @return string 
     */
    public function getBackgroundImageUrl()
    {
        return $this->backgroundImageUrl;
    }

    /**
     * Set dropboxDelta
     *
     * @param string $dropboxDelta
     * @return User
     */
    public function setDropboxDelta($dropboxDelta)
    {
        $this->dropboxDelta = $dropboxDelta;
    
        return $this;
    }

    /**
     * Get dropboxDelta
     *
     * @return string 
     */
    public function getDropboxDelta()
    {
        return $this->dropboxDelta;
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
     * Set apiKey
     *
     * @param string $apiKey
     * @return User
     */
    public function setApiKey($apiKey)
    {
        $this->apiKey = $apiKey;
    
        return $this;
    }

    /**
     * Get apiKey
     *
     * @return string 
     */
    public function getApiKey()
    {
        return $this->apiKey;
    }

    /**
     * Set twitterId
     *
     * @param string $twitterId
     * @return User
     */
    public function setTwitterId($twitterId)
    {
        $this->twitterId = $twitterId;
    
        return $this;
    }

    /**
     * Get twitterId
     *
     * @return string 
     */
    public function getTwitterId()
    {
        return $this->twitterId;
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

    /**
     * Add project
     *
     * @param \Zeega\DataBundle\Entity\Project $project
     * @return User
     */
    public function addProject(\Zeega\DataBundle\Entity\Project $project)
    {
        $this->project[] = $project;
    
        return $this;
    }

    /**
     * Remove project
     *
     * @param \Zeega\DataBundle\Entity\Project $project
     */
    public function removeProject(\Zeega\DataBundle\Entity\Project $project)
    {
        $this->project->removeElement($project);
    }

    /**
     * Get project
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getProject()
    {
        return $this->project;
    }
}