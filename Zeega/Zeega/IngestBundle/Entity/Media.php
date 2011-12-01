<?php

namespace Zeega\IngestBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\IngestBundle\Entity\Media
 */
class Media
{
    /**
     * @var integer $media_id
     */
    private $media_id;

    /**
     * @var bigint $item_id
     */
    private $item_id;

    /**
     * @var string $media_format
     */
    private $media_format;

    /**
     * @var integer $media_bit_rate
     */
    private $media_bit_rate;

    /**
     * @var integer $media_duration
     */
    private $media_duration;

    /**
     * @var integer $media_width
     */
    private $media_width;

    /**
     * @var integer $media_height
     */
    private $media_height;

    /**
     * @var integer $media_aspect_ratio
     */
    private $media_aspect_ratio;

    /**
     * @var Zeega\IngestBundle\Entity\Item
     */
    private $item;


    /**
     * Get media_id
     *
     * @return integer 
     */
    public function getMediaId()
    {
        return $this->media_id;
    }

    /**
     * Get item_id
     *
     * @return bigint 
     */
    public function getItemId()
    {
        return $this->item_id;
    }

    /**
     * Set media_format
     *
     * @param string $mediaFormat
     */
    public function setMediaFormat($mediaFormat)
    {
        $this->media_format = $mediaFormat;
    }

    /**
     * Get media_format
     *
     * @return string 
     */
    public function getMediaFormat()
    {
        return $this->media_format;
    }

    /**
     * Set media_bit_rate
     *
     * @param integer $mediaBitRate
     */
    public function setMediaBitRate($mediaBitRate)
    {
        $this->media_bit_rate = $mediaBitRate;
    }

    /**
     * Get media_bit_rate
     *
     * @return integer 
     */
    public function getMediaBitRate()
    {
        return $this->media_bit_rate;
    }

    /**
     * Set media_duration
     *
     * @param integer $mediaDuration
     */
    public function setMediaDuration($mediaDuration)
    {
        $this->media_duration = $mediaDuration;
    }

    /**
     * Get media_duration
     *
     * @return integer 
     */
    public function getMediaDuration()
    {
        return $this->media_duration;
    }

    /**
     * Set media_width
     *
     * @param integer $mediaWidth
     */
    public function setMediaWidth($mediaWidth)
    {
        $this->media_width = $mediaWidth;
    }

    /**
     * Get media_width
     *
     * @return integer 
     */
    public function getMediaWidth()
    {
        return $this->media_width;
    }

    /**
     * Set media_height
     *
     * @param integer $mediaHeight
     */
    public function setMediaHeight($mediaHeight)
    {
        $this->media_height = $mediaHeight;
    }

    /**
     * Get media_height
     *
     * @return integer 
     */
    public function getMediaHeight()
    {
        return $this->media_height;
    }

    /**
     * Set media_aspect_ratio
     *
     * @param integer $mediaAspectRatio
     */
    public function setMediaAspectRatio($mediaAspectRatio)
    {
        $this->media_aspect_ratio = $mediaAspectRatio;
    }

    /**
     * Get media_aspect_ratio
     *
     * @return integer 
     */
    public function getMediaAspectRatio()
    {
        return $this->media_aspect_ratio;
    }

    /**
     * Set item
     *
     * @param Zeega\IngestBundle\Entity\Item $item
     */
    public function setItem(\Zeega\IngestBundle\Entity\Item $item)
    {
        $this->item = $item;
    }

    /**
     * Get item
     *
     * @return Zeega\IngestBundle\Entity\Item 
     */
    public function getItem()
    {
        return $this->item;
    }
}