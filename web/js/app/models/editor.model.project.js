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
		},
		
		createSequences : function( sequences )
		{
			var _this = this;
			var Sequence = zeega.module("sequence");
			this.sequences = [];
			_.each( sequences, function(sequence){
				_this.sequences.push( new Sequence.Model( sequence ) );
			});
			this.trigger('ready')
		}
		
	});

})(zeega.module("project"));