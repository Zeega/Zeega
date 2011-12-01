<?php

namespace Zeega\IngestBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\IngestBundle\Entity\Metadata
 */
class Metadata
{
    /**
     * @var integer $metadata_id
     */
    private $metadata_id;

    /**
     * @var bigint $item_id
     */
    private $item_id;

    /**
     * @var string $metadata_creator
     */
    private $metadata_creator;

    /**
     * @var string $metadata_description
     */
    private $metadata_description;

    /**
     * @var text $metadata_text
     */
    private $metadata_text;

    /**
     * @var text $metadata_excerpt
     */
    private $metadata_excerpt;

    /**
     * @var string $metadata_license
     */
    private $metadata_license;

    /**
     * @var array $metadata_attributes
     */
    private $metadata_attributes;

    /**
     * @var Zeega\IngestBundle\Entity\Item
     */
    private $item;


    /**
     * Get metadata_id
     *
     * @return integer 
     */
    public function getMetadataId()
    {
        return $this->metadata_id;
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
     * Set metadata_creator
     *
     * @param string $metadataCreator
     */
    public function setMetadataCreator($metadataCreator)
    {
        $this->metadata_creator = $metadataCreator;
    }

    /**
     * Get metadata_creator
     *
     * @return string 
     */
    public function getMetadataCreator()
    {
        return $this->metadata_creator;
    }

    /**
     * Set metadata_description
     *
     * @param string $metadataDescription
     */
    public function setMetadataDescription($metadataDescription)
    {
        $this->metadata_description = $metadataDescription;
    }

    /**
     * Get metadata_description
     *
     * @return string 
     */
    public function getMetadataDescription()
    {
        return $this->metadata_description;
    }

    /**
     * Set metadata_text
     *
     * @param text $metadataText
     */
    public function setMetadataText($metadataText)
    {
        $this->metadata_text = $metadataText;
    }

    /**
     * Get metadata_text
     *
     * @return text 
     */
    public function getMetadataText()
    {
        return $this->metadata_text;
    }

    /**
     * Set metadata_excerpt
     *
     * @param text $metadataExcerpt
     */
    public function setMetadataExcerpt($metadataExcerpt)
    {
        $this->metadata_excerpt = $metadataExcerpt;
    }

    /**
     * Get metadata_excerpt
     *
     * @return text 
     */
    public function getMetadataExcerpt()
    {
        return $this->metadata_excerpt;
    }

    /**
     * Set metadata_license
     *
     * @param string $metadataLicense
     */
    public function setMetadataLicense($metadataLicense)
    {
        $this->metadata_license = $metadataLicense;
    }

    /**
     * Get metadata_license
     *
     * @return string 
     */
    public function getMetadataLicense()
    {
        return $this->metadata_license;
    }

    /**
     * Set metadata_attributes
     *
     * @param array $metadataAttributes
     */
    public function setMetadataAttributes($metadataAttributes)
    {
        $this->metadata_attributes = $metadataAttributes;
    }

    /**
     * Get metadata_attributes
     *
     * @return array 
     */
    public function getMetadataAttributes()
    {
        return $this->metadata_attributes;
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