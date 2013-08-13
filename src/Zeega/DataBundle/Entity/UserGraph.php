<?php
namespace Zeega\DataBundle\Entity;

use HireVoice\Neo4j\Annotation as OGM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @OGM\Entity
 */
class UserGraph
{
    /**
     * The internal node ID from Neo4j must be stored. Thus an Auto field is required
     * @OGM\Auto
     */
    protected $id;

    /**
     * @OGM\Property
     * @OGM\Index
     */
    protected $displayName;

    /**
     * @OGM\Property
     * @OGM\Index
     */
    protected $username;

    /**
     * @OGM\Property
     * @OGM\Index
     */
    protected $mongoId;
    
    /**
     * @OGM\ManyToMany
     */     
    protected $follows;

    public function __construct()
    {
         $this->follows = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /* Add your accessors here */

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
    }


    /**
     * Set displayName
     *
     * @param string $displayName
     * @return \User
     */
    public function setUsername($username)
    {
        $this->username = $username;
    }


    /**
     * Set displayName
     *
     * @param string $displayName
     * @return \User
     */
    public function setMongoId($mongoId)
    {
        $this->mongoId = $mongoId;
    }

    public function addFollower($user)
    {
        if ( !$this->follows->contains($user) ) {
            $this->follows->add($user);
        }
        
        return $this;
    }

}