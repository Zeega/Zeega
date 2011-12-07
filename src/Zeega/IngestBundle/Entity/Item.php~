<?php

namespace Zeega\IngestBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

use DateTime;

/**
 * Zeega\IngestBundle\Entity\Item
 */
class Item
{
    /**
     * @var bigint $id
     */
    private $id;

    /**
     * @var bigint $media_id
     */
    private $media_id;

    /**
     * @var bigint $metadata_id
     */
    private $metadata_id;

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
     * @var date $date_created
     */
    private $date_created;

    /**
     * @var string $type
     */
    private $type;

    /**
     * @var string $source
     */
    private $source;

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
     * @var date $media_date_created
     */
    private $media_date_created;

    /**
     * @var date $media_date_created_end
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
     * @var Zeega\IngestBundle\Entity\Media
     */
    private $media;

    /**
     * @var Zeega\IngestBundle\Entity\Metadata
     */
    private $metadata;

    /**
     * @var Zeega\IngestBundle\Entity\ItemTags
     */
    private $tags;

    /**
     * @var Zeega\EditorBundle\Entity\Playground
     */
    private $playground;

    /**
     * @var Zeega\UserBundle\Entity\User
     */
    private $user;

    /**
     * @var Zeega\IngestBundle\Entity\Item
     */
    private $child_items;

    /**
     * @var Zeega\IngestBundle\Entity\Item
     */
    private $parent_items;

    public function __construct()
    {
        $this->tags = new \Doctrine\Common\Collections\ArrayCollection();
    	$this->child_items = new \Doctrine\Common\Collections\ArrayCollection();
    	$this->parent_items = new \Doctrine\Common\Collections\ArrayCollection();
    	$this->date_created = new DateTime(NULL);
    	
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
     * Set media_id
     *
     * @param bigint $mediaId
     */
    public function setMediaId($mediaId)
    {
        $this->media_id = $mediaId;
    }

    /**
     * Get media_id
     *
     * @return bigint 
     */
    public function getMediaId()
    {
        return $this->media_id;
    }

    /**
     * Set metadata_id
     *
     * @param bigint $metadataId
     */
    public function setMetadataId($metadataId)
    {
        $this->metadata_id = $metadataId;
    }

    /**
     * Get metadata_id
     *
     * @return bigint 
     */
    public function getMetadataId()
    {
        return $this->metadata_id;
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
     * @param date $dateCreated
     */
    public function setDateCreated($dateCreated)
    {
        $this->date_created = $dateCreated;
    }

    /**
     * Get date_created
     *
     * @return date 
     */
    public function getDateCreated()
    {
        return $this->date_created;
    }

    /**
     * Set type
     *
     * @param string $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * Get type
     *
     * @return string 
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set source
     *
     * @param string $source
     */
    public function setSource($source)
    {
        $this->source = $source;
    }

    /**
     * Get source
     *
     * @return string 
     */
    public function getSource()
    {
        return $this->source;
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
     * Set media_date_created
     *
     * @param date $mediaDateCreated
     */
    public function setMediaDateCreated($mediaDateCreated)
    {
        $this->media_date_created = $mediaDateCreated;
    }

    /**
     * Get media_date_created
     *
     * @return date 
     */
    public function getMediaDateCreated()
    {
        return $this->media_date_created;
    }

    /**
     * Set media_date_created_end
     *
     * @param date $mediaDateCreatedEnd
     */
    public function setMediaDateCreatedEnd($mediaDateCreatedEnd)
    {
        $this->media_date_created_end = $mediaDateCreatedEnd;
    }

    /**
     * Get media_date_created_end
     *
     * @return date 
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
     * Set media
     *
     * @param Zeega\IngestBundle\Entity\Media $media
     */
    public function setMedia(\Zeega\IngestBundle\Entity\Media $media)
    {
        $this->media = $media;
    }

    /**
     * Get media
     *
     * @return Zeega\IngestBundle\Entity\Media 
     */
    public function getMedia()
    {
        return $this->media;
    }

    /**
     * Set metadata
     *
     * @param Zeega\IngestBundle\Entity\Metadata $metadata
     */
    public function setMetadata(\Zeega\IngestBundle\Entity\Metadata $metadata)
    {
        $this->metadata = $metadata;
    }

    /**
     * Get metadata
     *
     * @return Zeega\IngestBundle\Entity\Metadata 
     */
    public function getMetadata()
    {
        return $this->metadata;
    }

    /**
     * Add tags
     *
     * @param Zeega\IngestBundle\Entity\ItemTags $tags
     */
    public function addItemTags(\Zeega\IngestBundle\Entity\ItemTags $tags)
    {
        $this->tags[] = $tags;
    }

    /**
     * Get tags
     *
     * @return Doctrine\Common\Collections\Collection 
     */
    public function getTags()
    {
        return $this->tags;
    }

    /**
     * Set playground
     *
     * @param Zeega\EditorBundle\Entity\Playground $playground
     */
    public function setPlayground(\Zeega\EditorBundle\Entity\Playground $playground)
    {
        $this->playground = $playground;
    }

    /**
     * Get playground
     *
     * @return Zeega\EditorBundle\Entity\Playground 
     */
    public function getPlayground()
    {
        return $this->playground;
    }

    /**
     * Set user
     *
     * @param Zeega\UserBundle\Entity\User $user
     */
    public function setUser(\Zeega\UserBundle\Entity\User $user)
    {
        $this->user = $user;
    }

    /**
     * Get user
     *
     * @return Zeega\UserBundle\Entity\User 
     */
    public function getUser()
    {
        return $this->user;
    }

    /**

     * Add child_items
     *
     * @param Zeega\IngestBundle\Entity\Item $childItems
     */
    public function addItem(\Zeega\IngestBundle\Entity\Item $childItems)
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
}