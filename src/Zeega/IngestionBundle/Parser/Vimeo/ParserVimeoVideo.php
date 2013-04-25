<?php

namespace Zeega\IngestionBundle\Parser\Vimeo;

use Zeega\IngestionBundle\Parser\Base\ParserAbstract;
use Zeega\DataBundle\Document\Item;

use \DateTime;
use SimpleXMLElement;

class ParserVimeoVideo extends ParserAbstract
{
	public function load($url, $parameters = null)
    {
        $regexMatches = $parameters["regex_matches"];
        $itemId = $regexMatches[1]; // bam
        
		$originalUrl = 'http://vimeo.com/api/v2/video/'.$itemId.'.json';

		// read feed into SimpleXML object
		$entry = json_decode(file_get_contents(($originalUrl)));
		
		$entry=$entry[0];
		$item= new Item();
		
		$item->setUri((string)$entry->id);

		$item->setTitle((string)$entry->title);
		$item->setDescription((string)$entry->description);
		$item->setAttributionUri('http://vimeo.com/'.$item->getUri());
		$item->setDateCreated(new \DateTime((string)$entry->upload_date));
		$item->setMediaType('Video');
		$item->setLayerType('Vimeo');
		$item->setChildItemsCount(0);


		// TODO: ADD TAGS
        $tags = (string)$entry->tags;
        if(isset($tags)) 
		{
		    $tags = explode(", ", $tags);
		    $itemTags = array();
		    foreach($tags as $tagName)
			{
			    if(!empty($tagName))
			    {
                	foreach($tags as $tag)
        			{
        			    array_push($itemTags, $tag);
        			}
                    $item->setTags($itemTags);
                }
			}
		}
        
		$item->setMediaCreatorUsername((string)$entry->user_name);
		$item->setMediaCreatorRealname('Unknown');

		
		// write metadata
		$item->setArchive('Vimeo');
		/*
		$metadata->setLicense((string)$entry->embed_privacy);
		$metadata->setThumbnailUrl((string)$entry->thumbnail_medium);
		*/
		$item->setThumbnailUrl((string)$entry->thumbnail_medium);
		
		/*

		// write media information
		$media->setDuration((string)$entry->duration);
		$media->setWidth((string)$entry->width);
		$media->setHeight((string)$entry->height);

		
		$item->setMetadata($metadata);
		$item->setMedia($media);
*/
		return $this->returnResponse($item, true, false);
	}
}
