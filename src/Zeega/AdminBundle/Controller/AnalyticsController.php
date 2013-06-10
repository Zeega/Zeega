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
    public function indexAction( $detail )
    {
        
        if($this->container->get('security.context')->isGranted('ROLE_ADMIN')){


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
                $dateBegin =  new \DateTime(date("Y-m-d H:i:s", $t ));
                $dateEnd =  new \DateTime(date("Y-m-d H:i:s",  $t + 24*60*60 ));

                if( $detail == "daily" ){
                    $countZeegas = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findProjectsCountByDates( $dateBegin, $dateEnd );
                    $countAllNewUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:User")->findNewUsersCountByDates( $dateBegin, $dateEnd );
                    
                    $countUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateEnd );
                    $countNewUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateEnd, true );
                    $countActiveUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateEnd, null, 1 );
                    $countActiveNewUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateEnd, true, 1 );
                    
                    $daily [ $i ] = array( 
                            "date" => date('M d, Y', $t ), 
                            "count" => $countZeegas,
                            "allNewUsersCount" => $countAllNewUsers,
                            "usersCount" => $countUsers,
                            "newUsersCount" => $countNewUsers,
                            "activeUsersCount" => $countActiveUsers,
                            "activeNewUsersCount" => $countActiveNewUsers,
                            "dateBegin" => $dateBegin,
                            "dateEnd" => $dateEnd
                    );
                }

                if( $i % 7 == 0 ){
                    $dateWeekEnd =  new \DateTime(date("Y-m-d H:i:s",  $t + 7*24*60*60 ));
                    $weekPrevious =  new \DateTime(date("Y-m-d H:i:s",  $t - 7*24*60*60 ));
                    $fourWeekPrevious =  new \DateTime(date("Y-m-d H:i:s",  $t - 4*7*24*60*60 ));

                    $countZeegas = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findProjectsCountByDates( $dateBegin, $dateWeekEnd );
                    $countAllNewUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:User")->findNewUsersCountByDates( $dateBegin, $dateWeekEnd );
                

                    $countUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd );
                    $countNewUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd, true );
                    $countActiveUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd, null, 1 );
                    $countActiveNewUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd, true, 1 );
                    

                    

                    //$countActiveReturningUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd, null, 0, $weekPrevious );
                    //$countActiveLongReturningUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd, null, 0, $fourWeekPrevious );


                    $weekly [ $i / 7 ] = array( 
                        "date" => "Week of ".date('M d, Y', $t ), 
                        "count" => $countZeegas,
                        "allNewUsersCount" => $countAllNewUsers,
                        "usersCount" => $countUsers, 
                        "newUsersCount" => $countNewUsers, 
                        "activeUsersCount" => $countActiveUsers, 
                        "activeNewUsersCount" => $countActiveNewUsers,
                        //"activeReturningUsersCount" => $countActiveReturningUsers,
                        //"activeLongReturningUsersCount" => $countActiveLongReturningUsers,
                        "dateBegin" => $dateBegin,
                        "dateEnd" => $dateEnd
                    );
                }

                $t = $t + 24*60*60;
                $i++;
                $this->get('doctrine_mongodb')->getManager()->clear();

            }

            $totalZeegas = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findByPublished(true)->count();
            $activeUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( new \DateTime(date("Y-m-d H:i:s",  0 )), new \DateTime(date("Y-m-d H:i:s")), null, 0 );
            $activeOneUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( new \DateTime(date("Y-m-d H:i:s",  0 )), new \DateTime(date("Y-m-d H:i:s")), null, 1 );
            $activeFiveUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( new \DateTime(date("Y-m-d H:i:s",  0 )), new \DateTime(date("Y-m-d H:i:s")), null, 5 );
            $activeTenUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( new \DateTime(date("Y-m-d H:i:s",  0 )), new \DateTime(date("Y-m-d H:i:s")), null, 10 );
            $activeTwentyUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( new \DateTime(date("Y-m-d H:i:s",  0 )), new \DateTime(date("Y-m-d H:i:s")), null, 20 );
            $activeFiftyUsers = $this->getDoctrine()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( new \DateTime(date("Y-m-d H:i:s",  0 )), new \DateTime(date("Y-m-d H:i:s")), null, 50 );
            $this->get('doctrine_mongodb')->getManager()->clear();

            $totals=array(
                    "totalZeegas"=>$totalZeegas,
                    "activeUsers"=>$activeUsers,
                    "activeOneUsers"=>$activeOneUsers,
                    "activeFiveUsers"=>$activeFiveUsers,
                    "activeTenUsers"=>$activeTenUsers,
                    "activeTwentyUsers"=>$activeTwentyUsers,
                    "activeFiftyUsers"=>$activeFiftyUsers
                );

            
            return $this->render('ZeegaAdminBundle:Analytics:index.html.twig', array(
                    "daily"=>array_reverse($daily),
                    "weekly"=>array_reverse($weekly),
                    "totals"=>$totals
                ));
        }
    }  
}
