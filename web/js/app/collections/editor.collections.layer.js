(function(Layer){

	Layer.MasterCollection = Backbone.Collection.extend({
		
		initialize : function()
		{
			//create a display collection that will have layer models
			//copied into it and then displayed ad hoc
			
			this.visible = []

		},
		
		addNewLayer : function( args )
		{
			var _this = this
			//var newLayer;
			console.log('ADD NEW LAYER')
	
			
			//args = {item, type, frame}
			if( _.isUndefined( args.item ) )
			{

				console.log('add non item layer type: '+args.type);

				var newLayer = new Layer[args.type]({attr:args.options});
				console.log( new Layer[args.type] )
				console.log(newLayer)
				this.add( newLayer );
				if( args.show() ) newLayer.trigger('editor_layerRender');
				this.saveLayer(newLayer, args.frame);
				return newLayer;
			}
			else
			{
				//media item layer
				console.log( args.item.get('layer_type'))
				
				var newLayer = new Layer[args.item.get('layer_type')]({
					type: args.item.get('layer_type'),
					attr: args.item.attributes
				});
			
				this.add( newLayer );
				if( args.show() ) newLayer.trigger('editor_layerRender');
				this.saveLayer(newLayer, args.frame);
				return newLayer;
			}
		},
		
		saveLayer : function(layerModel, frame)
		{
			console.log('SAVE NEW LAYER')
			console.log('save to: '+ layerModel.url() )
			
			var _this = this;
			layerModel.save({},{
				success : function( savedLayer )
				{
					console.log('SAVED NEW LAYER')
					console.log(savedLayer)
					savedLayer.trigger('refresh_view');
					savedLayer.trigger('layer_saved');
					_this.addLayerToFrame( frame, savedLayer );
					frame.trigger('update_thumb');
				}
			});
		},
		
		/*
		adds an existing layer to the layer collection.
		Duplicated layers do not need saving
		*/
		duplicateLayer : function( oldLayerID, newLayerID )
		{
			var oldLayer = this.get(oldLayerID);
			var dupeLayer = oldLayer.clone();
			dupeLayer.generateNewViews();
			dupeLayer.set('id', newLayerID );
			this.add(dupeLayer);
			oldLayer.save()
		},
		
		addLayerToFrame : function(frame,layer)
		{
			console.log('	ADD LAYER TO FRAME')
			if(frame.id != zeega.app.currentFrame)
			{
				if(frame.get('layers')) frame.get('layers').push(layer.id);
				else frame.set('layers',[layer.id]);
				frame.save();
				console.log(frame)
			}
			layer.trigger('update');
			zeega.app.updateLayerOrder( frame );
		},
		
		removeLayer : function(layer){ this.removeLayerFromFrame(layer) },
		
		removeLayerFromFrame : function( layer, frame )
		{
			
			if( _.isUndefined(frame) ) frame = zeega.app.currentFrame;
			if( frame.get('layers') )
			{
				//if the layer array already exists eliminate false values if they exist
				var layerOrder = _.without( frame.get('layers'), parseInt(layer.id) );
				if( layerOrder.length == 0 ) layerOrder.push(false);
				//set the layerOrder array inside the frame
				frame.set({'layers':layerOrder});
				frame.save();
			}
			
		}
		
	});

})(zeega.module("layer"));