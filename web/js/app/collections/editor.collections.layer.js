(function(Layer){

	Layer.ViewCollection = Backbone.View.extend({
		initialize : function()
		{
			console.log('LAYER COLLECTION INIT')
			
			this.displayLayers = new Layer.Collection();
			
			this.layerList = new Layer.LayerListViewCollection({collection:this.displayLayers});
			this.visualEditor = new Layer.ViewCollection.VisualEditor({collection:this.displayLayers});
		},
		
		addLayer : function( args )
		{
			var _this = this
			var newLayer;
			
			//args = {item, type, frame}
			if( _.isUndefined( args.item ) )
			{
				console.log('new layer from tray')
				console.log(args)
				newLayer = new Layer.Model({type:args.type});
				this.collection.add( newLayer );
				if( args.show ) this.displayLayers.add( newLayer );
				this.updateFrame( args.frame, newLayer);

			}
			else
			{
				console.log( args.item )
				if( args.show ) this.displayLayers.add( newLayer );
				this.updateFrame( args.frame, newLayer);
			}
			
			newLayer.save({},{
				success : function( savedLayer )
				{
					console.log(savedLayer)
					_this.updateFrame( args.frame, savedLayer )
				}
			});
			
		},
		
		updateFrame : function(frame,layer)
		{
			console.log('updateAndSaveFrameLayer');
			console.log(frame.id)
			console.log(layer.id)
			
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
		
		renderLayers : function( layerIDArray )
		{
			var _this = this;
			this.displayLayers.reset();
			
			_.each( layerIDArray, function( layerID ){
				console.log( _this )
				console.log( _this.collection.get( layerID ) )
				//_this.displayLayers.add( _this.collection.get( layerID ) );
			})
			
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
				_this.$el.append( layerView.render().el );
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
				this.$el.append( layerView.render().el );
			}
		}
		
	});
	
	Layer.ViewCollection.VisualEditor = Backbone.View.extend({
		
		el : $('#visual-editor-workspace'),
		
		initialize : function()
		{
			console.log('INIT')
			this.collection.on('add', this.placeLayer, this );
			this.collection.on('reset', this.reset, this );
			this._layerViews = [];
			this.render();
		},

		render : function()
		{
			console.log('RENDER OUTER')
			console.log( this.collection )
			var _this = this;
			this._isRendered = true;
		
			//clear out any old stuff inside this.el
			this.$el.empty();
			//add EACH model's view to the _this.el and render it
			_.each( _.toArray( this.collection ), function( layerModel ){
				
				console.log('RENDER VISUAL')
				console.log(layerModel)
				
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
		}
		
	});
		
	Layer.Collection = Backbone.Collection.extend({
		model : Layer.Model
		//url : function(){ return Zeega.url_prefix+"sequences/"+ Zeega.sequence.id +"/layers" }
	});

})(zeega.module("layer"));

