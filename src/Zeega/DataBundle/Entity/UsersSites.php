<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\DataBundle\Entity\UsersSites
 */
class UsersSites
{
    /**
     * @var string $user_type
     */
    private $user_type;

    /**
     * @var Zeega\DataBundle\Entity\User
     */
    private $user;

    /**
     * @var Zeega\DataBundle\Entity\Site
     */
    private $site;


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
     * Set user
     *
     * @param Zeega\DataBundle\Entity\User $user
     */
    public function setUser(\Zeega\DataBundle\Entity\User $user)
    {
        $this->user = $user;
    }

    /**
     * Get user
     *
     * @return Zeega\DataBundle\Entity\User 
     */
    public function getUser()
    {
        return $this->user;
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
}