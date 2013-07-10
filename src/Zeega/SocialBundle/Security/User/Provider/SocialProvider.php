<?php

namespace Zeega\SocialBundle\Security\User\Provider;

use HWI\Bundle\OAuthBundle\OAuth\Response\UserResponseInterface;
use HWI\Bundle\OAuthBundle\Security\Core\User\FOSUBUserProvider as BaseClass;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class SocialProvider extends BaseClass
{
    //https://gist.github.com/danvbe/4476697

    /**
     * {@inheritDoc}
     */
    public function connect($user, UserResponseInterface $response)
    {
        $property = $this->getProperty($response);
        $username = $response->getUsername();

        //on connect - get the access token and the user ID
        $service = $response->getResourceOwner()->getName();

        $setter = 'set'.ucfirst($service);
        $setter_id = $setter.'Id';
        $setter_token = $setter.'AccessToken';

        //we "disconnect" previously connected users
        if (null !== $previousUser = $this->userManager->findUserBy(array($property => $username))) {
            $previousUser->$setter_id(null);
            $previousUser->$setter_token(null);
            $this->userManager->updateUser($previousUser);
        }

        //we connect current user
        $user->$setter_id($username);
        $user->$setter_token($response->getAccessToken());

        $this->userManager->updateUser($user);
    }

    /**
     * {@inheritdoc}
     */
    public function loadUserByOAuthUserResponse(UserResponseInterface $response)
    {
        $username = $response->getUsername();
        $user = $this->userManager->findUserBy(array($this->getProperty($response) => $username));
        //when the user is registrating
        if (null === $user) {
            $data = $response->getResponse();
            $paths = $response->getPaths();

            // read the response data
            $accessToken = $response->getAccessToken();
            $realName = $response->getRealname();

            // get the service name
            $service = $response->getResourceOwner()->getName();
            
            // set methods name (e.g. setFacebook)
            $setter = 'set'.ucfirst($service);
            $setter_id = $setter.'Id';
            $setter_token = $setter.'AccessToken';
            // create a new user
            $user = $this->userManager->createUser();
            $user->$setter_id($username);
            $user->$setter_token($accessToken);            
            $user->setPassword('');
            $user->setEnabled(true);
            $user->setDisplayName($realName);
            $user->setRequestExtraInfo(true);

            if ( isset($paths["email"]) ) {
                $email = $paths["email"];
                if ( isset( $data[$email] ) ) {
                    $user->setEmail($data[$email]);    
                }
            }

            if ( isset($paths["thumbnailUrl"]) ) {
                $thumbnailUrl = $paths["thumbnailUrl"];
                if ( isset( $data[$thumbnailUrl] ) ) {
                    $thumbnail = str_replace("_normal","",$data[$thumbnailUrl]);
                    $user->setThumbUrl($thumbnail);    
                }
            }

            if ( isset($paths["bio"]) ) {
                $bio = $paths["bio"];
                if ( isset( $data[$bio] ) ) {
                    $user->setBio($data[$bio]);    
                }
            }

            if ( ucfirst($service) == "Facebook" ) {
                $user->setThumbUrl("http://graph.facebook.com/$username/picture?width=200&height=200");
            }

            $this->userManager->updateUser($user);
            return $user;
        }

        //if user exists - go with the HWIOAuth way
        $user = parent::loadUserByOAuthUserResponse($response);

        $serviceName = $response->getResourceOwner()->getName();
        $setter = 'set' . ucfirst($serviceName) . 'AccessToken';

        //update access token
        $user->$setter($response->getAccessToken());

        return $user;
    }

}
