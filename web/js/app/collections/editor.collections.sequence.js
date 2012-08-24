(function(Sequence){
	
	Sequence.Collection = Backbone.Collection.extend({
		
		model : Sequence.Model,
				
		initialize : function()
		{
			this.on('remove',this.onRemove, this);
			//make sequence views
			$('#sequence-tabs').empty();
			this.on('add', this.drawSequenceTab, this)
		},
		
		render : function()
		{
			_.each( _.toArray(this), function(sequence, i){
				$('#sequence-tabs').append( sequence.tabView.render().el );
			})
			//this.at(0).trigger('focus');
		},
		
		drawSequenceTab : function( model )
		{
			$('#sequence-tabs').append( model.tabView.render().el );
		},

		onRemove : function( model )
		{
			//this.render();

			//destroy all link layers going into the sequence
			console.log('##		seq', model)

			// if viewing the removed sequence, then go to home
			if( this.length > 0 ) this.at(0).trigger('focus');

			//model.destroy();
			// if sequence is in view, then load the first sequence
			
			return false;
		},

	})
	
})(zeega.module("sequence"));
