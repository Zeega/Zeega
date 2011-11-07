
// To use the playback API you need to obtain a playback token for your domain.
// The simplest way to do this is to grab the rdio-python library:
//   https://github.com/rdio/rdio-python
// and use the rdio-call tool to get a playback token for your domain
//   ./rdio-call --consumer-key=YOUR_CONSUMER_KEY --consumer-secret=YOUR_CONSUMER_SECRET getPlaybackToken domain=YOUR_DOMAIN
// it will respond with
//   {"status": "ok", "result": "YOUR_PLAYBACK_TOKEN"}
// if you want to do playback as a particular user, pass --authenticate to rdio-call
// then update playback_token below with YOUR_PLAYBACK_TOKEN and the domain below with YOUR_DOMAIN

var playback_token = "GAlNi78J_____zlyYWs5ZG02N2pkaHlhcWsyOWJtYjkyN2xvY2FsaG9zdEbwl7EHvbylWSWFWYMZwfc=";
var domain = "localhost";

/*
var playback_token = "GA9OoGEX_____2s1NmJ3OGtrNjhoNTZxejhhOG1lNmgzOGFscGhhLnplZWdhLm9yZ-f8_u5g1y5xfVUoELFHCa8=";
var domain = "alpha.zeega.org";
*/
