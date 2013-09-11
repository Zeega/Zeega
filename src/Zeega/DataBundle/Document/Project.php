<?php

namespace Zeega\DataBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document(repositoryClass="Zeega\DataBundle\Repository\ProjectRepository")
 */
class Project
{
    /**
     * @MongoDB\Id(strategy="auto")
     */
    protected $id;

    /**
     * @MongoDB\Field(type="string", name="public_id")
     */
    protected $publicId;

    /**
     * @MongoDB\Field(type="int",name="rdbms_id")
     */
    protected $rdbmsId;

    /**
     * @MongoDB\Field(type="int",name="rdbms_id_published")
     */
    protected $rdbmsIdPublished;

    /**
     * @MongoDB\String
     */
    protected $title;

    /**
     * @MongoDB\Boolean
     */
    protected $published;

    /**
     * @MongoDB\Boolean
     */
    protected $mobile;

    /**
     * @MongoDB\Field(type="date",name="date_created")
     */
    protected $dateCreated;

    /**
     * @MongoDB\Boolean
     */
    protected $enabled = true;

    /**
     * @MongoDB\String
     */
    protected $authors;

    /**
     * @MongoDB\Field(type="string",name="cover_image")
     */
    protected $coverImage;

    /**
     * @MongoDB\Field(type="string",name="estimated_time")
     */
    protected $estimatedTime;

    /**
     * @MongoDB\Field(type="date",name="date_updated")
     */
    protected $dateUpdated;

    /**
     * @MongoDB\Field(type="date",name="date_tags_updated")
     */
    protected $dateTagsUpdated;

    /**
     * @MongoDB\Field(type="int",name="item_id")
     */
    protected $itemId;

    /**
     * @MongoDB\String
     */
    protected $description;

    /**
     * @MongoDB\String
     */
    protected $location;

    /**
     * @MongoDB\Field(type="date",name="date_published")
     */
    protected $datePublished;

    /**
     * @MongoDB\Float
     */
    protected $version;

    /**
     * @MongoDB\Int
     */
    protected $views;

    /**
     * @MongoDB\Boolean
     */
    protected $editable = true;

    /**
     * @MongoDB\Boolean
     */
    protected $remixable;

    /**
     * @MongoDB\ReferenceOne(targetDocument="Project", name="root_project")
     */    
    protected $rootProject;   

    /**
     * @MongoDB\ReferenceOne(targetDocument="Project", name="parent_project")
     */    
    protected $parentProject;   

    /**
     * @MongoDB\ReferenceOne(targetDocument="User")
     */
    protected $user;

    /**
     * @MongoDB\EmbedMany(targetDocument="Sequence")
     */
    protected $sequences;

    /**
     * @MongoDB\EmbedMany(targetDocument="Frame")
     */
    protected $frames;

    /**
     * @MongoDB\EmbedMany(targetDocument="Layer")
     */
    protected $layers;

    /**
     * @MongoDB\Collection(strategy="pushAll")
     */
    protected $tags;

    /**
     * @MongoDB\ReferenceMany(targetDocument="Favorite", mappedBy="project")
     */
    protected $favorites;

    /**     
     * @MongoDB\Field(type="boolean",name="email_notifications_popular")
     */
    protected $emailNotificationsOnPopular = true;

    public function __construct()
    {
        $this->users = new \Doctrine\Common\Collections\ArrayCollection();
        $this->sequences = new \Doctrine\Common\Collections\ArrayCollection();
        $this->frames = new \Doctrine\Common\Collections\ArrayCollection();
        $this->layers = new \Doctrine\Common\Collections\ArrayCollection();
        $this->tags = array();
    }

    public function __clone()
    {
        if ($this->id) {
            $this->id = new \MongoId();
            $this->date_created = new \DateTime();
            $this->sequences = new \Doctrine\Common\Collections\ArrayCollection(
                $this->sequences->toArray()
            );
            $this->frames = new \Doctrine\Common\Collections\ArrayCollection(
                $this->frames->toArray()
            );
            $this->layers = new \Doctrine\Common\Collections\ArrayCollection(
                $this->layers->toArray()
            );

            $this->authors = null;
            $this->views = 0;
        }
    }


    /**
     * Get id
     *
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set publicId
     *
     * @param string $publicId
     * @return self
     */
    public function setPublicId($publicId)
    {
        $this->publicId = $publicId;
        return $this;
    }

    /**
     * Get publicId
     *
     * @return string $publicId
     */
    public function getPublicId()
    {
        return $this->publicId;
    }

    /**
     * Set rdbmsId
     *
     * @param int $rdbmsId
     * @return self
     */
    public function setRdbmsId($rdbmsId)
    {
        $this->rdbmsId = $rdbmsId;
        return $this;
    }

    /**
     * Get rdbmsId
     *
     * @return int $rdbmsId
     */
    public function getRdbmsId()
    {
        return $this->rdbmsId;
    }

    /**
     * Set rdbmsIdPublished
     *
     * @param int $rdbmsIdPublished
     * @return self
     */
    public function setRdbmsIdPublished($rdbmsIdPublished)
    {
        $this->rdbmsIdPublished = $rdbmsIdPublished;
        return $this;
    }

    /**
     * Get rdbmsIdPublished
     *
     * @return int $rdbmsIdPublished
     */
    public function getRdbmsIdPublished()
    {
        return $this->rdbmsIdPublished;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return self
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * Get title
     *
     * @return string $title
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set published
     *
     * @param boolean $published
     * @return self
     */
    public function setPublished($published)
    {
        $this->published = $published;
        return $this;
    }

    /**
     * Get published
     *
     * @return boolean $published
     */
    public function getPublished()
    {
        return $this->published;
    }

    /**
     * Set mobile
     *
     * @param boolean $mobile
     * @return self
     */
    public function setMobile($mobile)
    {
        $this->mobile = $mobile;
        return $this;
    }

    /**
     * Get mobile
     *
     * @return boolean $mobile
     */
    public function getMobile()
    {
        return $this->mobile;
    }

    /**
     * Set dateCreated
     *
     * @param date $dateCreated
     * @return self
     */
    public function setDateCreated($dateCreated)
    {
        $this->dateCreated = $dateCreated;
        return $this;
    }

    /**
     * Get dateCreated
     *
     * @return date $dateCreated
     */
    public function getDateCreated()
    {
        return $this->dateCreated;
    }

    /**
     * Set enabled
     *
     * @param boolean $enabled
     * @return self
     */
    public function setEnabled($enabled)
    {
        $this->enabled = $enabled;
        return $this;
    }

    /**
     * Get enabled
     *
     * @return boolean $enabled
     */
    public function getEnabled()
    {
        return $this->enabled;
    }

    /**
     * Set authors
     *
     * @param string $authors
     * @return self
     */
    public function setAuthors($authors)
    {
        $this->authors = $authors;
        return $this;
    }

    /**
     * Get authors
     *
     * @return string $authors
     */
    public function getAuthors()
    {
        return $this->authors;
    }

    /**
     * Set coverImage
     *
     * @param string $coverImage
     * @return self
     */
    public function setCoverImage($coverImage)
    {
        $this->coverImage = $coverImage;
        return $this;
    }

    /**
     * Get coverImage
     *
     * @return string $coverImage
     */
    public function getCoverImage()
    {
        return $this->coverImage;
    }

    /**
     * Set estimatedTime
     *
     * @param string $estimatedTime
     * @return self
     */
    public function setEstimatedTime($estimatedTime)
    {
        $this->estimatedTime = $estimatedTime;
        return $this;
    }

    /**
     * Get estimatedTime
     *
     * @return string $estimatedTime
     */
    public function getEstimatedTime()
    {
        return $this->estimatedTime;
    }

    /**
     * Set dateUpdated
     *
     * @param date $dateUpdated
     * @return self
     */
    public function setDateUpdated($dateUpdated)
    {
        $this->dateUpdated = $dateUpdated;
        return $this;
    }

    /**
     * Get dateUpdated
     *
     * @return date $dateUpdated
     */
    public function getDateUpdated()
    {
        return $this->dateUpdated;
    }

    /**
     * Set dateTagsUpdated
     *
     * @param date $dateTagsUpdated
     * @return self
     */
    public function setDateTagsUpdated($dateTagsUpdated)
    {
        $this->dateTagsUpdated = $dateTagsUpdated;
        return $this;
    }

    /**
     * Get dateTagsUpdated
     *
     * @return date $dateTagsUpdated
     */
    public function getDateTagsUpdated()
    {
        return $this->dateTagsUpdated;
    }

    /**
     * Set itemId
     *
     * @param int $itemId
     * @return self
     */
    public function setItemId($itemId)
    {
        $this->itemId = $itemId;
        return $this;
    }

    /**
     * Get itemId
     *
     * @return int $itemId
     */
    public function getItemId()
    {
        return $this->itemId;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return self
     */
    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }

    /**
     * Get description
     *
     * @return string $description
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set location
     *
     * @param string $location
     * @return self
     */
    public function setLocation($location)
    {
        $this->location = $location;
        return $this;
    }

    /**
     * Get location
     *
     * @return string $location
     */
    public function getLocation()
    {
        return $this->location;
    }

    /**
     * Set datePublished
     *
     * @param date $datePublished
     * @return self
     */
    public function setDatePublished($datePublished)
    {
        $this->datePublished = $datePublished;
        return $this;
    }

    /**
     * Get datePublished
     *
     * @return date $datePublished
     */
    public function getDatePublished()
    {
        return $this->datePublished;
    }

    /**
     * Set version
     *
     * @param float $version
     * @return self
     */
    public function setVersion($version)
    {
        $this->version = $version;
        return $this;
    }

    /**
     * Get version
     *
     * @return float $version
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * Set views
     *
     * @param int $views
     * @return self
     */
    public function setViews($views)
    {
        $this->views = $views;
        return $this;
    }

    /**
     * Get views
     *
     * @return int $views
     */
    public function getViews()
    {
        return $this->views;
    }

    /**
     * Set editable
     *
     * @param boolean $editable
     * @return self
     */
    public function setEditable($editable)
    {
        $this->editable = $editable;
        return $this;
    }

    /**
     * Get editable
     *
     * @return boolean $editable
     */
    public function getEditable()
    {
        return $this->editable;
    }

    /**
     * Set rootProject
     *
     * @param Zeega\DataBundle\Document\Project $rootProject
     * @return self
     */
    public function setRootProject(\Zeega\DataBundle\Document\Project $rootProject)
    {
        $this->rootProject = $rootProject;
        return $this;
    }

    /**
     * Get rootProject
     *
     * @return Zeega\DataBundle\Document\Project $rootProject
     */
    public function getRootProject()
    {
        return $this->rootProject;
    }

    /**
     * Set parentProject
     *
     * @param Zeega\DataBundle\Document\Project $parentProject
     * @return self
     */
    public function setParentProject(\Zeega\DataBundle\Document\Project $parentProject)
    {
        $this->parentProject = $parentProject;
        return $this;
    }

    /**
     * Get parentProject
     *
     * @return Zeega\DataBundle\Document\Project $parentProject
     */
    public function getParentProject()
    {
        return $this->parentProject;
    }

    /**
     * Set user
     *
     * @param Zeega\DataBundle\Document\User $user
     * @return self
     */
    public function setUser(\Zeega\DataBundle\Document\User $user)
    {
        $this->user = $user;
        return $this;
    }

    /**
     * Get user
     *
     * @return Zeega\DataBundle\Document\User $user
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Add sequences
     *
     * @param Zeega\DataBundle\Document\Sequence $sequences
     */
    public function addSequence(\Zeega\DataBundle\Document\Sequence $sequences)
    {
        $this->sequences[] = $sequences;
    }

    /**
     * Remove sequences
     *
     * @param Zeega\DataBundle\Document\Sequence $sequences
     */
    public function removeSequence(\Zeega\DataBundle\Document\Sequence $sequences)
    {
        $this->sequences->removeElement($sequences);
    }

    /**
     * Get sequences
     *
     * @return Doctrine\Common\Collections\Collection $sequences
     */
    public function getSequences()
    {
        return $this->sequences;
    }

    /**
     * Set sequences
     *
     */
    public function setSequences(\Doctrine\Common\Collections\ArrayCollection $sequences)
    {
        $this->sequences = $sequences;
    }


    /**
     * Add frames
     *
     * @param Zeega\DataBundle\Document\Frame $frames
     */
    public function addFrame(\Zeega\DataBundle\Document\Frame $frames)
    {
        $this->frames[] = $frames;
    }

    /**
     * Remove frames
     *
     * @param Zeega\DataBundle\Document\Frame $frames
     */
    public function removeFrame(\Zeega\DataBundle\Document\Frame $frames)
    {
        $this->frames->removeElement($frames);
    }

    /**
     * Get frames
     *
     * @return Doctrine\Common\Collections\Collection $frames
     */
    public function getFrames()
    {
        return $this->frames;
    }
    
    /**
     * Set frames
     *
     */
    public function setFrames(\Doctrine\Common\Collections\ArrayCollection $frames)
    {
        $this->frames = $frames;
    }


    /**
     * Add layers
     *
     * @param Zeega\DataBundle\Document\Layer $layers
     */
    public function addLayer(\Zeega\DataBundle\Document\Layer $layers)
    {
        $this->layers[] = $layers;
    }

    /**
     * Remove layers
     *
     * @param Zeega\DataBundle\Document\Layer $layers
     */
    public function removeLayer(\Zeega\DataBundle\Document\Layer $layers)
    {
        $this->layers->removeElement($layers);
    }

    /**
     * Get layers
     *
     * @return Doctrine\Common\Collections\Collection $layers
     */
    public function getLayers()
    {
        return $this->layers;
    }

    /**
     * Set layers
     *
     */
    public function setLayers(\Doctrine\Common\Collections\ArrayCollection $layers)
    {
        $this->layers = $layers;
    }

    /**
     * Add favorites
     *
     * @param Zeega\DataBundle\Document\Favorite $favorites
     */
    public function addFavorite(\Zeega\DataBundle\Document\Favorite $favorites)
    {
        $this->favorites[] = $favorites;
    }

    /**
     * Remove favorites
     *
     * @param Zeega\DataBundle\Document\Favorite $favorites
     */
    public function removeFavorite(\Zeega\DataBundle\Document\Favorite $favorites)
    {
        $this->favorites->removeElement($favorites);
    }

    /**
     * Get favorites
     *
     * @return Doctrine\Common\Collections\Collection $favorites
     */
    public function getFavorites()
    {
        return $this->favorites;
    }

    /**
     * Set emailNotificationsOnPopular
     *
     * @param boolean $emailNotificationsOnPopular
     * @return self
     */
    public function setEmailNotificationsOnPopular($emailNotificationsOnPopular)
    {
        $this->emailNotificationsOnPopular = $emailNotificationsOnPopular;
        return $this;
    }

    /**
     * Get emailNotificationsOnPopular
     *
     * @return boolean $emailNotificationsOnPopular
     */
    public function getEmailNotificationsOnPopular()
    {
        return $this->emailNotificationsOnPopular;
    }

    /**
     * Set remixable
     *
     * @param boolean $remixable
     * @return self
     */
    public function setRemixable($remixable)
    {
        $this->remixable = $remixable;
        return $this;
    }

    /**
     * Get remixable
     *
     * @return boolean $remixable
     */
    public function getRemixable()
    {
        return $this->remixable;
    }

    /**
     * Get tags
     *
     * @return collection $tags
     */
    public function getTags()
    {
        if (!isset($this->tags)) {
            $this->tags = array();
        }
        return $this->tags;
    }

     /**
     * Add a single tag
     *
     * @param collection $tags
     * @return self
     */
    public function addTag($tag)
    {
        if (isset($tag) && is_string($tag)) {
            $tag = $this->sanitizeTag($tag);

            if (isset($tag) && !isset($this->tags[$tag])) {
                $this->tags[] = $tag;    
            }
        }
        
        return $this;
    }

    private function sanitizeTag($tag)
    {
        if(isset($tag) && is_string($tag)) {
            $tag = preg_replace("/(\n|\r)*/","",$tag);
            $tag = preg_replace("/\s\s+/", "-",$tag);
            /* should non-alphanumeric characters be removed ?
            $tag = preg_replace("/[^A-Za-z0-9 ]/", '', $tag);
            */
            return $tag;
        }

        return null;
    }
}
