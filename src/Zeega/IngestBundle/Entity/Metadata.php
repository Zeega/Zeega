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
     * @var string $metadata_archive
     */
    private $metadata_archive;

    /**
     * @var string $metadata_description
     */
    private $metadata_description;

    /**
     * @var text $metadata_text
     */
    private $metadata_text;

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
     * Set metadata_archive
     *
     * @param string $metadataArchive
     */
    public function setMetadataArchive($metadataArchive)
    {
        $this->metadata_archive = $metadataArchive;
    }

    /**
     * Get metadata_archive
     *
     * @return string 
     */
    public function getMetadataArchive()
    {
        return $this->metadata_archive;
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
    /**
     * @var bigint $id
     */
    private $id;

    /**
     * @var string $creator
     */
    private $creator;

    /**
     * @var string $archive
     */
    private $archive;

    /**
     * @var string $description
     */
    private $description;

    /**
     * @var text $text_content
     */
    private $text_content;

    /**
     * @var string $license
     */
    private $license;

    /**
     * @var array $attributes
     */
    private $attributes;


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
     * Set item_id
     *
     * @param bigint $itemId
     */
    public function setItemId($itemId)
    {
        $this->item_id = $itemId;
    }

    /**
     * Set creator
     *
     * @param string $creator
     */
    public function setCreator($creator)
    {
        $this->creator = $creator;
    }

    /**
     * Get creator
     *
     * @return string 
     */
    public function getCreator()
    {
        return $this->creator;
    }

    /**
     * Set archive
     *
     * @param string $archive
     */
    public function setArchive($archive)
    {
        $this->archive = $archive;
    }

    /**
     * Get archive
     *
     * @return string 
     */
    public function getArchive()
    {
        return $this->archive;
    }

    /**
     * Set description
     *
     * @param string $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * Get description
     *
     * @return string 
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set text_content
     *
     * @param text $textContent
     */
    public function setTextContent($textContent)
    {
        $this->text_content = $textContent;
    }

    /**
     * Get text_content
     *
     * @return text 
     */
    public function getTextContent()
    {
        return $this->text_content;
    }

    /**
     * Set license
     *
     * @param string $license
     */
    public function setLicense($license)
    {
        $this->license = $license;
    }

    /**
     * Get license
     *
     * @return string 
     */
    public function getLicense()
    {
        return $this->license;
    }

    /**
     * Set attributes
     *
     * @param array $attributes
     */
    public function setAttributes($attributes)
    {
        $this->attributes = $attributes;
    }

    /**
     * Get attributes
     *
     * @return array 
     */
    public function getAttributes()
    {
        return $this->attributes;
    }
}