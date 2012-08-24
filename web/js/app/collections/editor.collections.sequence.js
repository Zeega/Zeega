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
			this.render();

			//destroy all link layers going into the sequence
			console.log('##		seq', model)

			// if viewing the removed sequence, then go to home
			if( this.length > 0 ) zeega.app.goToSequence( this.at(0).id );


			model.frames.each(function(frame){
				var linkLayers = frame.layers.where({ type : 'Link'});
				console.log('$$		found link layers', linkLayers)
				_.each( linkLayers, function(layer){
					var from = layer.get('attr').from_frame;
					var to = layer.get('attr').to_frame;
					if(to) zeega.app.project.frames.get(to).layers.remove(layer)
					if(from) zeega.app.project.frames.get(from).layers.remove(layer)
				})
			})

			model.destroy();
			// if sequence is in view, then load the first sequence
			
			return false;
		},

	})
	
})(zeega.module("sequence"));
