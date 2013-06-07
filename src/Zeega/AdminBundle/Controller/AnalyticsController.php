<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\AdminBundle\Controller;

use Zeega\CoreBundle\Controller\BaseController;
use Symfony\Component\HttpFoundation\Response;

class AnalyticsController extends BaseController
{
    
    public function indexAction( $detail ){
        if($this->container->get('security.context')->isGranted('ROLE_ADMIN')){

            $dm = $this->get('doctrine_mongodb')->getManager(); 
            $currentTime = time();
            $daily = array();
            
            if( $detail == "daily" ){

                $initialTime = mktime ( 0, 0, 0, date("m"), date("d")-3, 2013 );

            } else {

                $initialTime = mktime ( 0, 0, 0, 1, 7, 2013 );
            }
            
            $t = $initialTime;
            $i=0;

            while( $t < $currentTime ){
                
                $dateBegin = new \DateTime( date("Y-m-d H:i:s", $t ));
                $dateEnd = new \DateTime( date("Y-m-d H:i:s", $t+ 24*60*60 )  );
                if( $detail == "daily" ){
                    $countZeegas = $dm->getRepository("ZeegaDataBundle:Project")->findProjectsCountByDates( $dateBegin, $dateEnd );
                    $countUsers = $dm->getRepository("ZeegaDataBundle:User")->findUsersCountByDates( $dateBegin, $dateEnd );
                    $countActiveUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateEnd );
                }
                
                $daily [ $i ] = array( 
                            "date" => date('M d, Y', $t ), 
                            "zeegaCount" => $countZeegas,
                            "userCount" => $countUsers,
                            "activeUserCount" => $countActiveUsers,
                            "dateBegin" => $dateBegin,
                            "dateEnd" => $dateEnd
                );
                $t = $t + 24*60*60;
                $i++;
            }

               return $this->render('ZeegaAdminBundle:Analytics:test.html.twig', array(
                    "daily"=>array_reverse($daily),
                ));

        }
    }

    public function _indexAction( $detail )
    {

        if($this->container->get('security.context')->isGranted('ROLE_ADMIN')){

            $dm = $this->get('doctrine_mongodb')->getManager(); 
            $currentTime = time();
            $daily = array();
            
            if( $detail == "daily" ){

                $initialTime = mktime ( 0, 0, 0, date("m"), date("d")-30, 2013 );

            } else {

                $initialTime = mktime ( 0, 0, 0, 1, 7, 2013 );
            }
            
            $t = $initialTime;
            $i=0;

            while( $t < $currentTime ){
                $dateBegin = date("Y-m-d H:i:s", $t );
                $dateEnd = date("Y-m-d H:i:s",  $t + 24*60*60 );

                if( $detail == "daily" ){
                    $countZeegas = $dm->getRepository("ZeegaDataBundle:Project")->findProjectsCountByDates( $dateBegin, $dateEnd );
                    $countAllNewUsers = $dm->getRepository("ZeegaDataBundle:Project")->findNewUsersCountByDates( $dateBegin, $dateEnd );
                    
                    $countUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateEnd );
                    $countNewUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateEnd, true );
                    $countActiveUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateEnd, null, 1 );
                    $countActiveNewUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateEnd, true, 1 );
                    
                    $daily [ $i ] = array( 
                            "date" => date('M d, Y', $t ), 
                            "count" => $countZeegas[0][1],
                            "allNewUsersCount" => $countAllNewUsers[0][1],
                            "usersCount" => $countUsers[0][1],
                            "newUsersCount" => $countNewUsers[0][1],
                            "activeUsersCount" => $countActiveUsers[0][1],
                            "activeNewUsersCount" => $countActiveNewUsers[0][1],
                            "dateBegin" => $dateBegin,
                            "dateEnd" => $dateEnd
                    );
                }

                if( $i % 7 == 0 ){
                    $dateWeekEnd = date("Y-m-d H:i:s",  $t + 7*24*60*60 );
                    $weekPrevious = date("Y-m-d H:i:s",  $t - 7*24*60*60 );
                    $fourWeekPrevious = date("Y-m-d H:i:s",  $t - 4*7*24*60*60 );

                    $countZeegas = $dm->getRepository("ZeegaDataBundle:Project")->findProjectsCountByDates( $dateBegin, $dateWeekEnd );
                    $countAllNewUsers = $dm->getRepository("ZeegaDataBundle:Project")->findNewUsersCountByDates( $dateBegin, $dateWeekEnd );
                

                    $countUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd );
                    $countNewUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd, true );
                    $countActiveUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd, null, 1 );
                    $countActiveNewUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd, true, 1 );
                    

                    

                    $countActiveReturningUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd, null, 0, $weekPrevious );
                    $countActiveLongReturningUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd, null, 0, $fourWeekPrevious );


                    $weekly [ $i / 7 ] = array( 
                        "date" => "Week of ".date('M d, Y', $t ), 
                        "count" => $countZeegas[0][1],
                        "allNewUsersCount" => $countAllNewUsers[0][1],
                        "usersCount" => $countUsers[0][1], 
                        "newUsersCount" => $countNewUsers[0][1], 
                        "activeUsersCount" => $countActiveUsers[0][1], 
                        "activeNewUsersCount" => $countActiveNewUsers[0][1],
                        "activeReturningUsersCount" => $countActiveReturningUsers[0][1],
                        "activeLongReturningUsersCount" => $countActiveLongReturningUsers[0][1],
                        "dateBegin" => $dateBegin,
                        "dateEnd" => $dateEnd
                    );
                }

                $t = $t + 24*60*60;
                $i++;

            }

            $totalZeegas = $dm->getRepository("ZeegaDataBundle:Project")->findProjectsCountByDates( date("Y-m-d H:i:s",  0 ), date("Y-m-d H:i:s",  $currentTime) );
            $activeUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( date("Y-m-d H:i:s",  0 ), date("Y-m-d H:i:s"), null, 0 );
            $activeOneUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( date("Y-m-d H:i:s",  0 ), date("Y-m-d H:i:s"), null, 1 );
            $activeFiveUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( date("Y-m-d H:i:s",  0 ), date("Y-m-d H:i:s"), null, 5 );
            $activeTenUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( date("Y-m-d H:i:s",  0 ), date("Y-m-d H:i:s"), null, 10 );
            $activeTwentyUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( date("Y-m-d H:i:s",  0 ), date("Y-m-d H:i:s"), null, 20 );
            $activeFiftyUsers = $dm->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( date("Y-m-d H:i:s",  0 ), date("Y-m-d H:i:s"), null, 50 );

            $totals=array(
                    "totalZeegas"=>$totalZeegas[0][1],
                    "activeUsers"=>$activeUsers[0][1],
                    "activeOneUsers"=>$activeOneUsers[0][1],
                    "activeFiveUsers"=>$activeFiveUsers[0][1],
                    "activeTenUsers"=>$activeTenUsers[0][1],
                    "activeTwentyUsers"=>$activeTwentyUsers[0][1],
                    "activeFiftyUsers"=>$activeFiftyUsers[0][1],
                );




            
            return $this->render('ZeegaAdminBundle:Analytics:index.html.twig', array(
                    "daily"=>array_reverse($daily),
                    "weekly"=>array_reverse($weekly),
                    "totals"=>$totals
                ));
        }
    }  
}
