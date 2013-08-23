<?php
namespace Zeega\DataBundle\Service;

use Symfony\Component\HttpFoundation\Response;

class Neo4jService
{
    public function __construct($container) 
    {
        $this->container = $container;

        $neo4jHost = $this->container->getParameter('neo4j_host');
        $neo4jPort = $this->container->getParameter('neo4j_port');
        $this->client = new \Everyman\Neo4j\Client($neo4jHost, $neo4jPort);
    }

    public function getRelationshipEndNodes($startNodePattern, $endNodePattern, $relationshipName) {        
        $queryString = "START n1=node($startNodePattern), n2=node($endNodePattern) ".
            "MATCH n1-[:FOLLOW]->n2 ".
            "RETURN n2";
    }

    public function findUserByUsername($username) {
        $usernameIndex = $this->getIndex($this->client, "username");
        
        return $usernameIndex->findOne('username', $username);        
    }

    public function findUserFollowers($username) {
        $usernameIndex = $this->getIndex($this->client, "username");
        $user = $usernameIndex->findOne('username', $username);

        $queryString = "START n1=node(*), n2=node(".$user->getId().") ".
            "MATCH n1-[:FOLLOW]->n2 ".
            "RETURN n2";
    
        $query = new \Everyman\Neo4j\Cypher\Query($this->client, $queryString);
        $resultSet = $query->getResultSet();

        return $this->resultsetToArray($resultSet);
    }

    public function findUserFollowing($username) {
        $usernameIndex = $this->getIndex($this->client, "username");
        $graphUser = $usernameIndex->findOne('username', $username);

        $queryString = "START n1=node(".$graphUser->getId()."), n2=node(*) ".
            "MATCH n1-[:FOLLOW]->n2 ".
            "RETURN n2";
    
        $query = new \Everyman\Neo4j\Cypher\Query($this->client, $queryString);
        $resultSet = $query->getResultSet();
    
        return $this->resultsetToArray($resultSet);
    }

    public function createNewGraphUser($user) {
        // create the user
        $newUser = $this->client->makeNode();
        $newUser->setProperty('name', $user->getDisplayName())
            ->setProperty('username', $user->getUsername())
            ->setProperty('mongo_id', $user->getId())
            ->save();
        
        // add to username index
        $usernameIndex = new \Everyman\Neo4j\Index\NodeIndex($this->client, 'username');
        $usernameIndex->add($newUser, 'username', $user->getUsername());
        $usernameIndex->save();

        return new Response(json_encode(array("success" => true)));
    }

    public function followUser($followerUsername, $targetUsername) {
        // if the 'follower' is not a graph user, create it on neo4j        
        $followerGraphUser = $this->findUserByUsername($followerUsername);        
        if ( !isset($followerGraphUser) ) {
            $this->createNewGraphUser($followerGraphUser);
        }
        
        // if the 'target / followed user' is not a graph user, create it on neo4j
        $targetGraphUser = $this->findUserByUsername($targetUsername);                
        if ( !isset($targetGraphUser) ) {
            $user = $this->doctrine->getRepository('ZeegaDataBundle:User')->findOneByUsername($username);
            // TO-DO - invalid user check / handling
            $this->createGraphUser($user);
        }

        // check if the 'follower' already follows the 'target'
        $queryString = "START n1=node(".$followerGraphUser->getId()."), n2=node(".$targetGraphUser->getId().") ".
            "MATCH n1-[:FOLLOW]->n2 ".
            "RETURN n2";    
        $query = new \Everyman\Neo4j\Cypher\Query($this->client, $queryString);
        $result = count($query->getResultSet());

        // if the 'follower' is not following the 'target', follow them
        if ($result == 0) {
            $loggedGraphUser->relateTo($followedGraphUser, 'FOLLOW')->save();    
        }

        return new Response(json_encode(array("success" => true)));
    }

    public function getClient() {        
        return $this->client();
    }

    public function getIndex($client, $indexName) {
        return new \Everyman\Neo4j\Index\NodeIndex($client, $indexName);
    }

    private function resultsetToArray($resultSet) {
        $results = array();

        if (isset($resultSet) && isset($resultSet[0])) {
            foreach ($resultSet as $result) {
                array_push($results, $result[0]->getProperties());
            }
        }

        return $results;
    }
}
