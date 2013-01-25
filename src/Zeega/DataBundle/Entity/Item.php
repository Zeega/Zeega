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
    private $enabled;

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
     * @ORM\ManyToMany(targetEntity="Item", inversedBy="parentItems")
     * @ORM\JoinTable(name="collection",
     *      joinColumns={@ORM\JoinColumn(name="id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="child_item_id", referencedColumnName="id")}
     *      )
     */
    private $childItems;

    /**
     * @ORM\ManyToMany(targetEntity="Item", mappedBy="childtems")
     */
    private $parentItems;
    
}
