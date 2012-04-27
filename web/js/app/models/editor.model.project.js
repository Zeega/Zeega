(function(Project){

	Project.Model = Backbone.Model.extend({
		
		default_attr : {
		},
		
		url : function(){ return zeega.app.url_prefix+"api/projects/"+this.id },
		
		initialize : function( attributes )
		{
			_.defaults( this.get('attr'), this.default_attr );
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
		createSequences : function( sequences )
		{
			var _this = this;
			var Sequence = zeega.module("sequence");
			this.sequences = new Sequence.Collection( sequences );
			this.sequences.render();
			console.log(this.sequences)

			zeega.app.currentSequence = this.sequences.at(0);
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