<?php

namespace Zeega\UserBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="user")
 */
class User implements UserInterface

{

	   /**
     * Constructs a new instance of User
     */
    public function __construct()
    {
        $this->created_at = new \DateTime();
    }
 
 
 
    /**
     * @var integer $id
     */
    private $id;

    /**
     * @var string $username
     */
    private $username;

    /**
     * @var string $first_name
     */
    private $first_name;

    /**
     * @var string $last_name
     */
    private $last_name;

    /**
     * @var string $password
     */
    private $password;

    /**
     * @var string $email
     */
    private $email;

    /**
     * @var string $salt
     */
    private $salt;

    /**
     * @var datetime $created_at
     */
    private $created_at;

    /**
     * @var array $user_roles
     */
    private $user_roles;


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
     * Set username
     *
     * @param string $username
     */
    public function setUsername($username)
    {
        $this->username = $username;
    }

    /**
     * Get username
     *
     * @return string 
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * Set first_name
     *
     * @param string $firstName
     */
    public function setFirstName($firstName)
    {
        $this->first_name = $firstName;
    }

    /**
     * Get first_name
     *
     * @return string 
     */
    public function getFirstName()
    {
        return $this->first_name;
    }

    /**
     * Set last_name
     *
     * @param string $lastName
     */
    public function setLastName($lastName)
    {
        $this->last_name = $lastName;
    }

    /**
     * Get last_name
     *
     * @return string 
     */
    public function getLastName()
    {
        return $this->last_name;
    }

    /**
     * Set password
     *
     * @param string $password
     */
    public function setPassword($password)
    {
        $this->password = $password;
    }

    /**
     * Get password
     *
     * @return string 
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Set email
     *
     * @param string $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * Get email
     *
     * @return string 
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set salt
     *
     * @param string $salt
     */
    public function setSalt($salt)
    {
        $this->salt = $salt;
    }

    /**
     * Get salt
     *
     * @return string 
     */
    public function getSalt()
    {
        return $this->salt;
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
     * Compares this user to another to determine if they are the same.
     * 
     * @param UserInterface $user The user
     * @return boolean True if equal, false othwerwise.
     */
    public function equals(UserInterface $user)
    {
        return md5($this->getUsername()) == md5($user->getUsername());
    }
    

    
     /**
     * Erases the user credentials.
     */
    public function eraseCredentials()
    {
 
    }
   
    /**
     * Get roles
     *
     * @return array 
     */
    public function getRoles()
    {
         return array($this->getUserRoles());
    }

    /**
     * Set user_roles
     *
     * @param text $userRoles
     */
    public function setUserRoles($userRoles)
    {
        $this->user_roles = $userRoles;
    }

    /**
     * Get user_roles
     *
     * @return text 
     */
    public function getUserRoles()
    {
        return $this->user_roles;
    }
    /**
     * @var Zeega\EditorBundle\Entity\Group
     */
  
    /**
     * @var Zeega\EditorBundle\Entity\Project
     */
    private $projects;


    /**
     * Add projects
     *
     * @param Zeega\EditorBundle\Entity\Project $projects
     */
    public function addProject(\Zeega\EditorBundle\Entity\Project $projects)
    {
        $this->projects[] = $projects;
    }

    /**
     * Get projects
     *
     * @return Doctrine\Common\Collections\Collection 
     */
    public function getProjects()
    {
        return $this->projects;
    }
    /**
     * @var Zeega\EditorBundle\Entity\Playground
     */
    private $playgrounds;


    /**
     * Add playgrounds
     *
     * @param Zeega\EditorBundle\Entity\Playground $playground
     */
    public function addPlayground(\Zeega\EditorBundle\Entity\Playground $playground)
    {
        $this->playgrounds[] = $playground;
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
    /**
     * @var string $display_name
     */
    private $display_name;


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
     * Add playgrounds
     *
     * @param Zeega\EditorBundle\Entity\Playground $playgrounds
     */
    public function addPlaygrounds(\Zeega\EditorBundle\Entity\Playground $playgrounds)
    {
        $this->playgrounds[] = $playgrounds;
    }

    /**
     * Add projects
     *
     * @param Zeega\EditorBundle\Entity\Project $projects
     */
    public function addProjects(\Zeega\EditorBundle\Entity\Project $projects)
    {
        $this->projects[] = $projects;
    }
    /**
     * @var string $bio
     */
    private $bio;

    /**
     * @var string $thumb_url
     */
    private $thumb_url;


    /**
     * Set bio
     *
     * @param string $bio
     */
    public function setBio($bio)
    {
        $this->bio = $bio;
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
}