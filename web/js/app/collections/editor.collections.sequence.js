(function(Sequence){
	
	Sequence.Collection = Backbone.Collection.extend({
		
		model : Sequence.Model,
				
		initialize : function()
		{
			//make sequence views
			$('#sequence-tabs').empty();
			this.on('add', this.drawSequenceTab, this)
		},
		
		render : function()
		{
			_.each( _.toArray(this), function(sequence, i){
				$('#sequence-tabs').append( sequence.tabView.render().el );
			})
			this.at(0).trigger('focus');
		},
		
		drawSequenceTab : function( model )
		{
			$('#sequence-tabs').append( model.tabView.render().el );
		}

	})
	
})(zeega.module("sequence"));
