<?php

/*
* This file is part of Zeega.
*
* (c) Zeega <info@zeega.org>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Zeega\CoreBundle\Service;

use Symfony\Component\HttpFoundation\Response;

use Zeega\CoreBundle\Controller\BaseController;

class EmailService
{
    public function __construct($mailer)
    {
        $this->mailer = $mailer;
    }

    public function sendEmail($template, $data)
    {
        if ( isset($data["to"]) ) {
            $message = \Swift_Message::newInstance()
                ->setSubject($data["subject"])
                ->setFrom($data["from"])
                ->setTo($data["to"]);

            $headers = $message->getHeaders();
            $headers->addTextHeader('X-MC-MergeVars', json_encode($data["template_data"]));
            $headers->addTextHeader('X-MC-Template', $template);
            
            $this->mailer->send($message);
        }
    }
}
