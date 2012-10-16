<?php

// src/Acme/DemoBundle/Command/GreetCommand.php
namespace Zeega\CoreBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Helper\FormatterHelper;
use Symfony\Component\Console\Helper\DialogHelper;
use Symfony\Component\Console\Formatter\OutputFormatter;
use Symfony\Component\Console\Formatter\OutputFormatterStyle;

use Zeega\CoreBundle\Generator\ParserGenerator;
use Zeega\CoreBundle\Generator\Generator;
use Zeega\CoreBundle\Helpers\ResponseHelper;
use Zeega\DataBundle\Entity\Item;

class PersistCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('zeega:persist')
             ->setDescription('Bulk data parser')
             ->addOption('file_path', null, InputOption::VALUE_REQUIRED, 'Url of the item or collection to be ingested')
             ->addOption('user', null, InputOption::VALUE_REQUIRED, 'Url of the item or collection to be ingested')
             ->setHelp("Help");
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $logger = $this->getContainer()->get('logger');
        $logger->info('We just got the logger');
        $filePath = $input->getOption('file_path');
        $userId = $input->getOption('user');
        
        if(null === $filePath)
        {
            $output->writeln('');
            $output->writeln('Please run the operation with the --file_path and --user options to execute');
            $output->writeln('');
        }
        else
        {
            $em = $this->getContainer()->get('doctrine')->getEntityManager();

            $user = $em->getRepository('ZeegaDataBundle:User')->findOneById($userId);

            $item = json_decode(file_get_contents($filePath),true);
            $items = $item["items"]; // hammer

            foreach($items as $item)
            {
                $item = self::parseItem($item, $user);
                $em->persist($item);
            }
            
            $em->flush($item);

            $output->writeln($item->getTitle());
        }
    }

    private function parseItem($itemArray, $user)
    {
        $title = $itemArray['title'];
        $description = $itemArray['description'];
        $text = $itemArray['text'];
        $uri = $itemArray['uri'];
        $attributionUri = $itemArray['attribution_uri'];
        $mediaType = $itemArray['media_type'];
        $layerType = $itemArray['layer_type'];
        $thumbnailUrl = $itemArray['thumbnail_url'];
        $mediaGeoLatitude = $itemArray['media_geo_latitude'];
        $mediaGeoLongitude = $itemArray['media_geo_longitude'];
        $mediaDateCreated = $itemArray['media_date_created'];
        $mediaCreatorUsername = $itemArray['media_creator_username'];
        $mediaCreatorRealname = $itemArray['media_creator_realname'];
        $archive = $itemArray['archive'];
        $attributes = $itemArray['attributes'];
        $tags = $itemArray['tags'];
        $published = $itemArray['published'];
        $childItems = $itemArray['child_items'];
            
        $item = new Item();
        $item->setDateCreated(new \DateTime("now"));
        $item->setDateUpdated(new \DateTime("now"));
        $item->setChildItemsCount(0);
        $item->setUser($user);
        
        if(isset($site)) $item->setSite($site); 
        if(isset($title)) $item->setTitle($title);
        if(isset($description)) $item->setDescription($description);
        if(isset($text)) $item->setText($text);
        if(isset($uri)) $item->setUri($uri);
        if(isset($attributionUri)) $item->setAttributionUri($attributionUri);
        if(isset($mediaType)) $item->setMediaType($mediaType);
        if(isset($layerType)) $item->setLayerType($layerType);
        if(isset($thumbnailUrl)) $item->setThumbnailUrl($thumbnailUrl);
        if(isset($mediaGeoLatitude)) $item->setMediaGeoLatitude($mediaGeoLatitude);
        if(isset($mediaGeoLongitude)) $item->setMediaGeoLongitude($mediaGeoLongitude);
        
        if(isset($mediaDateCreated)) 
        {
            $parsedDate = strtotime($mediaDateCreated);
            if($parsedDate)
            {
                $d = date("Y-m-d h:i:s",$parsedDate);
                $item->setMediaDateCreated(new \DateTime($d));
            }
        }

        if(isset($mediaCreatorUsername))
        {
            $item->setMediaCreatorUsername($mediaCreatorUsername);
        }

        if(isset($mediaCreatorRealname))
        {
            $item->setMediaCreatorRealname($mediaCreatorRealname);
        }
            
        if(isset($archive)) $item->setArchive($archive);
        if(isset($itemArray['location'])) $item->setLocation($itemArray['location']);
        if(isset($itemArray['license'])) $item->setLicense($itemArray['license']);
        if(isset($attributes)) $item->setAttributes($attributes);
        if(isset($tags)) $item->setTags($tags);
        if(isset($published)) $item->setPublished($published);
        
        $item->setEnabled(true);
        $item->setIndexed(false);
        $item->setPublished(false);
        
        if(isset($itemArray["child_items"]))
        {
            foreach($itemArray["child_items"] as $child_item)
            {
                $child = self::parseItem($child_item, $user);
                if(isset($child))
                {
                    $item->addItem($child);    
                }
            }
        }

        return $item;
    }
}
