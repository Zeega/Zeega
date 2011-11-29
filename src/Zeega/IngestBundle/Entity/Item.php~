<?php

namespace Zeega\IngestBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zeega\IngestBundle\Entity\Item
 */
class Item
{
    /**
     * @var integer $id
     */
    private $id;

    /**
     * @var string $title
     */
    private $title;

    /**
     * @var string $creator
     */
    private $creator;

    /**
     * @var string $item_url
     */
    private $item_url;

    /**
     * @var string $item_uri
     */
    private $item_uri;

    /**
     * @var string $attribution_url
     */
    private $attribution_url;

    /**
     * @var boolean $depth
     */
    private $depth;

    /**
     * @var float $geo_lat
     */
    private $geo_lat;

    /**
     * @var float $geo_lng
     */
    private $geo_lng;

    /**
     * @var date $date_created_start
     */
    private $date_created_start;

    /**
     * @var date $date_created_end
     */
    private $date_created_end;

    /**
     * @var string $content_type
     */
    private $content_type;

    /**
     * @var string $source_type
     */
    private $source_type;

    /**
     * @var string $archive
     */
    private $archive;

    /**
     * @var Zeega\IngestBundle\Entity\Media
     */
    private $media;

    /**
     * @var Zeega\IngestBundle\Entity\Metadata
     */
    private $metadata;

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
        $this->child_items = new \Doctrine\Common\Collections\ArrayCollection();
    $this->parent_items = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Get id
     *
     * @return integer 
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
     * Set item_url
     *
     * @param string $itemUrl
     */
    public function setItemUrl($itemUrl)
    {
        $this->item_url = $itemUrl;
    }

    /**
     * Get item_url
     *
     * @return string 
     */
    public function getItemUrl()
    {
        return $this->item_url;
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
     * Set attribution_url
     *
     * @param string $attributionUrl
     */
    public function setAttributionUrl($attributionUrl)
    {
        $this->attribution_url = $attributionUrl;
    }

    /**
     * Get attribution_url
     *
     * @return string 
     */
    public function getAttributionUrl()
    {
        return $this->attribution_url;
    }

    /**
     * Set depth
     *
     * @param boolean $depth
     */
    public function setDepth($depth)
    {
        $this->depth = $depth;
    }

    /**
     * Get depth
     *
     * @return boolean 
     */
    public function getDepth()
    {
        return $this->depth;
    }

    /**
     * Set geo_lat
     *
     * @param float $geoLat
     */
    public function setGeoLat($geoLat)
    {
        $this->geo_lat = $geoLat;
    }

    /**
     * Get geo_lat
     *
     * @return float 
     */
    public function getGeoLat()
    {
        return $this->geo_lat;
    }

    /**
     * Set geo_lng
     *
     * @param float $geoLng
     */
    public function setGeoLng($geoLng)
    {
        $this->geo_lng = $geoLng;
    }

    /**
     * Get geo_lng
     *
     * @return float 
     */
    public function getGeoLng()
    {
        return $this->geo_lng;
    }

    /**
     * Set date_created_start
     *
     * @param date $dateCreatedStart
     */
    public function setDateCreatedStart($dateCreatedStart)
    {
        $this->date_created_start = $dateCreatedStart;
    }

    /**
     * Get date_created_start
     *
     * @return date 
     */
    public function getDateCreatedStart()
    {
        return $this->date_created_start;
    }

    /**
     * Set date_created_end
     *
     * @param date $dateCreatedEnd
     */
    public function setDateCreatedEnd($dateCreatedEnd)
    {
        $this->date_created_end = $dateCreatedEnd;
    }

    /**
     * Get date_created_end
     *
     * @return date 
     */
    public function getDateCreatedEnd()
    {
        return $this->date_created_end;
    }

    /**
     * Set content_type
     *
     * @param string $contentType
     */
    public function setContentType($contentType)
    {
        $this->content_type = $contentType;
    }

    /**
     * Get content_type
     *
     * @return string 
     */
    public function getContentType()
    {
        return $this->content_type;
    }

    /**
     * Set source_type
     *
     * @param string $sourceType
     */
    public function setSourceType($sourceType)
    {
        $this->source_type = $sourceType;
    }

    /**
     * Get source_type
     *
     * @return string 
     */
    public function getSourceType()
    {
        return $this->source_type;
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
    /**
     * @var integer $item_id
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
     * @var clob $item_content
     */
    private $item_content;

    /**
     * @var clob $item_excerpt
     */
    private $item_excerpt;

    /**
     * @var string $item_attribution_uri
     */
    private $item_attribution_uri;

    /**
     * @var date $item_date_created
     */
    private $item_date_created;

    /**
     * @var date $item_date_modified
     */
    private $item_date_modified;

    /**
     * @var string $item_type
     */
    private $item_type;

    /**
     * @var string $item_thumbnail_url
     */
    private $item_thumbnail_url;

    /**
     * @var integer $item_child_items_count
     */
    private $item_child_items_count;

    /**
     * @var integer $item_parent
     */
    private $item_parent;


    /**
     * Get item_id
     *
     * @return integer 
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
     * Set item_content
     *
     * @param clob $itemContent
     */
    public function setItemContent(\clob $itemContent)
    {
        $this->item_content = $itemContent;
    }

    /**
     * Get item_content
     *
     * @return clob 
     */
    public function getItemContent()
    {
        return $this->item_content;
    }

    /**
     * Set item_excerpt
     *
     * @param clob $itemExcerpt
     */
    public function setItemExcerpt(\clob $itemExcerpt)
    {
        $this->item_excerpt = $itemExcerpt;
    }

    /**
     * Get item_excerpt
     *
     * @return clob 
     */
    public function getItemExcerpt()
    {
        return $this->item_excerpt;
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
     * Set item_date_modified
     *
     * @param date $itemDateModified
     */
    public function setItemDateModified($itemDateModified)
    {
        $this->item_date_modified = $itemDateModified;
    }

    /**
     * Get item_date_modified
     *
     * @return date 
     */
    public function getItemDateModified()
    {
        return $this->item_date_modified;
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
     * Set item_parent
     *
     * @param integer $itemParent
     */
    public function setItemParent($itemParent)
    {
        $this->item_parent = $itemParent;
    }

    /**
     * Get item_parent
     *
     * @return integer 
     */
    public function getItemParent()
    {
        return $this->item_parent;
    }
}