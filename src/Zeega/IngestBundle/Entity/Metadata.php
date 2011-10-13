<?php

// src/Zeega/IngestBundle/Entity/Media.php

namespace Zeega\IngestBundle\Entity;
use Doctrine\Common\Collections\ArrayCollection;

class Metadata
{

	protected $description;
   
    /**
     * @var integer $id
     */
    private $id;


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
     * @var string $alt_creator
     */
    private $alt_creator;

    /**
     * @var string $thumb_url
     */
    private $thumb_url;

    /**
     * @var string $license
     */
    private $license;

    /**
     * @var string $tag_list
     */
    private $tag_list;

    /**
     * @var array $attr
     */
    private $attr;


    /**
     * Set alt_creator
     *
     * @param string $altCreator
     */
    public function setAltCreator($altCreator)
    {
        $this->alt_creator = $altCreator;
    }

    /**
     * Get alt_creator
     *
     * @return string 
     */
    public function getAltCreator()
    {
        return $this->alt_creator;
    }

    /**
     * Set thumb_url
     *
     * @param string $thumbUrl
     */
    public function setThumbUrl($thumbUrl)
    {
        $this->thumb_url = $thumbUrl;
    }

    /**
     * Get thumb_url
     *
     * @return string 
     */
    public function getThumbUrl()
    {
        return $this->thumb_url;
    }

    /**
     * Set license
     *
     * @param string $license
     */
    public function setLicense($license)
    {
        $this->license = $license;
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
     * Set tag_list
     *
     * @param string $tagList
     */
    public function setTagList($tagList)
    {
        $this->tag_list = $tagList;
    }

    /**
     * Get tag_list
     *
     * @return string 
     */
    public function getTagList()
    {
        return $this->tag_list;
    }

    /**
     * Set attr
     *
     * @param array $attr
     */
    public function setAttr($attr)
    {
        $this->attr = $attr;
    }

    /**
     * Get attr
     *
     * @return array 
     */
    public function getAttr()
    {
        return $this->attr;
    }
}