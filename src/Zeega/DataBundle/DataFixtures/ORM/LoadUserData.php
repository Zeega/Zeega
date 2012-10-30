<?php

// src/Acme/HelloBundle/DataFixtures/ORM/LoadUserData.php
namespace Zeega\DataBundle\DataFixtures\ORM;

use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Zeega\DataBundle\Entity\User;
use Zeega\DataBundle\Entity\Site;
use Zeega\DataBundle\Entity\UserSites;

class LoadUserData implements FixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $userAdmin = new User();
        $userAdmin->setDisplayName('Admin');
        $userAdmin->setEmail('test@zeega.org');
        $userAdmin->setUserName('zeega');
        $userAdmin->setEnabled(true);
        $userAdmin->setPlainPassword(mt_rand());
        $userAdmin->setSuperAdmin(true);
        $userAdmin->setUserType("User");

        $manager->persist($userAdmin);

        $manager->flush();
    }
}