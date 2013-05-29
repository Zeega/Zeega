<?php

namespace Zeega\DataBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document(repositoryClass="Zeega\DataBundle\Repository\FavoriteRepository")
 */
class Favorite
{
    /**
     * @MongoDB\Id
     */
    protected $id;

    /**     
     * @MongoDB\Id
     * @MongoDB\ReferenceOne(targetDocument="User", inversedBy="favorite")
     */
    protected $user;

    /**
     * @MongoDB\Id
     * @MongoDB\ReferenceOne(targetDocument="Project", inversedBy="favorite")
     */
    protected $project;

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
     * Set user
     *
     * @param Zeega\DataBundle\Document\User $user
     * @return self
     */
    public function setUser(\Zeega\DataBundle\Document\User $user)
    {
        $this->user = $user;
        return $this;
    }

    /**
     * Get user
     *
     * @return Zeega\DataBundle\Document\User $user
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set project
     *
     * @param Zeega\DataBundle\Document\Project $project
     * @return self
     */
    public function setProject(\Zeega\DataBundle\Document\Project $project)
    {
        $this->project = $project;
        return $this;
    }

    /**
     * Get project
     *
     * @return Zeega\DataBundle\Document\Project $project
     */
    public function getProject()
    {
        return $this->project;
    }
}
