<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Entity\User as BaseUser;

/**
 * @ORM\Table(name="zuser")
 * @ORM\Entity
 */
class User extends BaseUser
{
     /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected $id;

    /**
     * @var string
     *
     * @ORM\Column(name="display_name", type="string", length=255, nullable=true)
     */
    private $displayName;

    /**
     * @var string
     *
     * @ORM\Column(name="bio", type="text", nullable=true)
     */
    private $bio;

    /**
     * @var string
     *
     * @ORM\Column(name="thumb_url", type="string", length=255, nullable=true)
     */
    private $thumbUrl;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=true)
     */
    private $createdAt;

    /**
     * @var string
     *
     * @ORM\Column(name="location", type="string", length=140, nullable=true)
     */
    private $location;

    /**
     * @var float
     *
     * @ORM\Column(name="location_latitude", type="float", nullable=true)
     */
    private $locationLatitude;

    /**
     * @var float
     *
     * @ORM\Column(name="location_longitude", type="float", nullable=true)
     */
    private $locationLongitude;

    /**
     * @var string
     *
     * @ORM\Column(name="background_image_url", type="string", length=255, nullable=true)
     */
    private $backgroundImageUrl;

    /**
     * @var string
     *
     * @ORM\Column(name="dropbox_delta", type="string", length=255, nullable=true)
     */
    private $dropboxDelta;

    /**
     * @var string
     *
     * @ORM\Column(name="idea", type="text", nullable=true)
     */
    private $idea;

    /**
     * @var string
     *
     * @ORM\Column(name="api_key", type="string", length=25, nullable=true)
     */
    private $apiKey;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Project", mappedBy="user")
     */
    private $project;

    /**
     * @var string
     *
     * @ORM\Column(name="twitter_id", type="string", nullable=true)
     */
    private $twitterId;

    /**
     * @var string
     *
     * @ORM\Column(name="twitter_username", type="string", nullable=true)
     */

    private $twitterUsername;
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->project = new \Doctrine\Common\Collections\ArrayCollection();
    }
}
