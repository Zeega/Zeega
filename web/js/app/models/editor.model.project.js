(function(Project){

	Project.Model = Backbone.Model.extend({
		
		default_attr : {
		},
		
		url : function(){ return zeega.app.url_prefix+"api/projects/"+this.id },
		
		initialize : function( attributes )
		{
			_.defaults( this.get('attr'), this.default_attr );
			
			//remove dupe data from the attributes
			this.unset('sequences',['silent']);
			this.unset('frames',['silent']);
			this.unset('layers',['silent']);
			
			this.createLayerCollection(attributes.layers);
			this.createFrameCollection(attributes.frames);
			this.createSequenceCollection( attributes.sequences );
			
			console.log('init PROJECT')
			console.log(this)
		},

		/*	create collections	*/

		createLayerCollection : function( layers )
		{
			var Layers = zeega.module('layer');
			this.layers = new Layers.MasterCollection( layers );
		},
		createFrameCollection : function( frames )
		{
			var Frames = zeega.module('frame');
			this.frames = new Frames.Collection( frames );
		},
		createSequenceCollection : function( sequences )
		{
			var Sequence = zeega.module("sequence");
			this.sequences = new Sequence.Collection( sequences );
			this.sequences.render();
			zeega.app.currentSequence = this.sequences.at(0);
		},
		
		/*	end create collections	*/
		
		loadProject : function()
		{
			// make view for project here //
			this.view = new Project.Views.Editor({model:this});
			this.view.render();
			this.trigger('ready')
		},
		loadPublishProject : function()
		{
			// publishing view for project //
			this.view = new Project.Views.Publish({model:this});
			this.view.render();
		},
		
		update : function( newAttr, silent )
		{
			var _this = this;
			_.extend( this.get('attr'), newAttr );
			if( !silent )
			{
				this.save({},{
					success : function(){ _this.trigger('update') }
				});
			}
		},
		
	});

})(zeega.module("project"));