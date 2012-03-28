(function(Frame){


	Frame.Collection = Backbone.Collection.extend({
		model: Frame.Model,
		url : function(){ return zeega.app.url_prefix+"sequences/"+ zeega.app.sequence.id +"/frames" },
		
		initialize : function()
		{
			console.log('frames collection')
			console.log(this)
			
			this.on('add', this.addFrame , this);
		},
		
		render : function()
		{
			
		},
		
		addFrame : function()
		{
			
		},
		
		removeFrame : function()
		{
			
		}
		
		
	});
	
/*	
	Frame.ViewCollection = Backbone.View.extend({
		
		//set the location where the frames are to be drawn
		el : $('#frame-list'),
	
		initialize : function()
		{
			this._frameViews = [];
			
			this.collection.on('add', this.add, this);
			//if there are no frames, then add one automagically
			if(this.collection.length == 0) this.collection.add( new Frame.Model() )
			this.render();

		},
		
		render : function()
		{
			var _this = this;
			this._rendered = true;
		
			//clear out any old stuff inside this.el
			this.$el.empty();
			//add EACH model's view to the _this.el and render it
			_.each( _.toArray( this.collection ), function( frameModel ){
				var frameView = new Frame.Views.FrameSequence({model:frameModel});
				_this._frameViews.push( frameView);
				_this.$el.append( frameView.render().el );
			});
			return this;
		},
		
		addPersistence : function( layerID )
		{
			console.log(zeega.app.project.sequences[0])
			_.each( _.toArray(this.collection), function(frame){
				if( !frame.inFocus )
				{
					console.log(frame)
					var layerArray = frame.get('layers');
					console.log(layerArray)
					if( ! _.include( layerArray, layerID ) )
					{
						if( _.isArray(layerArray) ) layerArray.unshift(layerID);
						else layerArray = [layerID];
						frame.set( 'layers', layerArray );
						frame.save();
					}
				}
			});
		},
		
		removePersistence : function( layerID )
		{
			_.each( _.toArray(this.collection), function(frame){
				if( !frame.inFocus )
				{
					var layerArray = frame.get('layers');
					if( _.include( layerArray, layerID ) )
					{
						frame.set( 'layers', _.without(layerArray,layerID) );
						frame.save();
					}
				}
			});
		},
		
		addFrame : function( frameModel )
		{
			if( _.isUndefined( frameModel) ) this.collection.add( new Frame.Model() );
			else this.collection.add( frameModel );
		},
	
		add : function(frame)
		{
			var _this = this;
			//save frame if the layer is new!
			if( frame.isNew() )
			{
				//if(zeega.app.currentFrame) frame.set({'attr':{'editorHidden':zeega.app.currentFrame.get('attr').editorHidden}});
				console.log( 'frame is new. URL is: '+ frame.url() )
			
				frame.save(
					{},
					{
						success : function( savedFrame )
						{
							console.log('savedFrame')
							console.log(savedFrame)

							if(frame.dupe) 
							{
								console.log('frame is a duplicate')
								_this.insertView(new Frame.Views.FrameSequence({ model : frame }), frame.frameIndex );
							
								//clone layers and place them into the layer array
								_.each( savedFrame.oldLayerIDs , function(layerID, i){

									//if layer is persistent
									//replace frameIndex the id with the persistent id

									var persistLayers = zeega.app.project.sequences[0].get('attr').persistLayers;

									if( _.include( persistLayers, parseInt(layerID) ) )
									{
										var layerOrder = savedFrame.get('layers');
										layerOrder[i] = String(layerID);
										savedFrame.set({layers:layerOrder})
									}
									else
									{
										zeega.app.project.sequences[0].layers.duplicateLayer( layerID, savedFrame.get('layers')[i] );
									}
								})
								//resave the frame after being updated with persistent frame ids
							
							}
							else
							{
								console.log('BLANK NODE')
								_this.insertView( new Frame.Views.FrameSequence({ model : frame }) );
						
								//add persisting layers to new frames
								var persistLayers = zeega.app.project.sequences[0].get('attr').persistLayers;
								savedFrame.set( 'layers', persistLayers );
							}
							
							zeega.app.loadFrame(savedFrame);
							if( savedFrame.hasChanged() ) savedFrame.save();
							
							_this.collection.trigger('updateFrameOrder');
						
						} // success
					}
				
				);
				
			}else{
				frame.url = zeega.app.url_prefix+'frames/'+ frame.id;
				this.insertView(new FrameView({ model : frame }));
			}
			
		},

		insertView : function( view, index )
		{
		
			//	push the frameView to the collection
			//should be placed after the current frame
			this._frameViews.push(view);
			//	if already rendered
			//	append to the rendered view
			if (this._rendered) 
			{
				if( _.isUndefined(index) ) $(this.el).append(view.render().el);
				else $(this.el).children('li:eq('+index+')').after(view.render().el);
			}
		}
	});
*/


})(zeega.module("frame"));
