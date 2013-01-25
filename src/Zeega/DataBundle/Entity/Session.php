<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Session
 *
 * @ORM\Table(name="session")
 * @ORM\Entity
 */
class Session
{
    /**
     * @var string
     *
     * @ORM\Column(name="session_id", type="string", length=255)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $sessionId;

    /**
     * @var string
     *
     * @ORM\Column(name="session_value", type="text", nullable=false)
     */
    private $sessionValue;

    /**
     * @var integer
     *
     * @ORM\Column(name="session_time", type="integer", nullable=false)
     */
    private $sessionTime;



    /**
     * Get sessionId
     *
     * @return string 
     */
    public function getSessionId()
    {
        return $this->sessionId;
    }

    /**
     * Set sessionValue
     *
     * @param string $sessionValue
     * @return Session
     */
    public function setSessionValue($sessionValue)
    {
        $this->sessionValue = $sessionValue;
    
        return $this;
    }

    /**
     * Get sessionValue
     *
     * @return string 
     */
    public function getSessionValue()
    {
        return $this->sessionValue;
    }

    /**
     * Set sessionTime
     *
     * @param integer $sessionTime
     * @return Session
     */
    public function setSessionTime($sessionTime)
    {
        $this->sessionTime = $sessionTime;
    
        return $this;
    }

    /**
     * Get sessionTime
     *
     * @return integer 
     */
    public function getSessionTime()
    {
        return $this->sessionTime;
    }
}