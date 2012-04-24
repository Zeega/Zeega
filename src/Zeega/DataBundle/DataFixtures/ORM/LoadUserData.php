<?php

// src/Acme/HelloBundle/DataFixtures/ORM/LoadUserData.php
namespace Zeega\DataBundle\DataFixtures\ORM;

use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Zeega\DataBundle\Entity\User;
use Zeega\DataBundle\Entity\Site;

class LoadUserData implements FixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $site = new Site();
        $site->setTitle('Home');
        $site->setShort('home');
        $site->setPublished(true);
        $site->setDateCreated(new \DateTime("now"));
        
        $manager->persist($site);
        $manager->flush();
        
        $userAdmin = new User();
        $userAdmin->addSite($site);
        $userAdmin->setDisplayName('Admin');
        $userAdmin->setEmail('test@zeega.org');
        $userAdmin->setUserName('zeega');
        $userAdmin->setEnabled(true);
        $userAdmin->setPlainPassword(mt_rand());
        $userAdmin->setSuperAdmin(true);

        $manager->persist($userAdmin);
        $manager->flush();
    }
}