<?php
	if(isset($_POST["artist"]))
	{
		require_once 'php-echonest-api/lib/EchoNest/Autoloader.php';
		EchoNest_Autoloader::register();
	
		$apiKey = '8OP3MFZQJTFQFHMXN';
	
		$echonest = new EchoNest_Client();
		$echonest->authenticate($apiKey);
	
		// search in artist API
		// $artistApi = $echonest->getArtistApi();
		// $results = $echonest->getArtistApi()->search(array('name' => 'Radiohead'));
	
		// searc in song API
		$songApi = $echonest->getSongApi();
		$songSearchParams = array(
			'artist' => $_POST["artist"],
			'bucket' => 'id:rdio-us-streaming',
			'limit' => 'true',
			'results' => '100'
			);
		
		$results = $songApi->search($songSearchParams);
		//print_r($results);
	}
?>

<html>
    <head>
        <title>Music search</title>
		<link rel="stylesheet" type="text/css" href="musicsearch.css" />
		<script src="jquery-1.5.1.min.js"></script>
	  	<script src="https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
	  	<script src="token.js"></script>
	  	<script src="musicsearch.js"></script>
    </head>
    <body>
		<form action="musicsearch.php" method="post">
			<div id="searchControls">
				Artist: <input type="text" name="artist"/>
				<input type="submit" value="Search"/><br/>
				<!--
				<input type="checkbox" name="vehicle" value="Rdio" />Search at rdio.com
				<input type="checkbox" name="vehicle" value="FMA" /> Search at freemusicarchive.com<br />
				-->
			</div>
		</form>
		<div id="searchResults">
	        <ul>
				<?php if(isset($results)): ?>
				<?php foreach ($results as $song): ?>
					<?php if(isset($song['foreign_ids'][0]['foreign_id'])): ?>
					<li>
					
				    	<a target="blank_" href="http://localhost:8888/metalab-wfmu-hack/hello-web-playback/hello.html?id=
							<?php $songId = explode(":", $song['foreign_ids'][0]['foreign_id']) ?>
							<?php echo $songId[2] ?>"
						>
				        	<?php 
								if(strlen($song['title']) > 50)
									$song['title'] = substr($song['title'], 0, 50);
								echo $song['title'] 
							?>
				        </a>
						<input type="button" class="preview" value="Preview" id="echonest-<?php echo $songId[2]?>"/>
						<input type="button" class="add-to-zeega" id="<?php echo $song['artist_name']; echo '--'; echo $song['title']; echo '--'; echo $songId[2]; ?>" value="Add to Zeega"/>
				   	</li>
					<?php endif; ?>
				<?php endforeach; ?>
				<?php endif; ?>
	        </ul>
		</div>
	
		<div id="audioPlayer">
			<div id="apiswf"></div>
			<dl>
			  <dt>playState</dt>
			  <dd id="playState"></dd>
			  <dd><img src="" id="art"></dd>
			  <dt>Track</dt>
			  <dd id="track"></dd>
			  <dt>Album</dt>
			  <dd id="album"></dd>
			  <dt>Artist</dt>
			  <dd id="artist"></dd>

			  <dt>position</dt>
			  <dd id="position"></dd>
			</dl>
			<div id="freq">
				<div></div>
				  <div></div>
				  <div></div>
				  <div></div>
				  <div></div>
				  <div></div>
				  <div></div>
				  <div></div>
				  <div></div>
				  <div></div>
			</div>
			<button id="stop">Stop</button>
		</div>
    </body>
</html>
