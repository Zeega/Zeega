<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *  Schedule
 *
 *  @ORM\Table(
 *     name="schedule",
 *     indexes={
 *          @ORM\Index(name="schedule_status", columns={"status"}),
 *          @ORM\Index(name="schedule_enabled", columns={"enabled"})
 *      }
 *  )
 *  @ORM\Entity
 */
class Schedule
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
     * @ORM\Column(name="query", type="string", length=100, nullable=true)
     */
    private $query;

    /**
     * @var string
     *
     * @ORM\Column(name="tags", type="string", length=100, nullable=true)
     */
    private $tags;

    /**
     * @var string
     *
     * @ORM\Column(name="archive", type="string", length=25, nullable=false)
     */
    private $archive;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_created", type="datetime", nullable=false)
     */
    private $dateCreated;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_updated", type="datetime", nullable=false)
     */
    private $dateUpdated;

    /**
     * @var string
     *
     * @ORM\Column(name="status", type="string", length=10, nullable=false)
     */
    private $status;

    /**
     * @var string
     *
     * @ORM\Column(name="status_message", type="string", length=255, nullable=true)
     */
    private $statusMessage;

    /**
     * @var boolean
     *
     * @ORM\Column(name="enabled", type="boolean", nullable=false)
     */
    private $enabled;

    /**
     * @var \user
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * })
     */
    private $user;


}
