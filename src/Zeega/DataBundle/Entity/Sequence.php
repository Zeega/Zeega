<?php

namespace Zeega\DataBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Sequence
 *
 * @ORM\Table(
 *      name="sequence",
 *      indexes={
 *          @ORM\Index(name="sequence_enabled", columns={"enabled"}),
 *          @ORM\Index(name="sequence_project_id_index", columns={"project_id"})
 *      }
 * )
 * @ORM\Entity
 */
class Sequence
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
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255, nullable=false)
     */
    private $title;

    /**
     * @var array
     *
     * @ORM\Column(name="attr", type="array", nullable=true)
     */
    private $attr;

    /**
     * @var boolean
     *
     * @ORM\Column(name="enabled", type="boolean", nullable=true)
     */
    private $enabled;

    /**
     * @var array
     *
     * @ORM\Column(name="persistent_layers", type="array", nullable=true)
     */
    private $persistentLayers;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=140, nullable=true)
     */
    private $description;

    /**
     * @var integer
     *
     * @ORM\Column(name="advance_to", type="integer", nullable=true)
     */
    private $advanceTo;

    /**
     * @var \Project
     *
     * @ORM\ManyToOne(targetEntity="Project")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="project_id", referencedColumnName="id", onDelete="CASCADE", nullable=false)
     * })
     */
    private $project;


}
