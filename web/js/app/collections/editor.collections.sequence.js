(function(Sequence){
	
	Sequence.Collection = Backbone.Collection.extend({
		
		model : Sequence.Model,
				
		initialize : function()
		{
			this.on('remove',this.onRemove, this);
			this.sequenceTrayView = new Sequence.Views.SequenceTray({collection:this});
		},

		onRemove : function( model )
		{

			//destroy all link layers going into the sequence
			console.log('##		seq', model)

			// if viewing the removed sequence, then go to home
			if( this.length > 0 ) zeega.app.goToSequence( this.at(0).id );


			model.frames.each(function(frame){
				var linkLayers = frame.layers.where({ type : 'Link'});
				console.log('$$		found link layers', linkLayers, frame)
				_.each( linkLayers, function(layer){
					var from = layer.get('attr').from_frame;
					var to = layer.get('attr').to_frame;
					console.log('$$		remove from frames', layer, to, from, zeega.app.project.frames.get(to), zeega.app.project.frames.get(from))

					if(to) zeega.app.project.frames.get(to).layers.remove(layer)
					if(from) zeega.app.project.frames.get(from).layers.remove(layer)
				})
			})

			model.destroy();
			
			return false;
		},

	})
	
})(zeega.module("sequence"));
