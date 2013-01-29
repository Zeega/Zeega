<?php

namespace Zeega\SocialBundle\Security\User\Provider;

use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpKernel\Log\LoggerInterface;

use \TwitterOAuth;
use FOS\UserBundle\Doctrine\UserManager;
use Symfony\Component\Validator\Validator;

class TwitterProvider implements UserProviderInterface
{
    /** 
     * @var \Twitter
     */
    protected $twitter_oauth;
    protected $userManager;
    protected $validator;
    protected $session;

    public function __construct(TwitterOAuth $twitter_oauth, UserManager $userManager,Validator $validator, Session $session, LoggerInterface $logger)
    {   
        $this->twitter_oauth = $twitter_oauth;
        $this->userManager = $userManager;
        $this->validator = $validator;
        $this->session = $session;
        $this->logger = $logger;
    }   

    public function supportsClass($class)
    {   
        return $this->userManager->supportsClass($class);
    }   

    public function findUserByTwitterUsername($twitterUsername)
    {   
        return $this->userManager->findUserBy(array('twitterUsername' => $twitterUsername));
    }   

    public function loadUserByUsername($username)
    {
        
        $user = $this->findUserByTwitterUsername($username);

        $this->twitter_oauth->setOAuthToken( $this->session->get('access_token') , $this->session->get('access_token_secret'));

        try {
             $info = $this->twitter_oauth->get('account/verify_credentials');
        } catch (Exception $e) {
             $info = null;
        }

        if (!empty($info)) {
            if (empty($user)) {
                $user = $this->userManager->createUser();
                $user->setEnabled(true);
                $user->setPassword('');
            }

            $username = $info->screen_name;


            $user->setTwitterID($info->id);
            $user->setTwitterUsername($username);
            $user->setUsername($username);
            $user->setEmail('');
            $user->setDisplayname($info->name);

            try {
                $this->twitter_oauth->decode_json = FALSE;
                $twitterThumbnail = $this->twitter_oauth->get( "users/profile_image/luisfbrandao",array("size" => "original") );
                $url = preg_match('/<a href="(.+)">/', $twitterThumbnail, $match);
                $imageUrl = parse_url($match[1]);
        
                if( False !== $imageUrl ) {
                     $user->setThumbUrl( $match[1] ); 
                }
                
            } catch (Exception $e) {
                $this->logger->err( 'Something went wrong getting the twitter profile image ' . $e->getMessage() );
            }
            
            $this->userManager->updateUser($user);
        }

        if (empty($user)) {
            throw new UsernameNotFoundException('The user is not authenticated on twitter');
        }

        return $user;

    }

    public function refreshUser(UserInterface $user)
    {
        if (!$this->supportsClass(get_class($user)) || !$user->getTwitterID()) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', get_class($user)));
        }

        return $this->loadUserByUsername($user->getTwitterID());
    }
}