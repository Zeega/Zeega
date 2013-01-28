<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Item
 *
 * @ORM\Table(
 *      name="item",
 *      indexes={
 *          @ORM\Index(name="media_date_created_index", columns={"media_date_created"}),
 *          @ORM\Index(name="item_type_index", columns={"layer_type"}),
 *          @ORM\Index(name="item_enabled_index", columns={"enabled"}),
 *          @ORM\Index(name="item_description_index", columns={"description"}),
 *          @ORM\Index(name="item_ingested_by_index", columns={"ingested_by"}),
 *          @ORM\Index(name="item_attribution_uri_index", columns={"attribution_uri"}),
 *          @ORM\Index(name="item_uri_index", columns={"uri"}),
 *          @ORM\Index(name="item_date_updated_index", columns={"date_updated"})
 *     }
 * )
 * @ORM\Entity(repositoryClass= "Zeega\DataBundle\Repository\ItemRepository")
 */
class Item
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="bigint", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255, nullable=true)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=500, nullable=true)
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="text", type="text", nullable=true)
     */
    private $text;

    /**
     * @var string
     *
     * @ORM\Column(name="uri", type="string", length=500, nullable=false)
     */
    private $uri;

    /**
     * @var string
     *
     * @ORM\Column(name="attribution_uri", type="string", length=500, nullable=false)
     */
    private $attributionUri;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_created", type="datetime", nullable=true)
     */
    private $dateCreated;

    /**
     * @var string
     *
     * @ORM\Column(name="media_type", type="string", length=20, nullable=false)
     */
    private $mediaType;

    /**
     * @var string
     *
     * @ORM\Column(name="layer_type", type="string", length=20, nullable=false)
     */
    private $layerType;

    /**
     * @var string
     *
     * @ORM\Column(name="thumbnail_url", type="string", length=500, nullable=true)
     */
    private $thumbnailUrl;

    /**
     * @var integer
     *
     * @ORM\Column(name="child_items_count", type="integer", nullable=false)
     */
    private $childItemsCount;

    /**
     * @var float
     *
     * @ORM\Column(name="media_geo_latitude", type="float", nullable=true)
     */
    private $mediaGeoLatitude;

    /**
     * @var float
     *
     * @ORM\Column(name="media_geo_longitude", type="float", nullable=true)
     */
    private $mediaGeoLongitude;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="media_date_created", type="datetime", nullable=true)
     */
    private $mediaDateCreated;

    /**
     * @var string
     *
     * @ORM\Column(name="media_creator_username", type="string", length=80, nullable=false)
     */
    private $mediaCreatorUsername;

    /**
     * @var string
     *
     * @ORM\Column(name="media_creator_realname", type="string", length=80, nullable=true)
     */
    private $mediaCreatorRealname;

    /**
     * @var string
     *
     * @ORM\Column(name="archive", type="string", length=50, nullable=false)
     */
    private $archive;

    /**
     * @var string
     *
     * @ORM\Column(name="location", type="string", length=100, nullable=true)
     */
    private $location;

    /**
     * @var string
     *
     * @ORM\Column(name="license", type="string", length=50, nullable=true)
     */
    private $license;

    /**
     * @var array
     *
     * @ORM\Column(name="attributes", type="array", nullable=true)
     */
    private $attributes;

    /**
     * @var boolean
     *
     * @ORM\Column(name="enabled", type="boolean", nullable=false)
     */
    private $enabled = true;

    /**
     * @var boolean
     *
     * @ORM\Column(name="published", type="boolean", nullable=false)
     */
    private $published;

    /**
     * @var array
     *
     * @ORM\Column(name="tags", type="array", nullable=true)
     */
    private $tags;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_updated", type="datetime", nullable=true)
     */
    private $dateUpdated;

    /**
     * @var string
     *
     * @ORM\Column(name="id_at_source", type="string", length=50, nullable=true)
     */
    private $idAtSource;

    /**
     * @var string
     *
     * @ORM\Column(name="ingested_by", type="string", length=15, nullable=true)
     */
    private $ingestedBy;

    /**
     * @var integer
     *
     * @ORM\Column(name="duration", type="integer", nullable=true)
     */
    private $duration;

    /**
     * @var user
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *  @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=false)
     * })
     */
    private $user;

    /**
     * @ORM\ManyToMany(targetEntity="Item", inversedBy="parentItems", cascade={"persist"})
     * @ORM\JoinTable(name="collection",
     *      joinColumns={@ORM\JoinColumn(name="id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="child_item_id", referencedColumnName="id")}
     *      )
     */
    private $childItems;

    /**
     * @ORM\ManyToMany(targetEntity="Item", mappedBy="childtems", cascade={"persist"})
     */
    private $parentItems;
    
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->childItems = new \Doctrine\Common\Collections\ArrayCollection();
        $this->parentItems = new \Doctrine\Common\Collections\ArrayCollection();
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
     * @return Item
     */
    public function setTitle($title)
    {
        $this->title = $title;
    
        return $this;
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
     * Set description
     *
     * @param string $description
     * @return Item
     */
    public function setDescription($description)
    {
        $this->description = $description;
    
        return $this;
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
     * @param string $text
     * @return Item
     */
    public function setText($text)
    {
        $this->text = $text;
    
        return $this;
    }

    /**
     * Get text
     *
     * @return string 
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * Set uri
     *
     * @param string $uri
     * @return Item
     */
    public function setUri($uri)
    {
        $this->uri = $uri;
    
        return $this;
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
     * Set attributionUri
     *
     * @param string $attributionUri
     * @return Item
     */
    public function setAttributionUri($attributionUri)
    {
        $this->attributionUri = $attributionUri;
    
        return $this;
    }

    /**
     * Get attributionUri
     *
     * @return string 
     */
    public function getAttributionUri()
    {
        return $this->attributionUri;
    }

    /**
     * Set dateCreated
     *
     * @param \DateTime $dateCreated
     * @return Item
     */
    public function setDateCreated($dateCreated)
    {
        $this->dateCreated = $dateCreated;
    
        return $this;
    }

    /**
     * Get dateCreated
     *
     * @return \DateTime 
     */
    public function getDateCreated()
    {
        return $this->dateCreated;
    }

    /**
     * Set mediaType
     *
     * @param string $mediaType
     * @return Item
     */
    public function setMediaType($mediaType)
    {
        $this->mediaType = $mediaType;
    
        return $this;
    }

    /**
     * Get mediaType
     *
     * @return string 
     */
    public function getMediaType()
    {
        return $this->mediaType;
    }

    /**
     * Set layerType
     *
     * @param string $layerType
     * @return Item
     */
    public function setLayerType($layerType)
    {
        $this->layerType = $layerType;
    
        return $this;
    }

    /**
     * Get layerType
     *
     * @return string 
     */
    public function getLayerType()
    {
        return $this->layerType;
    }

    /**
     * Set thumbnailUrl
     *
     * @param string $thumbnailUrl
     * @return Item
     */
    public function setThumbnailUrl($thumbnailUrl)
    {
        $this->thumbnailUrl = $thumbnailUrl;
    
        return $this;
    }

    /**
     * Get thumbnailUrl
     *
     * @return string 
     */
    public function getThumbnailUrl()
    {
        return $this->thumbnailUrl;
    }

    /**
     * Set childItemsCount
     *
     * @param integer $childItemsCount
     * @return Item
     */
    public function setChildItemsCount($childItemsCount)
    {
        $this->childItemsCount = $childItemsCount;
    
        return $this;
    }

    /**
     * Get childItemsCount
     *
     * @return integer 
     */
    public function getChildItemsCount()
    {
        return $this->childItemsCount;
    }

    /**
     * Set mediaGeoLatitude
     *
     * @param float $mediaGeoLatitude
     * @return Item
     */
    public function setMediaGeoLatitude($mediaGeoLatitude)
    {
        $this->mediaGeoLatitude = $mediaGeoLatitude;
    
        return $this;
    }

    /**
     * Get mediaGeoLatitude
     *
     * @return float 
     */
    public function getMediaGeoLatitude()
    {
        return $this->mediaGeoLatitude;
    }

    /**
     * Set mediaGeoLongitude
     *
     * @param float $mediaGeoLongitude
     * @return Item
     */
    public function setMediaGeoLongitude($mediaGeoLongitude)
    {
        $this->mediaGeoLongitude = $mediaGeoLongitude;
    
        return $this;
    }

    /**
     * Get mediaGeoLongitude
     *
     * @return float 
     */
    public function getMediaGeoLongitude()
    {
        return $this->mediaGeoLongitude;
    }

    /**
     * Set mediaDateCreated
     *
     * @param \DateTime $mediaDateCreated
     * @return Item
     */
    public function setMediaDateCreated($mediaDateCreated)
    {
        $this->mediaDateCreated = $mediaDateCreated;
    
        return $this;
    }

    /**
     * Get mediaDateCreated
     *
     * @return \DateTime 
     */
    public function getMediaDateCreated()
    {
        return $this->mediaDateCreated;
    }

    /**
     * Set mediaCreatorUsername
     *
     * @param string $mediaCreatorUsername
     * @return Item
     */
    public function setMediaCreatorUsername($mediaCreatorUsername)
    {
        $this->mediaCreatorUsername = $mediaCreatorUsername;
    
        return $this;
    }

    /**
     * Get mediaCreatorUsername
     *
     * @return string 
     */
    public function getMediaCreatorUsername()
    {
        return $this->mediaCreatorUsername;
    }

    /**
     * Set mediaCreatorRealname
     *
     * @param string $mediaCreatorRealname
     * @return Item
     */
    public function setMediaCreatorRealname($mediaCreatorRealname)
    {
        $this->mediaCreatorRealname = $mediaCreatorRealname;
    
        return $this;
    }

    /**
     * Get mediaCreatorRealname
     *
     * @return string 
     */
    public function getMediaCreatorRealname()
    {
        return $this->mediaCreatorRealname;
    }

    /**
     * Set archive
     *
     * @param string $archive
     * @return Item
     */
    public function setArchive($archive)
    {
        $this->archive = $archive;
    
        return $this;
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
     * Set location
     *
     * @param string $location
     * @return Item
     */
    public function setLocation($location)
    {
        $this->location = $location;
    
        return $this;
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
     * Set license
     *
     * @param string $license
     * @return Item
     */
    public function setLicense($license)
    {
        $this->license = $license;
    
        return $this;
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
     * @return Item
     */
    public function setAttributes($attributes)
    {
        $this->attributes = $attributes;
    
        return $this;
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
     * Set enabled
     *
     * @param boolean $enabled
     * @return Item
     */
    public function setEnabled($enabled)
    {
        $this->enabled = $enabled;
    
        return $this;
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
     * @return Item
     */
    public function setPublished($published)
    {
        $this->published = $published;
    
        return $this;
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
     * Set tags
     *
     * @param array $tags
     * @return Item
     */
    public function setTags($tags)
    {
        $this->tags = $tags;
    
        return $this;
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
     * Set dateUpdated
     *
     * @param \DateTime $dateUpdated
     * @return Item
     */
    public function setDateUpdated($dateUpdated)
    {
        $this->dateUpdated = $dateUpdated;
    
        return $this;
    }

    /**
     * Get dateUpdated
     *
     * @return \DateTime 
     */
    public function getDateUpdated()
    {
        return $this->dateUpdated;
    }

    /**
     * Set idAtSource
     *
     * @param string $idAtSource
     * @return Item
     */
    public function setIdAtSource($idAtSource)
    {
        $this->idAtSource = $idAtSource;
    
        return $this;
    }

    /**
     * Get idAtSource
     *
     * @return string 
     */
    public function getIdAtSource()
    {
        return $this->idAtSource;
    }

    /**
     * Set ingestedBy
     *
     * @param string $ingestedBy
     * @return Item
     */
    public function setIngestedBy($ingestedBy)
    {
        $this->ingestedBy = $ingestedBy;
    
        return $this;
    }

    /**
     * Get ingestedBy
     *
     * @return string 
     */
    public function getIngestedBy()
    {
        return $this->ingestedBy;
    }

    /**
     * Set duration
     *
     * @param integer $duration
     * @return Item
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;
    
        return $this;
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
     * Set user
     *
     * @param \Zeega\DataBundle\Entity\User $user
     * @return Item
     */
    public function setUser(\Zeega\DataBundle\Entity\User $user)
    {
        $this->user = $user;
    
        return $this;
    }

    /**
     * Get user
     *
     * @return \Zeega\DataBundle\Entity\User 
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Add childItems
     *
     * @param \Zeega\DataBundle\Entity\Item $childItems
     * @return Item
     */
    public function addChildItem(\Zeega\DataBundle\Entity\Item $childItems)
    {
        $this->childItems[] = $childItems;
    
        return $this;
    }

    /**
     * Remove childItems
     *
     * @param \Zeega\DataBundle\Entity\Item $childItems
     */
    public function removeChildItem(\Zeega\DataBundle\Entity\Item $childItems)
    {
        $this->childItems->removeElement($childItems);
    }

    /**
     * Get childItems
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getChildItems()
    {
        return $this->childItems;
    }

    /**
     * Add parentItems
     *
     * @param \Zeega\DataBundle\Entity\Item $parentItems
     * @return Item
     */
    public function addParentItem(\Zeega\DataBundle\Entity\Item $parentItems)
    {
        $this->parentItems[] = $parentItems;
    
        return $this;
    }

    /**
     * Remove parentItems
     *
     * @param \Zeega\DataBundle\Entity\Item $parentItems
     */
    public function removeParentItem(\Zeega\DataBundle\Entity\Item $parentItems)
    {
        $this->parentItems->removeElement($parentItems);
    }

    /**
     * Get parentItems
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getParentItems()
    {
        return $this->parentItems;
    }
}
