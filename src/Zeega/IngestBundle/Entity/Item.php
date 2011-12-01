<?php

namespace Zeega\IngestBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

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
     * @var string $title
     */
    private $title;

    /**
     * @var integer $user_id
     */
    private $user_id;

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
     * @var bigint $media_id
     */
    private $media_id;

    /**
     * @var bigint $metadata_id
     */
    private $metadata_id;

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
     * @var Zeega\IngestBundle\Entity\Metadata
     */
    private $metadata;

    /**
     * @var Zeega\IngestBundle\Entity\Media
     */
    private $media;

    /**
     * @var Zeega\UserBundle\Entity\User
     */
    private $user;

    /**
     * @var Zeega\IngestBundle\Entity\ItemTags
     */
    private $tags;

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
    /**
     * @var string $item_title
     */
    private $item_title;

    /**
     * @var string $item_creator
     */
    private $item_creator;

    /**
     * @var string $item_uri
     */
    private $item_uri;

    /**
     * @var string $item_attribution_uri
     */
    private $item_attribution_uri;

    /**
     * @var date $item_date_created
     */
    private $item_date_created;

    /**
     * @var string $item_type
     */
    private $item_type;

    /**
     * @var string $item_source
     */
    private $item_source;

    /**
     * @var string $item_thumbnail_url
     */
    private $item_thumbnail_url;

    /**
     * @var bigint $item_media_id
     */
    private $item_media_id;

    /**
     * @var bigint $item_metadata_id
     */
    private $item_metadata_id;

    /**
     * @var integer $item_child_items_count
     */
    private $item_child_items_count;

    /**
     * @var float $item_media_geo_latitude
     */
    private $item_media_geo_latitude;

    /**
     * @var float $item_media_geo_longitude
     */
    private $item_media_geo_longitude;

    /**
     * @var date $item_media_date_created
     */
    private $item_media_date_created;

    /**
     * @var date $item_media_date_created_end
     */
    private $item_media_date_created_end;


    /**
     * Set item_title
     *
     * @param string $itemTitle
     */
    public function setItemTitle($itemTitle)
    {
        $this->item_title = $itemTitle;
    }

    /**
     * Get item_title
     *
     * @return string 
     */
    public function getItemTitle()
    {
        return $this->item_title;
    }

    /**
     * Set item_creator
     *
     * @param string $itemCreator
     */
    public function setItemCreator($itemCreator)
    {
        $this->item_creator = $itemCreator;
    }

    /**
     * Get item_creator
     *
     * @return string 
     */
    public function getItemCreator()
    {
        return $this->item_creator;
    }

    /**
     * Set item_uri
     *
     * @param string $itemUri
     */
    public function setItemUri($itemUri)
    {
        $this->item_uri = $itemUri;
    }

    /**
     * Get item_uri
     *
     * @return string 
     */
    public function getItemUri()
    {
        return $this->item_uri;
    }

    /**
     * Set item_attribution_uri
     *
     * @param string $itemAttributionUri
     */
    public function setItemAttributionUri($itemAttributionUri)
    {
        $this->item_attribution_uri = $itemAttributionUri;
    }

    /**
     * Get item_attribution_uri
     *
     * @return string 
     */
    public function getItemAttributionUri()
    {
        return $this->item_attribution_uri;
    }

    /**
     * Set item_date_created
     *
     * @param date $itemDateCreated
     */
    public function setItemDateCreated($itemDateCreated)
    {
        $this->item_date_created = $itemDateCreated;
    }

    /**
     * Get item_date_created
     *
     * @return date 
     */
    public function getItemDateCreated()
    {
        return $this->item_date_created;
    }

    /**
     * Set item_type
     *
     * @param string $itemType
     */
    public function setItemType($itemType)
    {
        $this->item_type = $itemType;
    }

    /**
     * Get item_type
     *
     * @return string 
     */
    public function getItemType()
    {
        return $this->item_type;
    }

    /**
     * Set item_source
     *
     * @param string $itemSource
     */
    public function setItemSource($itemSource)
    {
        $this->item_source = $itemSource;
    }

    /**
     * Get item_source
     *
     * @return string 
     */
    public function getItemSource()
    {
        return $this->item_source;
    }

    /**
     * Set item_thumbnail_url
     *
     * @param string $itemThumbnailUrl
     */
    public function setItemThumbnailUrl($itemThumbnailUrl)
    {
        $this->item_thumbnail_url = $itemThumbnailUrl;
    }

    /**
     * Get item_thumbnail_url
     *
     * @return string 
     */
    public function getItemThumbnailUrl()
    {
        return $this->item_thumbnail_url;
    }

    /**
     * Set item_media_id
     *
     * @param bigint $itemMediaId
     */
    public function setItemMediaId($itemMediaId)
    {
        $this->item_media_id = $itemMediaId;
    }

    /**
     * Get item_media_id
     *
     * @return bigint 
     */
    public function getItemMediaId()
    {
        return $this->item_media_id;
    }

    /**
     * Set item_metadata_id
     *
     * @param bigint $itemMetadataId
     */
    public function setItemMetadataId($itemMetadataId)
    {
        $this->item_metadata_id = $itemMetadataId;
    }

    /**
     * Get item_metadata_id
     *
     * @return bigint 
     */
    public function getItemMetadataId()
    {
        return $this->item_metadata_id;
    }

    /**
     * Set item_child_items_count
     *
     * @param integer $itemChildItemsCount
     */
    public function setItemChildItemsCount($itemChildItemsCount)
    {
        $this->item_child_items_count = $itemChildItemsCount;
    }

    /**
     * Get item_child_items_count
     *
     * @return integer 
     */
    public function getItemChildItemsCount()
    {
        return $this->item_child_items_count;
    }

    /**
     * Set item_media_geo_latitude
     *
     * @param float $itemMediaGeoLatitude
     */
    public function setItemMediaGeoLatitude($itemMediaGeoLatitude)
    {
        $this->item_media_geo_latitude = $itemMediaGeoLatitude;
    }

    /**
     * Get item_media_geo_latitude
     *
     * @return float 
     */
    public function getItemMediaGeoLatitude()
    {
        return $this->item_media_geo_latitude;
    }

    /**
     * Set item_media_geo_longitude
     *
     * @param float $itemMediaGeoLongitude
     */
    public function setItemMediaGeoLongitude($itemMediaGeoLongitude)
    {
        $this->item_media_geo_longitude = $itemMediaGeoLongitude;
    }

    /**
     * Get item_media_geo_longitude
     *
     * @return float 
     */
    public function getItemMediaGeoLongitude()
    {
        return $this->item_media_geo_longitude;
    }

    /**
     * Set item_media_date_created
     *
     * @param date $itemMediaDateCreated
     */
    public function setItemMediaDateCreated($itemMediaDateCreated)
    {
        $this->item_media_date_created = $itemMediaDateCreated;
    }

    /**
     * Get item_media_date_created
     *
     * @return date 
     */
    public function getItemMediaDateCreated()
    {
        return $this->item_media_date_created;
    }

    /**
     * Set item_media_date_created_end
     *
     * @param date $itemMediaDateCreatedEnd
     */
    public function setItemMediaDateCreatedEnd($itemMediaDateCreatedEnd)
    {
        $this->item_media_date_created_end = $itemMediaDateCreatedEnd;
    }

    /**
     * Get item_media_date_created_end
     *
     * @return date 
     */
    public function getItemMediaDateCreatedEnd()
    {
        return $this->item_media_date_created_end;
    }
}