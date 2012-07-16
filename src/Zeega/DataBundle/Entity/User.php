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
    protected $bio ="Zeega is better known by the pseudonym Dziga Vertov. Born Denis Abelevich Kaufman in 1896. Father was a librarian. In 1916, started one of the world's first ?Laboratories of Hearing? to experiment with sound as art. In the 1920s, Kaufman adopted the name 'Dziga Vertov', which translates loosely as 'spinning top' and also was chosen because it makes the 'z-z-z-z' sound when cranking a camera.";

    /**
     * @var string $thumb_url
     */
    protected $thumb_url = "http://mlhplayground.org/gamma-james/images/vertov.jpeg";

    /**
     * @var datetime $created_at
     */
    protected $created_at;

    /**
     * @var string $user_type
     */
    protected $user_type;

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
     * @var string $dropbox_delta
     */
    private $dropbox_delta;


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
}