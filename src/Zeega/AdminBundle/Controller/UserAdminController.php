<?php
// src/Tutorial/BlogBundle/Controller/TagAdminController.php
namespace Zeega\AdminBundle\Controller;

use Sonata\AdminBundle\Controller\CRUDController as Controller;
use Sonata\AdminBundle\Datagrid\ProxyQueryInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;

class UserAdminController extends Controller
{
    public function batchActionActivate(ProxyQueryInterface $selectedModelQuery)
    {
        $users = $selectedModelQuery->execute();
        $modelManager = $this->admin->getModelManager();
        
        $hostname = $this->container->getParameter('hostname');
        $hostDirectory = $this->container->getParameter('directory');
        
        try 
        {
            foreach ($users as $user) 
            {
                $userIsLocked = $user->isLocked();
                if($userIsLocked == true)
                {
                    $user->setEnabled(true);
                    $user->setLocked(false);
                    if (null === $user->getConfirmationToken()) {
                        $tokenGenerator = $this->container->get("fos_user.util.token_generator");
                        $user->setConfirmationToken($tokenGenerator->generateToken());
                    }
                    $user->setPasswordRequestedAt(new \DateTime('now'));
                    $modelManager->update($user);
                
                    $activationUrl = $hostname . $hostDirectory ."resetting/reset/" . $user->getConfirmationToken();

                    $message = \Swift_Message::newInstance()
                            ->setSubject('Welcome to Zeega!')
                            ->setFrom(array('noreply@zeega.org'=>'Zeega'))
                            ->setTo($user->getEmail())
                            ->setBody($this->renderView('ZeegaAdminBundle:Users:account_activated.txt.twig', array('username' => $user->getDisplayName(), 'activationURL' => $activationUrl)))
                        ;
                    $this->get('mailer')->send($message);
                }
            }
        } 
        catch (\Exception $e) 
        {
            $this->get('session')->setFlash('sonata_flash_error', 'Something went wrong...');
            return new RedirectResponse($this->admin->generateUrl('list',$this->admin->getFilterParameters()));
        }
        
        
            
        $this->get('session')->setFlash('sonata_flash_success', 'The users were activated successfully.');

        return new RedirectResponse($this->admin->generateUrl('list',$this->admin->getFilterParameters()));
    }
}
