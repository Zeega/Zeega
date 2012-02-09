/***	This is where everything starts	***/

var Sequence = Backbone.Model.extend({
	
	//set defaults for empty sequence	
	defaults : {
		
		'attr' : {'persistLayers':[]},
	
	},
		
	url : function()
	{
		console.log(Zeega.url_prefix);
		var base = Zeega.url_prefix+'sequences';
		if (this.isNew()) return base;
		return base + '/' + this.id;
	},

	initialize : function(){},
	
	loadFrames : function()
	{
		
		console.log('loading frames');
		
		var sequenceView = new SequenceView({ model : this });
				
		sequenceView.render();
		
		//create a frame collection inside the sequence model
		//console.log('frame view init');
		this.frames = new FrameCollection;
		//get all existing frames
		this.frames.fetch({
			success : function(frames)
			{
				//make a frame view collection
				//fancy!
				that.frameViewCollection = new FrameViewCollection({
					collection : frames
				});
				//render everything in the frameViewCollection
				that.frameViewCollection.render();
				
				/**	Load the first frame into the editor	**/
				loadFrame( frames.at(0) );
				
			}
		});
	}
	
});
