<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\DataBundle\Entity\Media
 */
class Media
{
    /**
     * @var bigint $id
     */
    private $id;

    /**
     * @var string $format
     */
    private $format;

    /**
     * @var integer $bit_rate
     */
    private $bit_rate;

    /**
     * @var integer $duration
     */
    private $duration;

    /**
     * @var integer $width
     */
    private $width;

    /**
     * @var integer $height
     */
    private $height;

    /**
     * @var float $aspect_ratio
     */
    private $aspect_ratio;


    /**
     * Get id
     *
     * @return bigint 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set format
     *
     * @param string $format
     */
    public function setFormat($format)
    {
        $this->format = $format;
    }

    /**
     * Get format
     *
     * @return string 
     */
    public function getFormat()
    {
        return $this->format;
    }

    /**
     * Set bit_rate
     *
     * @param integer $bitRate
     */
    public function setBitRate($bitRate)
    {
        $this->bit_rate = $bitRate;
    }

    /**
     * Get bit_rate
     *
     * @return integer 
     */
    public function getBitRate()
    {
        return $this->bit_rate;
    }

    /**
     * Set duration
     *
     * @param integer $duration
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;
    }

    /**
     * Get duration
     *
     * @return integer 
     */
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * Set width
     *
     * @param integer $width
     */
    public function setWidth($width)
    {
        $this->width = $width;
    }

    /**
     * Get width
     *
     * @return integer 
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * Set height
     *
     * @param integer $height
     */
    public function setHeight($height)
    {
        $this->height = $height;
    }

    /**
     * Get height
     *
     * @return integer 
     */
    public function getHeight()
    {
        return $this->height;
    }

    /**
     * Set aspect_ratio
     *
     * @param float $aspectRatio
     */
    public function setAspectRatio($aspectRatio)
    {
        $this->aspect_ratio = $aspectRatio;
    }

    /**
     * Get aspect_ratio
     *
     * @return float 
     */
    public function getAspectRatio()
    {
        return $this->aspect_ratio;
    }
    /**
     * @var Zeega\DataBundle\Entity\Item
     */
    private $item;


    /**
     * Set item
     *
     * @param Zeega\DataBundle\Entity\Item $item
     */
    public function setItem(\Zeega\DataBundle\Entity\Item $item)
    {
        $this->item = $item;
    }

    /**
     * Get item
     *
     * @return Zeega\DataBundle\Entity\Item 
     */
    public function getItem()
    {
        return $this->item;
    }
}