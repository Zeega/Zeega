<?php

namespace Zeega\DataBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document
 * @MongoDB\Document(repositoryClass="Zeega\DataBundle\Repository\ItemRepository")
 *
 */
class Item
{
    /**
     * @MongoDB\Id
     */
    protected $id;

    /**
     * @MongoDB\String
     */
    protected $title;

    /**
     * @MongoDB\String
     */
    protected $description;

    /**
     * @MongoDB\String
     */
    protected $text;

    /**
     * @MongoDB\String
     */
    protected $uri;

    /**
     * @MongoDB\String
     * @MongoDB\Field(name="attribution_uri")
     */
    protected $attributionUri;

    /**
     * @MongoDB\Date
     * @MongoDB\Field(name="date_created")
     */
    protected $dateCreated;

    /**
     * @MongoDB\String
     * @MongoDB\Field(name="media_type")
     */
    protected $mediaType;

    /**
     * @MongoDB\String
     * @MongoDB\Field(name="layer_type")
     */
    protected $layerType;

    /**
     * @MongoDB\String
     * @MongoDB\Field(name="thumbnail_url")
     */
    protected $thumbnailUrl;

    /**
     * @MongoDB\Int
     * @MongoDB\Field(name="child_items_count")
     */
    protected $childItemsCount;

    /**
     * @MongoDB\Float
     * @MongoDB\Field(name="media_geo_latitude")
     */
    protected $mediaGeoLatitude;

    /**
     * @MongoDB\Float
     * @MongoDB\Field(name="media_geo_longitude")
     */
    protected $mediaGeoLongitude;

    /**
     * @MongoDB\Date
     * @MongoDB\Field(name="media_date_created")
     */
    protected $mediaDateCreated;

    /**
     * @MongoDB\String
     * @MongoDB\Field(name="media_creator_username")
     */
    protected $mediaCreatorUsername;

    /**
     * @MongoDB\String
     * @MongoDB\Field(name="media_creator_realname")
     */
    protected $mediaCreatorRealname;

    /**
     * @MongoDB\String
     */
    protected $archive;

    /**
     * @MongoDB\String
     */
    protected $location;

    /**
     * @MongoDB\String
     */
    protected $license;

    /**
     * @MongoDB\Hash
     */
    private $attributes;

    /**
     * @MongoDB\Boolean
     */
    private $enabled = true;

    /**
     * @MongoDB\Boolean
     */
    private $published;

    /**
     * @MongoDB\Hash
     */
    private $tags;

    /**
     * @MongoDB\Date
     */
    private $dateUpdated;

    /**
     * @MongoDB\String
     */
    private $ingestedBy;

    /**
     * @MongoDB\Int
     */
    private $duration;

    /**
     * @MongoDB\String
     */
    private $headline;

    /**
     * @MongoDB\ReferenceMany(targetDocument="Item", simple="true")
     */
    private $children;

    /**
     * @MongoDB\ReferenceOne(targetDocument="User", simple=true)
     */    
    protected $user;
    public function __construct()
    {
        $this->children = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
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
     * Set title
     *
     * @param string $title
     * @return \Item
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * Get title
     *
     * @return string $title
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return \Item
     */
    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }

    /**
     * Get description
     *
     * @return string $description
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set text
     *
     * @param string $text
     * @return \Item
     */
    public function setText($text)
    {
        $this->text = $text;
        return $this;
    }

    /**
     * Get text
     *
     * @return string $text
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * Set uri
     *
     * @param string $uri
     * @return \Item
     */
    public function setUri($uri)
    {
        $this->uri = $uri;
        return $this;
    }

    /**
     * Get uri
     *
     * @return string $uri
     */
    public function getUri()
    {
        return $this->uri;
    }

    /**
     * Set attributionUri
     *
     * @param string $attributionUri
     * @return \Item
     */
    public function setAttributionUri($attributionUri)
    {
        $this->attributionUri = $attributionUri;
        return $this;
    }

    /**
     * Get attributionUri
     *
     * @return string $attributionUri
     */
    public function getAttributionUri()
    {
        return $this->attributionUri;
    }

    /**
     * Set dateCreated
     *
     * @param date $dateCreated
     * @return \Item
     */
    public function setDateCreated($dateCreated)
    {
        $this->dateCreated = $dateCreated;
        return $this;
    }

    /**
     * Get dateCreated
     *
     * @return date $dateCreated
     */
    public function getDateCreated()
    {
        return $this->dateCreated;
    }

    /**
     * Set mediaType
     *
     * @param string $mediaType
     * @return \Item
     */
    public function setMediaType($mediaType)
    {
        $this->mediaType = $mediaType;
        return $this;
    }

    /**
     * Get mediaType
     *
     * @return string $mediaType
     */
    public function getMediaType()
    {
        return $this->mediaType;
    }

    /**
     * Set layerType
     *
     * @param string $layerType
     * @return \Item
     */
    public function setLayerType($layerType)
    {
        $this->layerType = $layerType;
        return $this;
    }

    /**
     * Get layerType
     *
     * @return string $layerType
     */
    public function getLayerType()
    {
        return $this->layerType;
    }

    /**
     * Set thumbnailUrl
     *
     * @param string $thumbnailUrl
     * @return \Item
     */
    public function setThumbnailUrl($thumbnailUrl)
    {
        $this->thumbnailUrl = $thumbnailUrl;
        return $this;
    }

    /**
     * Get thumbnailUrl
     *
     * @return string $thumbnailUrl
     */
    public function getThumbnailUrl()
    {
        return $this->thumbnailUrl;
    }

    /**
     * Set childItemsCount
     *
     * @param int $childItemsCount
     * @return \Item
     */
    public function setChildItemsCount($childItemsCount)
    {
        $this->childItemsCount = $childItemsCount;
        return $this;
    }

    /**
     * Get childItemsCount
     *
     * @return int $childItemsCount
     */
    public function getChildItemsCount()
    {
        return $this->childItemsCount;
    }

    /**
     * Set mediaGeoLatitude
     *
     * @param float $mediaGeoLatitude
     * @return \Item
     */
    public function setMediaGeoLatitude($mediaGeoLatitude)
    {
        $this->mediaGeoLatitude = $mediaGeoLatitude;
        return $this;
    }

    /**
     * Get mediaGeoLatitude
     *
     * @return float $mediaGeoLatitude
     */
    public function getMediaGeoLatitude()
    {
        return $this->mediaGeoLatitude;
    }

    /**
     * Set mediaGeoLongitude
     *
     * @param float $mediaGeoLongitude
     * @return \Item
     */
    public function setMediaGeoLongitude($mediaGeoLongitude)
    {
        $this->mediaGeoLongitude = $mediaGeoLongitude;
        return $this;
    }

    /**
     * Get mediaGeoLongitude
     *
     * @return float $mediaGeoLongitude
     */
    public function getMediaGeoLongitude()
    {
        return $this->mediaGeoLongitude;
    }

    /**
     * Set mediaDateCreated
     *
     * @param date $mediaDateCreated
     * @return \Item
     */
    public function setMediaDateCreated($mediaDateCreated)
    {
        $this->mediaDateCreated = $mediaDateCreated;
        return $this;
    }

    /**
     * Get mediaDateCreated
     *
     * @return date $mediaDateCreated
     */
    public function getMediaDateCreated()
    {
        return $this->mediaDateCreated;
    }

    /**
     * Set mediaCreatorUsername
     *
     * @param string $mediaCreatorUsername
     * @return \Item
     */
    public function setMediaCreatorUsername($mediaCreatorUsername)
    {
        $this->mediaCreatorUsername = $mediaCreatorUsername;
        return $this;
    }

    /**
     * Get mediaCreatorUsername
     *
     * @return string $mediaCreatorUsername
     */
    public function getMediaCreatorUsername()
    {
        return $this->mediaCreatorUsername;
    }

    /**
     * Set mediaCreatorRealname
     *
     * @param string $mediaCreatorRealname
     * @return \Item
     */
    public function setMediaCreatorRealname($mediaCreatorRealname)
    {
        $this->mediaCreatorRealname = $mediaCreatorRealname;
        return $this;
    }

    /**
     * Get mediaCreatorRealname
     *
     * @return string $mediaCreatorRealname
     */
    public function getMediaCreatorRealname()
    {
        return $this->mediaCreatorRealname;
    }

    /**
     * Set archive
     *
     * @param string $archive
     * @return \Item
     */
    public function setArchive($archive)
    {
        $this->archive = $archive;
        return $this;
    }

    /**
     * Get archive
     *
     * @return string $archive
     */
    public function getArchive()
    {
        return $this->archive;
    }

    /**
     * Set location
     *
     * @param string $location
     * @return \Item
     */
    public function setLocation($location)
    {
        $this->location = $location;
        return $this;
    }

    /**
     * Get location
     *
     * @return string $location
     */
    public function getLocation()
    {
        return $this->location;
    }

    /**
     * Set license
     *
     * @param string $license
     * @return \Item
     */
    public function setLicense($license)
    {
        $this->license = $license;
        return $this;
    }

    /**
     * Get license
     *
     * @return string $license
     */
    public function getLicense()
    {
        return $this->license;
    }

    /**
     * Set attributes
     *
     * @param hash $attributes
     * @return \Item
     */
    public function setAttributes($attributes)
    {
        $this->attributes = $attributes;
        return $this;
    }

    /**
     * Get attributes
     *
     * @return hash $attributes
     */
    public function getAttributes()
    {
        return $this->attributes;
    }

    /**
     * Set enabled
     *
     * @param boolean $enabled
     * @return \Item
     */
    public function setEnabled($enabled)
    {
        $this->enabled = $enabled;
        return $this;
    }

    /**
     * Get enabled
     *
     * @return boolean $enabled
     */
    public function getEnabled()
    {
        return $this->enabled;
    }

    /**
     * Set published
     *
     * @param boolean $published
     * @return \Item
     */
    public function setPublished($published)
    {
        $this->published = $published;
        return $this;
    }

    /**
     * Get published
     *
     * @return boolean $published
     */
    public function getPublished()
    {
        return $this->published;
    }

    /**
     * Set tags
     *
     * @param hash $tags
     * @return \Item
     */
    public function setTags($tags)
    {
        $this->tags = $tags;
        return $this;
    }

    /**
     * Get tags
     *
     * @return hash $tags
     */
    public function getTags()
    {
        return $this->tags;
    }

    /**
     * Set dateUpdated
     *
     * @param date $dateUpdated
     * @return \Item
     */
    public function setDateUpdated($dateUpdated)
    {
        $this->dateUpdated = $dateUpdated;
        return $this;
    }

    /**
     * Get dateUpdated
     *
     * @return date $dateUpdated
     */
    public function getDateUpdated()
    {
        return $this->dateUpdated;
    }

    /**
     * Set ingestedBy
     *
     * @param string $ingestedBy
     * @return \Item
     */
    public function setIngestedBy($ingestedBy)
    {
        $this->ingestedBy = $ingestedBy;
        return $this;
    }

    /**
     * Get ingestedBy
     *
     * @return string $ingestedBy
     */
    public function getIngestedBy()
    {
        return $this->ingestedBy;
    }

    /**
     * Set duration
     *
     * @param int $duration
     * @return \Item
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;
        return $this;
    }

    /**
     * Get duration
     *
     * @return int $duration
     */
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * Add children
     *
     * @param Zeega\DataBundle\Document\Item $children
     */
    public function addChildren(\Zeega\DataBundle\Document\Item $children)
    {
        $this->children[] = $children;
    }

    /**
     * Get children
     *
     * @return Doctrine\Common\Collections\Collection $children
     */
    public function getChildren()
    {
        return $this->children;
    }

    /**
     * Set user
     *
     * @param Zeega\DataBundle\Document\User $user
     * @return \Item
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
    * Remove children
    *
    * @param <variableType$children
    */
    public function removeChildren(\Zeega\DataBundle\Document\Item $children)
    {
        $this->children->removeElement($children);
    }

    /**
     * Set headline
     *
     * @param string $headline
     * @return \Item
     */
    public function setHeadline($headline)
    {
        $this->headline = $headline;
        return $this;
    }

    /**
     * Get headline
     *
     * @return string $headline
     */
    public function getHeadline()
    {
        return $this->headline;
    }
}
