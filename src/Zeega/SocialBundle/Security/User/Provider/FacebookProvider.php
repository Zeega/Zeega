<?php

namespace Zeega\SocialBundle\Security\User\Provider;

use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\HttpKernel\Log\LoggerInterface;
use Symfony\Component\Validator\Validator;

use FOS\UserBundle\Doctrine\UserManager;
use \BaseFacebook;
use \FacebookApiException;

class FacebookProvider implements UserProviderInterface
{
    /**
     * @var \Facebook
     */
    protected $facebook;
    protected $userManager;
    protected $validator;

    public function __construct(BaseFacebook $facebook, UserManager $userManager, Validator $validator, LoggerInterface $logger)
    {
        $this->facebook = $facebook;
        $this->userManager = $userManager;
        $this->validator = $validator;
    }

    public function supportsClass($class)
    {
        return $this->userManager->supportsClass($class);
    }

    public function loadUserByUsername($username)
    {
        // check if this user registered before using facebook
        $user = $this->userManager->findUserBy(array('facebookId' => $username));

        // connect to facebook?
        try {
            $facebookUserData = $this->facebook->api('/me');
        } catch (FacebookApiException $e) {
            $facebookUserData = null;
        }

        // TODO use http://developers.facebook.com/docs/api/realtime

        if ( !empty($facebookUserData) ) {
            // we a have a facebook user
            if ( empty($user) ) {
                // the user never logged in with facebook before

                // check if there's a user with the same email
                if ( isset($facebookUserData['email']) ) {
                    $user = $this->userManager->findUserBy(array('email' => $facebookUserData['email']));
                }
                
                if( !isset($user) ) {
                    $user = $this->userManager->createUser();
                    $user->setEnabled(true);
                    $user->setPassword('');
                    
                    if ( isset($facebookUserData['first_name']) ) {
                        $user->setDisplayName($facebookUserData['first_name']);
                    }

                    if ( isset($facebookUserData['last_name']) ) {
                        $userDisplayName = $user->getDisplayName();
                        if (isset($userDisplayName) ) {
                            $name = $userDisplayName . " " . $facebookUserData['last_name'];
                        } else {
                            $name = $facebookUserData['last_name'];
                        }
                        $user->setDisplayName($name);
                    }
                    
                    if ( isset($facebookUserData['email']) ) {
                        $user->setEmail($facebookUserData['email']);
                        $user->setUsername($facebookUserData['email']);
                    }


                    
                }
            }
    
            if (isset($facebookUserData['id'])) {
                $facebookUserId = $facebookUserData['id'];
                $user->setFacebookId($facebookUserId);
                $user->addRole('ROLE_FACEBOOK');

                $username = $user->getUsername();
                if ( !isset($username) ) {
                    $user->setUsername($facebookUserId);
                }

                $user->setThumbUrl("http://graph.facebook.com/$facebookUserId/picture?width=200&height=200");
            }
            
            if (count($this->validator->validate($user, 'Facebook'))) {
                // TODO: the user was found obviously, but doesnt match our expectations, do something smart
                throw new UsernameNotFoundException('The facebook user could not be stored');
            }

            $this->userManager->updateUser($user);
        }

        if (empty($user)) {
            throw new UsernameNotFoundException('The user is not authenticated on facebook');
        }

        return $user;
    }

    public function refreshUser(UserInterface $user)
    {
        if (!$this->supportsClass(get_class($user)) || !$user->getFacebookId()) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', get_class($user)));
        }

        return $this->loadUserByUsername($user->getFacebookId());
    }
}
