(function(Project){

	Project.Model = Backbone.Model.extend({
		
		url : function(){ return zeega.app.url_prefix+"projects/"+this.id },
		
		initialize : function( attributes )
		{
			this.unset('sequences',['silent'])
			this.createSequences( attributes.sequences );
		},

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
		getAllFrameThumbnails : function()
		{
			var frames = this.sequences.at(0).frames.models;
			var frameThumbs = [];
			for(var i=0;i<frames.length;i++){
				var frame = frames[i];
				frameThumbs.push(frame.get('thumbnail_url'));
			}
			return frameThumbs;
				
		},
		createSequences : function( sequences )
		{
			var _this = this;
			var Sequence = zeega.module("sequence");
			
			this.sequences = new Sequence.Collection( sequences );

			zeega.app.currentSequence = this.sequences.at(0);
			console.log(zeega.app.currentSequence)

		}
		
	});

})(zeega.module("project"));