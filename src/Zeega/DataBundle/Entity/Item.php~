<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\DataBundle\Entity\Item
 */
class Item
{
    /**
     * @var bigint $id
     */
    private $id;

    /**
     * @var integer $site_id
     */
    private $site_id;

    /**
     * @var string $title
     */
    private $title;

    /**
     * @var integer $user_id
     */
    private $user_id;

    /**
     * @var string $description
     */
    private $description;

    /**
     * @var text $text
     */
    private $text;

    /**
     * @var string $uri
     */
    private $uri;

    /**
     * @var string $attribution_uri
     */
    private $attribution_uri;

    /**
     * @var datetime $date_created
     */
    private $date_created;

    /**
     * @var string $archive
     */
    private $archive;

    /**
     * @var string $media_type
     */
    private $media_type;

    /**
     * @var string $layer_type
     */
    private $layer_type;

    /**
     * @var string $thumbnail_url
     */
    private $thumbnail_url;

    /**
     * @var integer $child_items_count
     */
    private $child_items_count;

    /**
     * @var float $media_geo_latitude
     */
    private $media_geo_latitude;

    /**
     * @var float $media_geo_longitude
     */
    private $media_geo_longitude;

    /**
     * @var string $location
     */
    private $location;

    /**
     * @var datetime $media_date_created
     */
    private $media_date_created;

    /**
     * @var datetime $media_date_created_end
     */
    private $media_date_created_end;

    /**
     * @var string $media_creator_username
     */
    private $media_creator_username;

    /**
     * @var string $media_creator_realname
     */
    private $media_creator_realname;

    /**
     * @var string $license
     */
    private $license;

    /**
     * @var array $attributes
     */
    private $attributes;

    /**
     * @var array $tags
     */
    private $tags;

    /**
     * @var boolean $enabled
     */
    private $enabled;

    /**
     * @var boolean $published
     */
    private $published;

    /**
     * @var Zeega\DataBundle\Entity\Site
     */
    private $site;

    /**
     * @var Zeega\DataBundle\Entity\User
     */
    private $user;

    /**
     * @var Zeega\DataBundle\Entity\Item
     */
    private $child_items;

    /**
     * @var Zeega\DataBundle\Entity\Item
     */
    private $parent_items;

    public function __construct()
    {
        $this->child_items = new \Doctrine\Common\Collections\ArrayCollection();
    $this->parent_items = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
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
     * Set site_id
     *
     * @param integer $siteId
     */
    public function setSiteId($siteId)
    {
        $this->site_id = $siteId;
    }

    /**
     * Get site_id
     *
     * @return integer 
     */
    public function getSiteId()
    {
        return $this->site_id;
    }

    /**
     * Set title
     *
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * Get title
     *
     * @return string 
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set user_id
     *
     * @param integer $userId
     */
    public function setUserId($userId)
    {
        $this->user_id = $userId;
    }

    /**
     * Get user_id
     *
     * @return integer 
     */
    public function getUserId()
    {
        return $this->user_id;
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
     * Set text
     *
     * @param text $text
     */
    public function setText($text)
    {
        $this->text = $text;
    }

    /**
     * Get text
     *
     * @return text 
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * Set uri
     *
     * @param string $uri
     */
    public function setUri($uri)
    {
        $this->uri = $uri;
    }

    /**
     * Get uri
     *
     * @return string 
     */
    public function getUri()
    {
        return $this->uri;
    }

    /**
     * Set attribution_uri
     *
     * @param string $attributionUri
     */
    public function setAttributionUri($attributionUri)
    {
        $this->attribution_uri = $attributionUri;
    }

    /**
     * Get attribution_uri
     *
     * @return string 
     */
    public function getAttributionUri()
    {
        return $this->attribution_uri;
    }

    /**
     * Set date_created
     *
     * @param datetime $dateCreated
     */
    public function setDateCreated($dateCreated)
    {
        $this->date_created = $dateCreated;
    }

    /**
     * Get date_created
     *
     * @return datetime 
     */
    public function getDateCreated()
    {
        return $this->date_created;
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
     * Set media_type
     *
     * @param string $mediaType
     */
    public function setMediaType($mediaType)
    {
        $this->media_type = $mediaType;
    }

    /**
     * Get media_type
     *
     * @return string 
     */
    public function getMediaType()
    {
        return $this->media_type;
    }

    /**
     * Set layer_type
     *
     * @param string $layerType
     */
    public function setLayerType($layerType)
    {
        $this->layer_type = $layerType;
    }

    /**
     * Get layer_type
     *
     * @return string 
     */
    public function getLayerType()
    {
        return $this->layer_type;
    }

    /**
     * Set thumbnail_url
     *
     * @param string $thumbnailUrl
     */
    public function setThumbnailUrl($thumbnailUrl)
    {
        $this->thumbnail_url = $thumbnailUrl;
    }

    /**
     * Get thumbnail_url
     *
     * @return string 
     */
    public function getThumbnailUrl()
    {
        return $this->thumbnail_url;
    }

    /**
     * Set child_items_count
     *
     * @param integer $childItemsCount
     */
    public function setChildItemsCount($childItemsCount)
    {
        $this->child_items_count = $childItemsCount;
    }

    /**
     * Get child_items_count
     *
     * @return integer 
     */
    public function getChildItemsCount()
    {
        return $this->child_items_count;
    }

    /**
     * Set media_geo_latitude
     *
     * @param float $mediaGeoLatitude
     */
    public function setMediaGeoLatitude($mediaGeoLatitude)
    {
        $this->media_geo_latitude = $mediaGeoLatitude;
    }

    /**
     * Get media_geo_latitude
     *
     * @return float 
     */
    public function getMediaGeoLatitude()
    {
        return $this->media_geo_latitude;
    }

    /**
     * Set media_geo_longitude
     *
     * @param float $mediaGeoLongitude
     */
    public function setMediaGeoLongitude($mediaGeoLongitude)
    {
        $this->media_geo_longitude = $mediaGeoLongitude;
    }

    /**
     * Get media_geo_longitude
     *
     * @return float 
     */
    public function getMediaGeoLongitude()
    {
        return $this->media_geo_longitude;
    }

    /**
     * Set location
     *
     * @param string $location
     */
    public function setLocation($location)
    {
        $this->location = $location;
    }

    /**
     * Get location
     *
     * @return string 
     */
    public function getLocation()
    {
        return $this->location;
    }

    /**
     * Set media_date_created
     *
     * @param datetime $mediaDateCreated
     */
    public function setMediaDateCreated($mediaDateCreated)
    {
        $this->media_date_created = $mediaDateCreated;
    }

    /**
     * Get media_date_created
     *
     * @return datetime 
     */
    public function getMediaDateCreated()
    {
        return $this->media_date_created;
    }

    /**
     * Set media_date_created_end
     *
     * @param datetime $mediaDateCreatedEnd
     */
    public function setMediaDateCreatedEnd($mediaDateCreatedEnd)
    {
        $this->media_date_created_end = $mediaDateCreatedEnd;
    }

    /**
     * Get media_date_created_end
     *
     * @return datetime 
     */
    public function getMediaDateCreatedEnd()
    {
        return $this->media_date_created_end;
    }

    /**
     * Set media_creator_username
     *
     * @param string $mediaCreatorUsername
     */
    public function setMediaCreatorUsername($mediaCreatorUsername)
    {
        $this->media_creator_username = $mediaCreatorUsername;
    }

    /**
     * Get media_creator_username
     *
     * @return string 
     */
    public function getMediaCreatorUsername()
    {
        return $this->media_creator_username;
    }

    /**
     * Set media_creator_realname
     *
     * @param string $mediaCreatorRealname
     */
    public function setMediaCreatorRealname($mediaCreatorRealname)
    {
        $this->media_creator_realname = $mediaCreatorRealname;
    }

    /**
     * Get media_creator_realname
     *
     * @return string 
     */
    public function getMediaCreatorRealname()
    {
        return $this->media_creator_realname;
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

    /**
     * Set tags
     *
     * @param array $tags
     */
    public function setTags($tags)
    {
        $this->tags = $tags;
    }

    /**
     * Get tags
     *
     * @return array 
     */
    public function getTags()
    {
        return $this->tags;
    }

    /**
     * Set enabled
     *
     * @param boolean $enabled
     */
    public function setEnabled($enabled)
    {
        $this->enabled = $enabled;
    }

    /**
     * Get enabled
     *
     * @return boolean 
     */
    public function getEnabled()
    {
        return $this->enabled;
    }

    /**
     * Set published
     *
     * @param boolean $published
     */
    public function setPublished($published)
    {
        $this->published = $published;
    }

    /**
     * Get published
     *
     * @return boolean 
     */
    public function getPublished()
    {
        return $this->published;
    }

    /**
     * Set site
     *
     * @param Zeega\DataBundle\Entity\Site $site
     */
    public function setSite(\Zeega\DataBundle\Entity\Site $site)
    {
        $this->site = $site;
    }

    /**
     * Get site
     *
     * @return Zeega\DataBundle\Entity\Site 
     */
    public function getSite()
    {
        return $this->site;
    }

    /**
     * Set user
     *
     * @param Zeega\DataBundle\Entity\User $user
     */
    public function setUser(\Zeega\DataBundle\Entity\User $user)
    {
        $this->user = $user;
    }

    /**
     * Get user
     *
     * @return Zeega\DataBundle\Entity\User 
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Add child_items
     *
     * @param Zeega\DataBundle\Entity\Item $childItems
     */
    public function addItem(\Zeega\DataBundle\Entity\Item $childItems)
    {
        $this->child_items[] = $childItems;
    }

    /**
     * Get child_items
     *
     * @return Doctrine\Common\Collections\Collection 
     */
    public function getChildItems()
    {
        return $this->child_items;
    }

    /**
     * Get parent_items
     *
     * @return Doctrine\Common\Collections\Collection 
     */
    public function getParentItems()
    {
        return $this->parent_items;
    }
    /**
     * @ORM\prePersist
     */
    public function onPrePersist()
    {
        // Add your code here
    }

    /**
     * @ORM\preUpdate
     */
    public function onPreUpdate()
    {
    }
}
