<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Frame
 *
 * @ORM\Table(
 *      name="frame",
 *      indexes={
 *          @ORM\Index(name="frame_enabled", columns={"enabled"}),
 *          @ORM\Index(name="frame_project_id_index", columns={"project_id"})
 *      }
 * )
 * @ORM\Entity
 */
class Frame
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var integer
     *
     * @ORM\Column(name="sequence_index", type="integer", nullable=true)
     */
    private $sequenceIndex;

    /**
     * @var array
     *
     * @ORM\Column(name="layers", type="array", nullable=true)
     */
    private $layers;

    /**
     * @var array
     *
     * @ORM\Column(name="attr", type="array", nullable=true)
     */
    private $attr;

    /**
     * @var string
     *
     * @ORM\Column(name="thumbnail_url", type="string", length=101, nullable=true)
     */
    private $thumbnailUrl;

    /**
     * @var boolean
     *
     * @ORM\Column(name="enabled", type="boolean", nullable=true)
     */
    private $enabled;

    /**
     * @var boolean
     *
     * @ORM\Column(name="controllable", type="boolean", nullable=true)
     */
    private $controllable;

    /**
     * @var \Sequence
     *
     * @ORM\ManyToOne(targetEntity="Sequence")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="sequence_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     * })
     */
    private $sequence;

    /**
     * @var \Project
     *
     * @ORM\ManyToOne(targetEntity="Project")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="project_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     * })
     */
    private $project;


}
