<?php

namespace Zeega\IngestBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\IngestBundle\Entity\Item
 */
class Item
{
    /**
     * @var bigint $item_id
     */
    private $item_id;

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
     * @var Zeega\IngestBundle\Entity\Metadata
     */
    private $metadata;

    /**
     * @var Zeega\IngestBundle\Entity\Media
     */
    private $media;

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
     * Get item_id
     *
     * @return bigint 
     */
    public function getItemId()
    {
        return $this->item_id;
    }

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
}