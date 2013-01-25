<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Task
 *
 * @ORM\Table(
 *      name="task",
 *      indexes={
 *          @ORM\Index(name="user_id_status", columns={"user_id","status"})
 *      }
 * )
 * @ORM\Entity
 */
class Task
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="bigint", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="status", type="string", length=10, nullable=false)
     */
    private $status;

    /**
     * @var string
     *
     * @ORM\Column(name="status_message", type="string", length=250, nullable=true)
     */
    private $statusMessage;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_created", type="datetime", nullable=false)
     */
    private $dateCreated;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_updated", type="datetime", nullable=false)
     */
    private $dateUpdated;

    /**
     * @var user
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * })
     */
    private $user;



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
     * Set status
     *
     * @param string $status
     * @return Task
     */
    public function setStatus($status)
    {
        $this->status = $status;
    
        return $this;
    }

    /**
     * Get status
     *
     * @return string 
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set statusMessage
     *
     * @param string $statusMessage
     * @return Task
     */
    public function setStatusMessage($statusMessage)
    {
        $this->statusMessage = $statusMessage;
    
        return $this;
    }

    /**
     * Get statusMessage
     *
     * @return string 
     */
    public function getStatusMessage()
    {
        return $this->statusMessage;
    }

    /**
     * Set dateCreated
     *
     * @param \DateTime $dateCreated
     * @return Task
     */
    public function setDateCreated($dateCreated)
    {
        $this->dateCreated = $dateCreated;
    
        return $this;
    }

    /**
     * Get dateCreated
     *
     * @return \DateTime 
     */
    public function getDateCreated()
    {
        return $this->dateCreated;
    }

    /**
     * Set dateUpdated
     *
     * @param \DateTime $dateUpdated
     * @return Task
     */
    public function setDateUpdated($dateUpdated)
    {
        $this->dateUpdated = $dateUpdated;
    
        return $this;
    }

    /**
     * Get dateUpdated
     *
     * @return \DateTime 
     */
    public function getDateUpdated()
    {
        return $this->dateUpdated;
    }

    /**
     * Set user
     *
     * @param \Zeega\DataBundle\Entity\User $user
     * @return Task
     */
    public function setUser(\Zeega\DataBundle\Entity\User $user = null)
    {
        $this->user = $user;
    
        return $this;
    }

    /**
     * Get user
     *
     * @return \Zeega\DataBundle\Entity\User 
     */
    public function getUser()
    {
        return $this->user;
    }
}