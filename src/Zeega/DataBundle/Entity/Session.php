<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\DataBundle\Entity\Session
 */
class Session
{
    /**
     * @var string $session_id
     */
    private $session_id;

    /**
     * @var text $session_value
     */
    private $session_value;

    /**
     * @var integer $session_time
     */
    private $session_time;


    /**
     * Set session_id
     *
     * @param string $sessionId
     */
    public function setSessionId($sessionId)
    {
        $this->session_id = $sessionId;
    }

    /**
     * Get session_id
     *
     * @return string 
     */
    public function getSessionId()
    {
        return $this->session_id;
    }

    /**
     * Set session_value
     *
     * @param text $sessionValue
     */
    public function setSessionValue($sessionValue)
    {
        $this->session_value = $sessionValue;
    }

    /**
     * Get session_value
     *
     * @return text 
     */
    public function getSessionValue()
    {
        return $this->session_value;
    }

    /**
     * Set session_time
     *
     * @param integer $sessionTime
     */
    public function setSessionTime($sessionTime)
    {
        $this->session_time = $sessionTime;
    }

    /**
     * Get session_time
     *
     * @return integer 
     */
    public function getSessionTime()
    {
        return $this->session_time;
    }

    /**
     * Set session_id
     *
     * @param string $session_id
     * @return Session
     */
    public function setSession_id($session_id)
    {
        $this->session_id = $session_id;
    
        return $this;
    }

    /**
     * Get session_id
     *
     * @return string 
     */
    public function getSession_id()
    {
        return $this->session_id;
    }

    /**
     * Set session_value
     *
     * @param string $session_value
     * @return Session
     */
    public function setSession_value($session_value)
    {
        $this->session_value = $session_value;
    
        return $this;
    }

    /**
     * Get session_value
     *
     * @return string 
     */
    public function getSession_value()
    {
        return $this->session_value;
    }

    /**
     * Set session_time
     *
     * @param integer $session_time
     * @return Session
     */
    public function setSession_time($session_time)
    {
        $this->session_time = $session_time;
    
        return $this;
    }

    /**
     * Get session_time
     *
     * @return integer 
     */
    public function getSession_time()
    {
        return $this->session_time;
    }
}