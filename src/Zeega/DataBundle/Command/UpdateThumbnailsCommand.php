<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\DataBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Helper\FormatterHelper;
use Symfony\Component\Console\Helper\DialogHelper;
use Symfony\Component\Console\Formatter\OutputFormatter;
use Symfony\Component\Console\Formatter\OutputFormatterStyle;

use Zeega\CoreBundle\Helpers\ResponseHelper;
use Zeega\DataBundle\Entity\Item;

/**
 * Updates a task status
 *
 */
class UpdateThumbnailsCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */       
    protected function configure()
    {
        $this->setName('zeega:thumbnails:update')
             ->setDescription('Updates thumbnails on Zeega')
             ->setHelp("Help");
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $em = $this->getContainer()->get('doctrine')->getEntityManager();
        $qb = $this->getContainer()->get('doctrine')->getRepository('ZeegaDataBundle:Item')->createQueryBuilder('i');
        
        // search query
        $qb->where('i.thumbnailUrl is null')
           ->andWhere('i.user = 1311')
           ->andWhere("i.mediaType <> 'Collection'")
           ->andWhere("i.mediaType <> 'project'");

        // execute the query
        $results = $qb->getQuery()->getResult();

        $thumbnailService = $this->getContainer()->get('zeega_thumbnail');
        
        foreach($results as $item) {
            $mediaType = $item->getMediaType();
            $layerType = $item->getLayerType();
            $uri = $item->getUri();

            if ($mediaType == "Video" ) {
                if ($layerType == "Youtube") {
                    $uri = "http://img.youtube.com/vi/$uri/0.jpg";    
                } else {
                    continue;
                }
            }
            
            if ($mediaType == "Audio") {
                continue;
            }

            $thumbnail = $thumbnailService->getItemThumbnail($uri);

            if (isset($thumbnail) ) {
                $item->setThumbnailUrl($thumbnail);
                $item->setDateUpdated(new \DateTime("now"));
                $em->persist($item);
                $em->flush();

                $output->writeln($item->getId());
            } else {
                $id = $item->getId();
                $output->writeln("$id uri $uri not supported");                    
            }

            sleep(1);
        }
    }
}
