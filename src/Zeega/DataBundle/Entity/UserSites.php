<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\DataBundle\Entity\UserSites
 */
class UserSites
{
    /**
     * @var string $user_role
     */
    private $user_role;

    /**
     * @var Zeega\DataBundle\Entity\User
     */
    private $user;

    /**
     * @var Zeega\DataBundle\Entity\Site
     */
    private $site;


    /**
     * Set user_role
     *
     * @param string $userRole
     */
    public function setUserRole($userRole)
    {
        $this->user_role = $userRole;
    }

    /**
     * Get user_role
     *
     * @return string 
     */
    public function getUserRole()
    {
        return $this->user_role;
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