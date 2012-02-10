var MySequencer = Backbone.Sequencer.extend({
	
	pushState : false,
	silent : true,
	
	sequences : {
		"/editor/frame/:frameid" : "gotoFrameInEditor",
		"/player/frame/:frameid" : "gotoFrameInPlayer",
	},

	// open/load the assigned frame
	gotoFrameInEditor : function(frameid)
	{
		//close the player if it's open
		if( Zeega.previewMode == true )
		{
			Player.close();
		}
		
		if(Zeega && frameid)
		{
			if(frameid == 'undefined') Zeega.url_hash.frame = '';
			else Zeega.url_hash.frame = frameid;
		}
		//check to see if the frame is already loaded, or if it should move to that frame
		if(Zeega.sequence.frames && Zeega.currentFrame.id != frameid) Zeega.loadFrame( Zeega.sequence.frames.get(frameid) );
	
	},

	gotoFrameInPlayer : function(frameid)
	{
		//go to the frame designated
		Player.gotoFrame( frameid );
	},
	
});
 
 
