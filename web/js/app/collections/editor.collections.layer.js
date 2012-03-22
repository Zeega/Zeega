(function(Layer){

	Layer.MasterCollection = Backbone.Collection.extend({
		
		initialize : function()
		{
			//create a display collection that will have layer models
			//copied into it and then displayed ad hoc
			this.displayCollection = new Layer.DisplayCollection();
		},
		
		renderLayers : function( layerIDArray )
		{
			var _this = this;
			_.each( _.toArray( this.displayCollection ), function(layer){
				layer.unrenderLayerFromEditor();
			})
			this.displayCollection.reset();
			
			_.each( layerIDArray, function( layerID ){
				_this.displayCollection.add( _this.get( layerID ) );
			})
		},
		
		unrenderLayers : function()
		{
			_.each( _.toArray( this.displayCollection ), function(layer){
				layer.unrenderLayerFromEditor();
			});
			this.displayCollection.reset();
		},
		
		addNewLayer : function( args )
		{
			var _this = this
			var newLayer;
			console.log('ADD NEW LAYER')
			console.log(args)
			
			//args = {item, type, frame}
			if( _.isUndefined( args.item ) )
			{
				console.log('add non item layer type');

				newLayer = new Layer[args.type]();
	
				this.add( newLayer );
				if( args.show ) this.displayCollection.add( newLayer );
				
			}
			else
			{
				//media item layer
				console.log( args.item.get('layer_type'))
				
				newLayer = new Layer[args.item.get('layer_type')]({
					type: args.item.get('layer_type'),
					attr: {
						'item_id' : args.item.id,
						'title' : args.item.get('title'),
						'url' : args.item.get('uri'),
						'uri' : args.item.get('uri'),
						'thumbnail_url' : args.item.get('thumbnail_url'),
						'attribution_url' : args.item.get('attribution_uri'),
						'citation':true,
					}
				});
				this.add( newLayer );
				if( args.show ) this.displayCollection.add( newLayer );
			}
			console.log(newLayer)
			
			console.log('SAVE NEW LAYER')
			
			newLayer.save({},{
				success : function( savedLayer )
				{
					console.log('SAVED NEW LAYER')
					console.log(savedLayer)
					_this.addLayerToFrame( args.frame, savedLayer )
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
			dupeLayer.set('id', newLayerID );
			this.add(dupeLayer);
		},
		
		addLayerToFrame : function(frame,layer)
		{
			var layerOrder = [ parseInt( layer.id ) ];
			if( frame.get('layers') )
			{
				//if the layer array already exists eliminate false values if they exist
				layerOrder = _.compact( frame.get('layers') );
				//add the layer id to the layer order array
				layerOrder.push( parseInt( layer.id ) );
			}
			//set the layerOrder array inside the frame
			frame.set({'layers':layerOrder});
			frame.save();
		},
		
		removeLayer : function(layer){ this.removeLayerFromFrame(layer) },
		
		removeLayerFromFrame : function( layer, frame )
		{
			/*
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
			*/
		}
		
	});
	
	Layer.DisplayCollection = Backbone.Collection.extend({
		
		initialize : function()
		{
			this.on('add', function(layer){ console.log(layer); layer.renderLayerInEditor() } );
		}
		
	});


///// deprecated vvvvvvvvvvvv

	Layer.ViewCollection = Backbone.View.extend({
		
		initialize : function()
		{
			console.log('LAYER COLLECTION INIT')
			this.collection.on('destroy', this.removeLayer, this );
			this.displayLayers = new Layer.Collection();
			
			this.layerList = new Layer.LayerListViewCollection({collection:this.displayLayers});
			this.visualEditor = new Layer.ViewCollection.VisualEditor({collection:this.displayLayers});
		},
		
		addNewLayer : function( args )
		{
			var _this = this
			var newLayer;
			
			//args = {item, type, frame}
			if( _.isUndefined( args.item ) )
			{
				CONSOLE.LOG('DISPLAY OLD LAYER')
				//newLayer = new Layer.Model({type:args.type});
				newLayer = new Layer.Image({type:args.type});
				
				this.collection.add( newLayer );
				if( args.show ) this.displayLayers.add( newLayer );
			}
			else
			{
				//media item layer
				newLayer = new Layer.Model({
					type: args.item.get('layer_type'),
					attr: {
						'item_id' : args.item.id,
						'title' : args.item.get('title'),
						'url' : args.item.get('uri'),
						'uri' : args.item.get('uri'),
						'thumbnail_url' : args.item.get('thumbnail_url'),
						'attribution_url' : args.item.get('attribution_uri'),
						'citation':true,
					}
				});
				this.collection.add( newLayer );
				if( args.show ) this.displayLayers.add( newLayer );
			}
			console.log('SAVE NEW LAYER')
			newLayer.save({},{
				success : function( savedLayer )
				{
					console.log('SAVED NEW LAYER')
					console.log(savedLayer)
					_this.addLayerToFrame( args.frame, savedLayer )
				}
			});
			
		},
		
		/*
		adds an existing layer to the layer collection.
		Duplicated layers do not need saving
		*/
		duplicateLayer : function( oldLayerID, newLayerID )
		{
			var oldLayer = this.collection.get(oldLayerID);
			var dupeLayer = oldLayer.clone();
			dupeLayer.set('id', newLayerID );
			this.collection.add(dupeLayer);
		},
		
		addLayerToFrame : function(frame,layer)
		{
			var layerOrder = [ parseInt( layer.id ) ];
			if( frame.get('layers') )
			{
				//if the layer array already exists eliminate false values if they exist
				layerOrder = _.compact( frame.get('layers') );
				//add the layer id to the layer order array
				layerOrder.push( parseInt( layer.id ) );
			}
			//set the layerOrder array inside the frame
			frame.set({'layers':layerOrder});
			frame.save();
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
	
	Layer.LayerListViewCollection = Backbone.View.extend({
		
		el : $('#layers-list-visual'),
		
		initialize : function()
		{
			this.collection.on('add', this.placeLayer, this );
			this.collection.on('reset', this.reset, this );
			this._layerViews = []
			this.render();
		},

		render : function()
		{
			var _this = this;
			this._isRendered = true;
		
			//clear out any old stuff inside this.el
			this.$el.empty();
			//add EACH model's view to the _this.el and render it
			_.each( _.toArray( this.collection ), function( layerModel ){
				var layerView = new Layer.Views.LayerList({model:layerModel});
				_this._layerViews.push( layerView );
				_this.$el.prepend( layerView.render().el );
			});

			return this;
		},
		
		reset : function(){ this.$el.empty() },
		
		placeLayer : function( layerModel )
		{
			if( this._isRendered )
			{
				var layerView = new Layer.Views.LayerList({model:layerModel});
				this._layerViews.push( layerView );
				this.$el.prepend( layerView.render().el );
			}
		}
		
	});
	
	Layer.ViewCollection.VisualEditor = Backbone.View.extend({
		
		el : $('#visual-editor-workspace'),
		
		initialize : function()
		{
			console.log('INIT')
			this.collection.on('add', this.placeLayer, this );
			this.collection.on('destroy', this.destroyLayer, this);
			this.collection.on('reset', this.reset, this );
			this._layerViews = [];
			this.render();
		},

		render : function()
		{
			var _this = this;
			this._isRendered = true;
		
			//clear out any old stuff inside this.el
			this.$el.empty();
			//add EACH model's view to the _this.el and render it
			_.each( _.toArray( this.collection ), function( layerModel ){
				var layerView = new Layer.Views.VisualEditor({model:layerModel});
				_this._layerViews.push( layerView );
				_this.$el.append( layerView.render().el );
			});
		
			return this;
		},
		
		reset : function(){ this.$el.empty() },
		
		placeLayer : function( layerModel )
		{
			if( this._isRendered )
			{
				var layerView = new Layer.Views.VisualEditor({model:layerModel});
				this._layerViews.push( layerView );
				this.$el.append( layerView.render().el );
			}
		},
		
		destroyLayer : function( layerModel )
		{
			
		}
		
	});
		

})(zeega.module("layer"));

