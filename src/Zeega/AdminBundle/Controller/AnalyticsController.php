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

                $initialTime = mktime ( 0, 0, 0, 1, 1, 2013 );
            }
            
            $t = $initialTime;
            $i=0;

            while( $t < $currentTime ){
                $dateBegin = date("Y-m-d H:i:s", $t );
                $dateEnd = date("Y-m-d H:i:s",  $t + 24*60*60 );

                if( $detail == "daily" ){
                    $countZeegas = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findProjectsCountByDates( $dateBegin, $dateEnd );
                    $countAllNewUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findNewUsersCountByDates( $dateBegin, $dateEnd );
                    
                    $countUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateEnd );
                    $countNewUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateEnd, true );
                    $countActiveUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateEnd, null, 1 );
                    $countActiveNewUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateEnd, true, 1 );
                    
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

                    $countZeegas = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findProjectsCountByDates( $dateBegin, $dateWeekEnd );
                    $countAllNewUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findNewUsersCountByDates( $dateBegin, $dateWeekEnd );
                

                    $countUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd );
                    $countNewUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd, true );
                    $countActiveUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd, null, 1 );
                    $countActiveNewUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( $dateBegin, $dateWeekEnd, true, 1 );
                    $weekly [ $i / 7 ] = array( 
                        "date" => "Week of ".date('M d, Y', $t ), 
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

                $t = $t + 24*60*60;
                $i++;

            }

            $totalZeegas = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findProjectsCountByDates( date("Y-m-d H:i:s",  0 ), date("Y-m-d H:i:s",  $currentTime) );
            $activeUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( date("Y-m-d H:i:s",  0 ), date("Y-m-d H:i:s"), null, 0 );
            $activeOneUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( date("Y-m-d H:i:s",  0 ), date("Y-m-d H:i:s"), null, 1 );
            $activeFiveUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( date("Y-m-d H:i:s",  0 ), date("Y-m-d H:i:s"), null, 5 );
            $activeTenUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( date("Y-m-d H:i:s",  0 ), date("Y-m-d H:i:s"), null, 10 );
            $activeTwentyUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( date("Y-m-d H:i:s",  0 ), date("Y-m-d H:i:s"), null, 20 );
            $activeFiftyUsers = $this->getDoctrine()->getEntityManager()->getRepository("ZeegaDataBundle:Project")->findActiveUsersCountByDates( date("Y-m-d H:i:s",  0 ), date("Y-m-d H:i:s"), null, 50 );

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
